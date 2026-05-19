import CheckAccess from './CheckAccess'
import { Download, Plus, ChevronUp, ChevronDown } from 'lucide-react'

export default function MgPageHeader({
  title,
  subtitle,
  onTitleClick,
  showStatsToggle = false,
  isOpenStats = false,
  onStatsToggle,
  showExport = false,
  onExport,
  exportLoading = false,
  showCreate = false,
  onCreate,
  createLabel = 'Создать',
  createPermissionId,
}) {
  const renderCreateButton = () => (
    <button
      type='button'
      className='mg-btn mg-btn-primary'
      onClick={onCreate}
      style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '12px',
        padding: '0 20px',
        fontSize: '14px',
        fontWeight: 600,
        background: '#111217',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <Plus size={16} />
      <span>{createLabel}</span>
    </button>
  )

  return (
    <div className='mg-page-header' style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1
          className='mg-page-title'
          onClick={onTitleClick}
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            color: '#111217',
            cursor: onTitleClick ? 'pointer' : 'default',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className='mg-page-subtitle' style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#667085', fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className='mg-page-actions' style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {showStatsToggle && (
          <button
            type='button'
            className='mg-btn mg-btn-secondary mg-btn-sm'
            onClick={onStatsToggle}
            style={{
              height: '40px',
              padding: '0 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #ECEDF2',
              borderRadius: '12px',
              background: '#fff',
              color: '#111217',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isOpenStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{isOpenStats ? 'Скрыть статистику' : 'Показать статистику'}</span>
          </button>
        )}

        {showExport && (
          <button
            type='button'
            className='mg-btn mg-btn-secondary mg-btn-sm'
            onClick={onExport}
            disabled={exportLoading}
            style={{
              height: '40px',
              padding: '0 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #ECEDF2',
              borderRadius: '12px',
              background: '#fff',
              color: '#111217',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: exportLoading ? 0.6 : 1,
            }}
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
        )}

        {showCreate && (createPermissionId ? <CheckAccess id={createPermissionId}>{renderCreateButton()}</CheckAccess> : renderCreateButton())}
      </div>
    </div>
  )
}
