import React from 'react'
import LogoMain from '@icons/LogoMain'
import { Search, Keyboard, User, Power, ShieldAlert, Cpu } from 'lucide-react'
import './PosLayout.css'

export default function POSHeader({
  time,
  cashierName,
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
}) {
  return (
    <header className='pos-header-premium'>
      {/* Brand block */}
      <div className='pos-header-left'>
        <div className='pos-header-brand'>
          <LogoMain />
          <span className='pos-brand-tag'>POS</span>
        </div>
      </div>

      {/* Terminal status, cashier name, shift time */}
      <div className='pos-header-center'>
        <div className='pos-status-bar'>
          <div className='pos-status-pill'>
            <span className='pos-status-pulse green'></span>
            <span className='pos-status-text'>{t('pos.scanner_ready')}</span>
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item'>
            <span className='status-label'>Terminal:</span>
            <span className='status-val'>E012 - root</span>
          </div>
          <div className='pos-header-divider'></div>
          <div className='pos-status-item'>
            <User size={14} style={{ marginRight: 6, color: '#9CA3AF' }} />
            <span className='status-val'>{cashierName || 'PharmaCosmos'}</span>
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
          {showSearchInput && (
            <div className='pos-header-search-wrapper'>
              <input
                type='text'
                className='pos-header-search-input'
                placeholder={t('pos.enter_barcode')}
                autoFocus
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
            </div>
          )}

          <button 
            className={`pos-header-btn ${showSearchInput ? 'is-active' : ''}`} 
            onClick={() => setShowSearchInput(!showSearchInput)}
            title={t('pos.search_title')}
          >
            <Search size={18} />
          </button>
          
          <button className='pos-header-btn' title={t('pos.keyboard_status')}>
            <Keyboard size={18} />
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
              <div className='pos-lang-dropdown'>
                <div className='dropdown-title'>{t('language')}</div>
                <button
                  onClick={() => {
                    i18n.changeLanguage('uz')
                    setShowLangDropdown(false)
                  }}
                  className={`dropdown-item ${i18n.language === 'uz' ? 'active' : ''}`}
                >
                  🇺🇿 O&apos;zbekcha
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('ru')
                    setShowLangDropdown(false)
                  }}
                  className={`dropdown-item ${i18n.language === 'ru' ? 'active' : ''}`}
                >
                  🇷🇺 Русский
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('en')
                    setShowLangDropdown(false)
                  }}
                  className={`dropdown-item ${i18n.language === 'en' ? 'active' : ''}`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          <button className='pos-header-btn logout' onClick={onLogout} title={t('pos.logout')}>
            <Power size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
