import { useEffect } from 'react'
import { get } from 'lodash'
import { requests } from '@utils/requests'
import { loadSvgAsEscposHex } from '@utils/escposImage'
import { DEFAULT_LAYOUTS } from './defaults'
import { buildSaleContext, buildZReportContext, findImageBlocks, renderReceipt } from './render'

// The receipt templates this till prints with, edited in the admin panel at
// /settings/receipts. The CRM resolves them per store (store → global →
// built-in) at GET v1/receipt-template/effective; this module keeps the last
// answer for the till's own store in memory and in localStorage, so a receipt
// never waits on the network and an offline till still prints its store's
// layout. Nothing cached yet (a fresh install that starts offline) prints the
// built-in layouts in ./defaults.

const STORAGE_KEY = 'receipt_templates'
// The admin panel tells whoever saves a template that tills pick it up within
// five minutes — this is that promise.
export const RECEIPT_TEMPLATE_REFRESH_MS = 5 * 60 * 1000
const BUILTIN_LOGO = '/MagnitLogoPremiumCheque.svg'
// The raster canvas every picture is drawn on — the geometry the built-in logo
// has always been printed with (see escposImage.js).
const PAPER_DOTS = 576

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

let cache = readStored() // { storeId, fetchedAt, layouts: { sale, return, z_report } }
let inflight = null
// `${width}|${src}` → Promise<'[HEX:…]' | null>. Rasterising is a canvas pass
// per picture, so it is done once per picture, not once per receipt.
const rasters = new Map()

const storeKey = (storeId) => storeId || 'global'

function remember(next) {
  cache = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota or a blocked storage: the copy in memory still serves this session.
  }
}

function raster(src, width) {
  const key = `${width}|${src}`
  if (!rasters.has(key)) {
    rasters.set(
      key,
      loadSvgAsEscposHex(src, width, PAPER_DOTS).catch((err) => {
        console.warn('Receipt picture failed to load:', err)
        rasters.delete(key)
        return null
      })
    )
  }
  return rasters.get(key)
}

async function rasterizePictures(layout) {
  let logoHex = null
  const images = {}
  await Promise.all(
    findImageBlocks(layout).map(async (block) => {
      const width = Number(block.width) || 400
      if (block.image) images[block.id] = await raster(block.image, width)
      else logoHex = await raster(BUILTIN_LOGO, width)
    })
  )
  return { logoHex, images }
}

/**
 * Fetches the store's templates and caches them. Never throws: a failure keeps
 * whatever was cached before. Resolves true when fresh templates arrived.
 */
export function refreshReceiptTemplates(storeId) {
  if (inflight) return inflight
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve(false)

  inflight = requests
    .getEffectiveReceiptTemplates(storeId)
    .then((res) => {
      const layouts = {}
      ;(get(res, 'data.data') || []).forEach((tpl) => {
        if (tpl?.kind && Array.isArray(tpl.layout?.blocks) && tpl.layout.blocks.length) layouts[tpl.kind] = tpl.layout
      })
      if (!Object.keys(layouts).length) return false
      // Pictures that left the template would otherwise stay rasterised forever.
      rasters.clear()
      remember({ storeId: storeKey(storeId), fetchedAt: Date.now(), layouts })
      // Rasterise ahead of time, so the first receipt prints without that wait.
      Object.values(layouts).forEach((layout) => rasterizePictures(layout))
      return true
    })
    .catch(() => false)
    .finally(() => {
      inflight = null
    })
  return inflight
}

/** The layout a receipt of `kind` prints with right now, for this store. */
export function getReceiptLayout(kind, storeId) {
  // A copy cached for another store is not this store's receipt.
  const layout = cache?.storeId === storeKey(storeId) ? cache.layouts?.[kind] : null
  return layout?.blocks?.length ? layout : DEFAULT_LAYOUTS[kind]
}

function refreshIfStale(storeId) {
  const fresh = cache?.storeId === storeKey(storeId) && Date.now() - (cache.fetchedAt || 0) < RECEIPT_TEMPLATE_REFRESH_MS
  if (!fresh) refreshReceiptTemplates(storeId)
}

// A template the renderer cannot handle must not cost the customer a fiscal
// receipt: fall back to the built-in layout for that kind.
function renderSafely(kind, layout, buildCtx) {
  try {
    return renderReceipt(layout, buildCtx())
  } catch (err) {
    console.error('Receipt template failed to render, printing the built-in layout:', err)
    return renderReceipt(DEFAULT_LAYOUTS[kind], buildCtx())
  }
}

/**
 * Lines for a sale or return receipt, for the print agent's /print/raw-template.
 *
 * @param {object} req        the receipt payload the POS assembles (see PosApp handleLocalPrint)
 * @param {{storeId?: string, name?: string, address?: string}} storeInfo
 */
export async function buildSaleReceiptLines(req, storeInfo = {}) {
  const kind = req?.chequeType === 'return' ? 'return' : 'sale'
  refreshIfStale(storeInfo.storeId)
  const layout = getReceiptLayout(kind, storeInfo.storeId)
  const pictures = await rasterizePictures(layout)
  return renderSafely(kind, layout, () => buildSaleContext(req, { ...storeInfo, ...pictures }))
}

/**
 * Lines for the Z-report (shift close) receipt.
 *
 * @param {object} zrepo      the enriched report card-shift-details assembles
 * @param {{storeId?: string, name?: string, address?: string, kassaNumber?: string, cashier?: string}} storeInfo
 */
export async function buildZReportReceiptLines(zrepo, storeInfo = {}) {
  refreshIfStale(storeInfo.storeId)
  const layout = getReceiptLayout('z_report', storeInfo.storeId)
  const pictures = await rasterizePictures(layout)
  return renderSafely('z_report', layout, () => buildZReportContext(zrepo, { ...storeInfo, ...pictures }))
}

/**
 * Keeps this till's templates fresh while a screen that prints is open: once on
 * mount, then every five minutes and whenever the connection comes back.
 */
export function useReceiptTemplateSync(storeId) {
  useEffect(() => {
    refreshReceiptTemplates(storeId)
    const timer = setInterval(() => refreshReceiptTemplates(storeId), RECEIPT_TEMPLATE_REFRESH_MS)
    const onOnline = () => refreshReceiptTemplates(storeId)
    window.addEventListener('online', onOnline)
    return () => {
      clearInterval(timer)
      window.removeEventListener('online', onOnline)
    }
  }, [storeId])
}
