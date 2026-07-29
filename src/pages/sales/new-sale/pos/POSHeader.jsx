import LogoMain from '@icons/LogoMain'
import RussianFlagIcon from '@icons/RussianFlagIcon'
import UzbekistanFlagIcon from '@icons/UzbekistanFlagIcon'
import UkFlagIcon from '@icons/UkFlagIcon'
import { Search, User, X, Printer, RefreshCw, Languages, Users, Lock, FileText, LogOut, ChevronRight } from 'lucide-react'
import './PosLayout.css'

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.1'

export default function POSHeader({
  time,
  cashboxName,
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
  onTempLogout,
  onCloseSession,
  receiptNumber,
  isReturnSale,
  onOpenPrinterSettings,
  isAgentRunning,
  onHardRefresh,
  onFocusLiveSearch,
  onEnterBarcodeSearch,
  onCloseLiveSearch,
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
      <div className='pos-header-left' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className='pos-header-brand'>
          <LogoMain />
        </div>
        <button
          type='button'
          className='pos-header-btn'
          onClick={onHardRefresh}
          title={t('pos.refresh')}
          style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Terminal status, cashier name, shift time */}
      <div className={`pos-header-center ${showSearchInput ? 'hide-for-search' : ''}`}>
        <div className='pos-status-bar'>
          <div className='pos-status-pill'>
            <span className='pos-status-pulse green'></span>
            {cashboxName && (
              <span
                title={cashboxName}
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  maxWidth: '140px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cashboxName}
              </span>
            )}
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item'>
            <span className='status-label'>{t('pos.receipt_id')}:</span>
            <span className='status-val'>{receiptNumber}</span>
          </div>
          {isReturnSale && (
            <>
              <div className='pos-header-divider'></div>
              <span className='pos-header-return-badge'>{t('pos.return.item_badge')}</span>
            </>
          )}
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

          <button
            type='button'
            className='pos-header-btn'
            onClick={(e) => { onOpenPrinterSettings(); setTimeout(() => e.currentTarget?.blur(), 0) }}
            title={t('pos.printer.title')}
            style={{ position: 'relative' }}
          >
            <Printer size={18} />
            {!isAgentRunning && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 10,
                  height: 10,
                  backgroundColor: '#e23a32',
                  borderRadius: '50%',
                  border: '2px solid #111217',
                }}
              />
            )}
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
                          {userData?.type === 'SUPER_ADMIN' || userData?.type === 'SUPERADMIN' ? 'Administrator' : userData?.position || 'Cashier'}
                        </div>
                      </div>
                    </div>
                    <button type='button' className='pos-std-close-btn' onClick={() => setShowLangDropdown(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  <div className='touch-modal-body'>
                    <div className='touch-modal-section-title' style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Languages size={13} />
                      {t('language')}
                    </div>
                    <div className='touch-lang-options' style={{ flexDirection: 'row', marginBottom: '18px' }}>
                      <button
                        onClick={() => i18n.changeLanguage('uz')}
                        className={`touch-lang-btn ${i18n.language === 'uz' ? 'is-active' : ''}`}
                        style={{ height: '48px', padding: '0 12px', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className='touch-lang-flag'><UzbekistanFlagIcon /></span>
                        <span style={{ fontSize: '13px' }}>UZ</span>
                      </button>

                      <button
                        onClick={() => i18n.changeLanguage('ru')}
                        className={`touch-lang-btn ${i18n.language === 'ru' ? 'is-active' : ''}`}
                        style={{ height: '48px', padding: '0 12px', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className='touch-lang-flag'><RussianFlagIcon /></span>
                        <span style={{ fontSize: '13px' }}>RU</span>
                      </button>

                      <button
                        onClick={() => i18n.changeLanguage('en')}
                        className={`touch-lang-btn ${i18n.language === 'en' ? 'is-active' : ''}`}
                        style={{ height: '48px', padding: '0 12px', justifyContent: 'center', gap: '6px' }}
                      >
                        <span className='touch-lang-flag'><UkFlagIcon /></span>
                        <span style={{ fontSize: '13px' }}>EN</span>
                      </button>
                    </div>

                    <div className='touch-modal-section-title' style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={13} />
                      {t('pos.cashier_session')}
                    </div>
                    <div className='touch-lang-options'>
                      <button
                        type='button'
                        className='touch-lang-btn'
                        onClick={() => {
                          setShowLangDropdown(false)
                          onTempLogout()
                        }}
                      >
                        <div className='touch-lang-flag-name'>
                          <Lock size={18} />
                          <span>{t('pos.temp_logout')}</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>

                      <button
                        type='button'
                        className='touch-lang-btn'
                        onClick={() => {
                          setShowLangDropdown(false)
                          onCloseSession()
                        }}
                      >
                        <div className='touch-lang-flag-name'>
                          <FileText size={18} />
                          <span>{t('pos.close_session')}</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>

                      <button
                        type='button'
                        className='touch-lang-btn'
                        onClick={() => {
                          setShowLangDropdown(false)
                          onLogout('logoutConfirm')
                        }}
                      >
                        <div className='touch-lang-flag-name'>
                          <LogOut size={18} color='#e23a32' />
                          <span style={{ color: '#e23a32' }}>{t('pos.logout')}</span>
                        </div>
                        <ChevronRight size={16} color='#e23a32' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
            placeholder={t('pos.search_title') || 'Поиск товара...'}
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
            onFocus={onFocusLiveSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEnterBarcodeSearch(topbarSearchTerm)
              }
              if (e.key === 'Escape') {
                onCloseLiveSearch()
              }
            }}
          />
        )}
        <div className='search-hint'>Esc</div>
      </div>
    </header>
  )
}
