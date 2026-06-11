import React, { useState, useEffect } from 'react'
import { Drawer } from '@mui/material'
import { X, Check } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
import { requests } from '@utils/requests'
import './PosLayout.css'

export default function PosQuickSelectDrawer({ open, onClose, onQuickAdd, isLoading, t }) {
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [addedProductId, setAddedProductId] = useState(null)

  // Fetch groups once when drawer opens
  useEffect(() => {
    if (!open) return
    setIsLoadingGroups(true)
    requests
      .getFastSelectGroups({ limit: 100, offset: 0 })
      .then((res) => {
        const items = res?.data?.data?.data || []
        setGroups(items)
        if (items.length > 0) setActiveGroupId(items[0].id)
      })
      .catch(() => {})
      .finally(() => setIsLoadingGroups(false))
  }, [open])

  // Fetch products when active group changes
  useEffect(() => {
    if (!activeGroupId) { setProducts([]); return }
    setIsLoadingProducts(true)
    requests
      .getFastSelectProducts({ group_id: activeGroupId, limit: 100, offset: 0 })
      .then((res) => {
        setProducts(res?.data?.data?.data || [])
      })
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false))
  }, [activeGroupId])

  const handleQuickAdd = (prod) => {
    onQuickAdd(prod.barcode)
    setAddedProductId(prod.id)
    setTimeout(() => setAddedProductId(null), 800)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      elevation={3}
      classes={{ paper: 'pos-quick-drawer-paper' }}
    >
      {/* Header */}
      <div className="pos-quick-drawer-header pos-std-header">
        <span className="pos-std-title">{t('pos.quick_select') || 'Quick select'}</span>
        <button type="button" className="pos-std-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="pos-quick-drawer-body">
        {/* Left Side: Product Grid */}
        <div className="pos-quick-grid-area">
          {isLoadingGroups || isLoadingProducts ? (
            <div style={{ padding: 24, color: 'var(--pos-text-secondary)', fontSize: 14 }}>
              Loading...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: 24, color: 'var(--pos-text-secondary)', fontSize: 14 }}>
              No products in this group
            </div>
          ) : (
            products.map((prod) => {
              const isAdded = addedProductId === prod.id
              return (
                <button
                  key={prod.id}
                  type="button"
                  className={`pos-quick-card ${isAdded ? 'is-added' : ''}`}
                  onClick={() => handleQuickAdd(prod)}
                  disabled={isLoading || isLoadingProducts}
                >
                  <div className="pos-quick-card-img-wrapper">
                    <span className="pos-quick-card-img">{prod.icon || '📦'}</span>
                  </div>
                  <span className="pos-quick-card-name">{prod.product_name}</span>
                  {isAdded ? (
                    <div className="pos-quick-card-added-badge">
                      <Check size={16} /> Added!
                    </div>
                  ) : (
                    <div className="pos-quick-card-price-row">
                      <span className="pos-quick-card-price">{thousandDivider(prod.retail_price)} UZS</span>
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Right Side: Group List */}
        <div className="pos-quick-sidebar">
          {groups.map((grp) => (
            <button
              key={grp.id}
              type="button"
              className={`pos-quick-category-btn ${activeGroupId === grp.id ? 'is-active' : ''}`}
              onClick={() => setActiveGroupId(grp.id)}
            >
              {grp.name_ru || grp.name_uz}
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
