import { useTranslation } from 'react-i18next'
export const OverlayNoRowsTemplate = ({ emptyTableText }) => {
  const { t } = useTranslation()
  return (
    <div
      style={{
        // width: '100%',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderRadius: 16,
        background: '#F9FAFB',
        border: '1.5px dashed #E2E8F0',
        margin: '20px',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='#D1D5DB' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
        <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
        <line x1='12' y1='22.08' x2='12' y2='12' />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>
          {emptyTableText?.title ? emptyTableText?.title : t('table.data.empty.title')}
        </div>
        <div style={{ fontSize: 13, color: '#9CA3AF', maxWidth: '460px', margin: '0 auto', lineHeight: '18px' }}>
          {emptyTableText?.description ? emptyTableText?.description : t('table.data.empty.description')}
        </div>
      </div>
    </div>
  )
}

export const OverlayLoadingTemplateFunc = () => `
    <div></div>
  `

export const icons = {
  menu: `<i class="fas fa-bars fa-lg"></i>`,
  sortAscending: `<i class="fas fa-arrow-up fa-lg"></i>`,
  sortDescending: `<i class="fas fa-arrow-down fa-lg"></i>`,
  menuPin: `<i class="fas fa-thumbtack fa-lg" style="padding-right: 12px; color: #119676;"></i>`,
  columnMovePin: `<i class="fas fa-thumbtack fa-lg" style="color: #119676;"></i>`,
  columnMoveMove: `<i class="fas fa-arrows-alt fa-lg" style="color: #119676;"></i>`,
  columnMoveHide: `<i class="fas fa-trash fa-lg" style="color: #EB5757;"></i>`,
  check: `<i class="fas fa-check fa-lg" style="color: #119676;"></i>`,
  smallRight: `<i class="fas fa-chevron-right fa-lg" style="color: #119676;"></i>`,
  groupContracted: `<i class="fas fa-chevron-right fa-lg" style="color: #119676;"></i>`,
  groupExpanded: `<i class="fas fa-chevron-down fa-lg" style="color: #119676;"></i>`,
  menuAddRowGroup: `<i class="fas fa-align-left fa-lg"  style="padding-right: 12px; color: #119676;"></i>`,
  menuRemoveRowGroup: `<i class="fas fa-align-left fa-lg"  style="padding-right: 12px; color: #119676;"></i>`,
}

export const HeaderCheckbox = ({ api, percentage, deleteAllProducts, addAllProducts, setSelectAll, checked, setChecked }) => {
  const selectAllCondition = !!setSelectAll && percentage > 0 && percentage < 100

  return (
    <div>
      {selectAllCondition && checked ? (
        <></>
      ) : selectAllCondition && !checked ? (
        <input disabled type='checkbox' style={{ cursor: 'not-allowed' }} />
      ) : (
        <input
          style={{ width: 14, height: 18, cursor: 'pointer' }}
          id='header-checkbox'
          type='checkbox'
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
            !!setSelectAll && setSelectAll(e.target.checked)
            if (e.target.checked) {
              api.selectAll()
              addAllProducts()
            } else {
              api.deselectAll()
              deleteAllProducts()
            }
          }}
        />
      )}
    </div>
  )
}
