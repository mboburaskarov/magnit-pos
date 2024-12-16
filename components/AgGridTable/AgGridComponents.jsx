// import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { Typography } from '@mui/material'
import EmptyTableData from '../../src/assets/icons/EmptyTableData'
import { useTranslation } from 'react-i18next'
export const OverlayNoRowsTemplate = ({ emptyTableText }) => {
  const { t } = useTranslation()
  return (
    <div className='no-rows-container'>
      <div className='no-rows-root'>
        <EmptyTableData />
        <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'bunker.950'}>
          {emptyTableText?.title ? emptyTableText?.title : t('table.data.empty.title')}
        </Typography>
        <Typography mb={'50px'} fontSize={'18px'} mt={'8px'} lineHeight={'28px'} fontWeight={'500'} color={'bunker.500'}>
          {emptyTableText?.description ? emptyTableText?.description : t('table.data.empty.description')}
        </Typography>
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
      ) : /* <CustomCircularProgress percentage={percentage} /> */
      selectAllCondition && !checked ? (
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
