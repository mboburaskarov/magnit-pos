import './PosLayout.css'

function PosZReportClosedModal({ open, onConfirm, onCancel, isLoading, t }) {
  if (!open) return null

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) onConfirm()
    if (e.key === 'Escape' && !isLoading) onCancel()
  }

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true' onKeyDown={handleKeyDown}>
      <div className='pos-security-modal'>
        <div className='pos-security-icon-container'>
          <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#1e9e52' strokeWidth='2.2'>
            <rect x='3' y='7' width='18' height='13' rx='2' />
            <path d='M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2' />
            <path d='M12 12v3' />
            <circle cx='12' cy='16.5' r='0.6' fill='#1e9e52' />
          </svg>
        </div>

        <div className='pos-security-title'>{t('pos.zreport.closed_title')}</div>

        <div className='pos-security-desc'>{t('pos.zreport.closed_desc')}</div>

        <div className='pos-security-actions'>
          <button type='button' onClick={onCancel} disabled={isLoading} className='pos-security-btn-cancel'>
            {t('pos.zreport.cancel')}
          </button>
          <button type='button' onClick={onConfirm} disabled={isLoading} className='pos-zreport-btn-confirm'>
            {isLoading ? t('pos.zreport.opening') : t('pos.zreport.open_confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PosZReportClosedModal
