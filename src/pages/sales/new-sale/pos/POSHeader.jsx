import React from 'react'
import LogoMain from '@icons/LogoMain'
import { Search, User, Power, X } from 'lucide-react'
import './PosLayout.css'

export default function POSHeader({
  time,
  cashierName,
  userData,
  showSearchInput,
  setShowSearchInput,
  topbarSearchTerm,
  setTopbarSearchTerm,
  handleBarcodeScan,
  showLangDropdown,
  setShowLangDropdown,
  t,
  i18n,
  onLogout,
  receiptNumber,
}) {
  const getShortName = (first, last) => {
    if (!first) return cashierName || 'Magnit'
    const cleanFirst = first.replace(/[()]/g, '').trim()
    const cleanLast = last ? last.replace(/[()]/g, '').trim() : ''

    const firstTokens = cleanFirst.split(/(?=[A-Z])|\s+/).filter(Boolean)
    if (firstTokens.length > 1) {
      return `${firstTokens[0]} ${firstTokens[1][0].toUpperCase()}.`
    }

    if (cleanLast) {
      const lastTokens = cleanLast.split(/(?=[A-Z])|\s+/).filter(Boolean)
      if (lastTokens.length > 0) {
        const lastToken = lastTokens[lastTokens.length - 1]
        return `${cleanFirst} ${lastToken[0].toUpperCase()}.`
      }
    }

    return cleanFirst
  }

  const getFullName = (first, last) => {
    if (!first) return cashierName || 'Magnit'
    const cleanFirst = first.replace(/[()]/g, '').trim()
    const cleanLast = last ? last.replace(/[()]/g, '').trim() : ''
    if (cleanLast) {
      return `${cleanFirst} (${cleanLast})`
    }
    return cleanFirst
  }

  const formattedShortName = getShortName(userData?.first_name, userData?.last_name)
  const formattedFullName = getFullName(userData?.first_name, userData?.last_name)

  return (
    <header className='pos-header-premium'>
      {/* Brand block */}
      <div className='pos-header-left'>
        <div className='pos-header-brand'>
          <LogoMain />
        </div>
      </div>

      {/* Terminal status, cashier name, shift time */}
      <div className={`pos-header-center ${showSearchInput ? 'hide-for-search' : ''}`}>
        <div className='pos-status-bar'>
          <div className='pos-status-pill'>
            <span className='pos-status-pulse green'></span>
            <span className='pos-status-text'>{t('pos.scanner_ready')}</span>
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item'>
            <span className='status-label'>{t('pos.receipt_id')}:</span>
            <span className='status-val'>{receiptNumber}</span>
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item'>
            <User size={14} style={{ marginRight: 6, color: '#9CA3AF' }} />
            <span className='status-val'>{formattedShortName}</span>
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item monospace'>
            <span className='status-val'>{time}</span>
          </div>
        </div>
      </div>

      {/* Actions and logout */}
      <div className='pos-header-right'>
        <div className='pos-header-actions'>
          <button
            className={`pos-header-btn ${showSearchInput ? 'is-active' : ''}`}
            onClick={() => setShowSearchInput(!showSearchInput)}
            title={t('pos.search_title')}
          >
            <Search size={18} />
          </button>

          <div className='pos-lang-container'>
            <button
              className={`pos-header-btn ${showLangDropdown ? 'is-active' : ''}`}
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              title={t('pos.language_profile')}
            >
              <User size={18} />
            </button>
            {showLangDropdown && (
              <div className='touch-modal-overlay' onClick={() => setShowLangDropdown(false)}>
                <div className='touch-modal-card' onClick={(e) => e.stopPropagation()}>
                  <div className='touch-modal-header pos-std-header'>
                    <div className='touch-modal-userinfo'>
                      <div className='touch-modal-avatar'>
                        <User size={20} />
                      </div>
                      <div>
                        <div className='touch-modal-username'>{formattedFullName}</div>
                        <div className='touch-modal-userrole'>
                          {userData?.type === 'SUPER_ADMIN' || userData?.type === 'SUPERADMIN' ? 'Administrator' : (userData?.position || 'Cashier')}
                        </div>
                      </div>
                    </div>
                    <button type='button' className='pos-std-close-btn' onClick={() => setShowLangDropdown(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className='touch-modal-body'>
                    <div className='touch-modal-section-title'>{t('language')}</div>
                    <div className='touch-lang-options'>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('uz')
                          setShowLangDropdown(false)
                        }}
                        className={`touch-lang-btn ${i18n.language === 'uz' ? 'is-active' : ''}`}
                      >
                        <div className='touch-lang-flag-name'>
                          <span className='touch-lang-flag'>🇺🇿</span>
                          <span>O&apos;zbekcha</span>
                        </div>
                        {i18n.language === 'uz' && (
                          <div className='touch-lang-checkmark'>✓</div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          i18n.changeLanguage('ru')
                          setShowLangDropdown(false)
                        }}
                        className={`touch-lang-btn ${i18n.language === 'ru' ? 'is-active' : ''}`}
                      >
                        <div className='touch-lang-flag-name'>
                          <span className='touch-lang-flag'>🇷🇺</span>
                          <span>Русский</span>
                        </div>
                        {i18n.language === 'ru' && (
                          <div className='touch-lang-checkmark'>✓</div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          i18n.changeLanguage('en')
                          setShowLangDropdown(false)
                        }}
                        className={`touch-lang-btn ${i18n.language === 'en' ? 'is-active' : ''}`}
                      >
                        <div className='touch-lang-flag-name'>
                          <span className='touch-lang-flag'>🇬🇧</span>
                          <span>English</span>
                        </div>
                        {i18n.language === 'en' && (
                          <div className='touch-lang-checkmark'>✓</div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className='pos-header-btn logout' onClick={onLogout} title={t('pos.cashier_session')}>
            <Power size={18} />
          </button>
        </div>
      </div>

      <div className={`pos-header-search-wrapper ${showSearchInput ? 'is-active' : ''}`}>
        <Search size={18} style={{ color: '#9ca3af', flexShrink: 0, marginRight: '12px' }} />
        {showSearchInput && (
          <input
            type='search'
            id='posSearchQuery'
            name='posSearchQuery'
            className='pos-header-search-input'
            placeholder={t('pos.enter_barcode')}
            autoFocus
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck={false}
            inputMode='search'
            data-lpignore='true'
            data-1p-ignore='true'
            data-bwignore='true'
            data-form-type='other'
            value={topbarSearchTerm}
            onChange={(e) => setTopbarSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBarcodeScan(topbarSearchTerm)
                setTopbarSearchTerm('')
                setShowSearchInput(false)
              }
              if (e.key === 'Escape') {
                setShowSearchInput(false)
              }
            }}
          />
        )}
        <div className='search-hint'>Esc</div>
      </div>
    </header>
  )
}
