import React, { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
import './PosLayout.css'

export default function PosLiveSearchPanel({
  open,
  query = '',
  products = [],
  isLoading = false,
  onSelect,
  onClose,
  t,
}) {
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Auto-hover the first product when the list changes
  useEffect(() => {
    if (products && products.length > 0) {
      setHoveredProduct(products[0])
    } else {
      setHoveredProduct(null)
    }
  }, [products])

  if (!open) return null

  // Determine the active product for preview (hovered product, or fallback to the first one)
  const previewProduct = hoveredProduct || (products.length > 0 ? products[0] : null)

  const handlePanelClick = (e) => {
    // Prevent closing when clicking inside the panel
    e.stopPropagation()
  }

  return (
    <div className='pos-live-search-panel' onClick={handlePanelClick}>
      {/* Panel Header */}
      <div className='pos-live-search-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} className='search-icon-dimmed' />
          <span className='pos-live-search-title'>
            {t?.('pos.search_title') || 'Результаты поиска'}
          </span>
          <span className='pos-live-search-count-badge'>
            {t?.('pos.product_select.found', { count: products.length }) || `Найдено: ${products.length}`}
          </span>
        </div>
        <button type='button' className='pos-live-search-close' onClick={onClose} title={t?.('pos.cancel') || 'Close'}>
          <X size={18} />
        </button>
      </div>

      {/* Main Results Container */}
      <div className='pos-live-search-body'>
        {/* Left Column: Product List */}
        <div className='pos-live-search-list-column'>
          {products.length > 0 ? (
            <div className='pos-live-search-list'>
              {products.map((product, index) => {
                const isHovered = hoveredProduct?.id === product.id
                return (
                  <div
                    key={`${product.id || ''}-${product.barcode || ''}-${index}`}
                    className={`pos-live-search-item ${isHovered ? 'is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredProduct(product)}
                    onClick={() => onSelect(product)}
                  >
                    <div className='pos-live-search-item-left'>
                      <div className='pos-live-search-item-name'>{product.name}</div>
                      <div className='pos-live-search-item-meta'>
                        {product.barcode && <span className='meta-barcode'>{product.barcode}</span>}
                        {product.barcode && <span className='meta-dot'>·</span>}
                        <span className='meta-stock'>
                          {t?.('leftover') || 'остаток'}: {product.pack_quantity ?? 0} {t?.('pos.unit.pcs') || 'шт'}
                        </span>
                      </div>
                    </div>
                    <div className='pos-live-search-item-right'>
                      <div className='pos-live-search-item-price'>
                        {thousandDivider(product.retail_price)} <span className='price-currency'>{t?.('pos.currency_short') || 'UZS'}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            !isLoading && (
              !query || !query.trim() ? (
                <div className='pos-live-search-empty'>
                  <div className='empty-emoji'>🔍</div>
                  <div className='empty-title'>{t?.('pos.search_instructions') || 'Поиск товаров'}</div>
                  <div className='empty-desc'>{t?.('pos.search_instructions_desc') || 'Введите название или штрих-код'}</div>
                </div>
              ) : (
                <div className='pos-live-search-empty'>
                  <div className='empty-emoji'>🔍</div>
                  <div className='empty-title'>{t?.('product_not_found') || 'Товар не найден'}</div>
                  <div className='empty-desc'>Проверьте название или штрих-код</div>
                </div>
              )
            )
          )}

          {/* Loading Indicator Overlay */}
          {isLoading && (
            <div className='pos-live-search-loading-overlay'>
              <div className='spinner'></div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pos-text-secondary)' }}>
                {t?.('pos.loading') || 'Загрузка...'}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Compact Details Preview */}
        <div className='pos-live-search-preview-column'>
          {previewProduct ? (
            <div className='pos-live-search-preview-card'>
              <div className='preview-label-header'>{t?.('pos.selected_item') || 'Детали товара'}</div>
              <div className='preview-name-title'>{previewProduct.name}</div>
              
              <div className='preview-details-list'>
                <div className='preview-details-row'>
                  <span className='detail-name'>{t?.('table_columns.barcode') || 'Штрих-код'}:</span>
                  <span className='detail-val monospace'>{previewProduct.barcode || '—'}</span>
                </div>
                
                <div className='preview-details-row'>
                  <span className='detail-name'>{t?.('price') || 'Цена'}:</span>
                  <span className='detail-val preview-price-highlight'>
                    {thousandDivider(previewProduct.retail_price)} {t?.('pos.currency_short') || 'UZS'}
                  </span>
                </div>

                <div className='preview-details-row'>
                  <span className='detail-name'>{t?.('leftover') || 'Остаток'}:</span>
                  <span className='detail-val'>
                    {previewProduct.pack_quantity ?? 0} {t?.('pos.unit.pcs') || 'шт'}
                  </span>
                </div>

                <div className='preview-details-row'>
                  <span className='detail-name'>{t?.('table_columns.type') || 'Тип'}:</span>
                  <span className='detail-val'>
                    {previewProduct.unit_per_pack > 1 ? (t?.('pos.unit.pack') || 'уп') : (t?.('pos.unit.pcs') || 'шт')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='pos-live-search-preview-placeholder'>
              <span>{t?.('pos.selected_item_placeholder') || 'Детали выбранного товара отобразятся здесь'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
