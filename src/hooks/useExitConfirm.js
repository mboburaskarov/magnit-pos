import { useCallback, useEffect, useRef, useState } from 'react'

// Module-level (not per-hook-instance) because the app itself triggers real
// unloads in many places — post-login redirect, shift open/close, error-page
// "Reload", cancelling a receipt, etc. (all via `window.location.reload()`/
// `.replace()`/`.href`). Those are intentional, not the user trying to leave,
// so they must call `bypassNextAppExit()` right before navigating, otherwise
// the guard shows the native "Leave site?" dialog on top of normal app flows.
let bypassUnloadOnce = false
let bypassResetTimer = null

export function bypassNextAppExit() {
  bypassUnloadOnce = true
  if (bypassResetTimer) clearTimeout(bypassResetTimer)
  // Safety net: if the expected navigation never actually happens, don't
  // leave the guard permanently disabled.
  bypassResetTimer = setTimeout(() => {
    bypassUnloadOnce = false
  }, 3000)
}

/**
 * Confirms before the user leaves the app.
 *
 * - Desktop (Chrome/Edge/Firefox, incl. installed PWA window): native
 *   `beforeunload` dialog on tab close / window close (Alt+F4) / refresh.
 *   Chrome only shows this once the user has interacted with the page at
 *   least once — this hook tracks that itself via the first pointerdown/keydown.
 *   Any navigation preceded by `bypassNextAppExit()` is let through silently.
 * - Android / WebView: intercepts the hardware back button / back gesture via
 *   the `history.pushState` + `popstate` trick and opens `isExitModalOpen` so
 *   a custom confirm modal (see `components/Dialogs/ExitConfirmModal.jsx`)
 *   can be rendered by the caller. "Yo'q" re-arms the guard so it keeps
 *   working on every subsequent back-press, not just the first one.
 * - `requestExit(onConfirm)` lets any in-app "Chiqish" button reuse the same
 *   modal/flow instead of the browser-driven triggers above.
 *
 * Mount this once, near the app root — every mount pushes its own history
 * "floor" entry, so mounting it more than once (or remounting on route
 * changes) stacks redundant history entries.
 *
 * Known limitations:
 * - `beforeunload` cannot show custom text; browsers force their own
 *   generic "leave site?" message for security reasons — the `message`
 *   argument below is effectively ignored by modern browsers.
 * - iOS Safari (including installed PWA / "Add to Home Screen") mostly
 *   ignores `beforeunload` — there is no reliable web API to intercept
 *   app close there.
 * - Pressing the Android "Home" button or opening "Recent apps" does not
 *   fire `popstate` and is NOT covered by this hook — only in-webview
 *   back navigation (hardware back key / back gesture) is.
 */
export default function useExitConfirm({ enabled = true } = {}) {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const hasInteractedRef = useRef(false)
  const allowNavigationRef = useRef(false)
  const pendingActionRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined

    const markInteracted = () => {
      hasInteractedRef.current = true
    }
    window.addEventListener('pointerdown', markInteracted, { once: true })
    window.addEventListener('keydown', markInteracted, { once: true })

    return () => {
      window.removeEventListener('pointerdown', markInteracted)
      window.removeEventListener('keydown', markInteracted)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined

    const handleBeforeUnload = (event) => {
      if (bypassUnloadOnce) {
        bypassUnloadOnce = false
        return undefined
      }
      if (!hasInteractedRef.current) return undefined
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined

    window.history.pushState({ __exitGuard: true }, '')

    const handlePopState = () => {
      if (allowNavigationRef.current) {
        allowNavigationRef.current = false
        return
      }
      // Re-arm the guard so back can be pressed again after "Yo'q".
      window.history.pushState({ __exitGuard: true }, '')
      pendingActionRef.current = null
      setIsExitModalOpen(true)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [enabled])

  const cancelExit = useCallback(() => {
    setIsExitModalOpen(false)
    pendingActionRef.current = null
  }, [])

  const confirmExit = useCallback(() => {
    setIsExitModalOpen(false)
    const pendingAction = pendingActionRef.current
    pendingActionRef.current = null

    if (pendingAction) {
      pendingAction()
      return
    }

    // No custom action was supplied (i.e. this was triggered by the back
    // button/gesture) — let the real navigation go through.
    allowNavigationRef.current = true
    window.history.go(-1)
  }, [])

  const requestExit = useCallback((onConfirm) => {
    pendingActionRef.current = typeof onConfirm === 'function' ? onConfirm : null
    setIsExitModalOpen(true)
  }, [])

  return { isExitModalOpen, confirmExit, cancelExit, requestExit }
}
