// import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

export const OverlayNoRowsTemplate = ({ emptyTableText }) => {
  return (
    <div className='no-rows-container'>
      <div className='no-rows-root'>
        <h3>{emptyTableText?.title ? emptyTableText?.title : 'Данные не найдены'}</h3>
        <p>{emptyTableText?.description ? emptyTableText?.description : ''}</p>
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

// export function CustomCircularProgress({ percentage }) {
//   return (
//     <div style={{ width: 18, height: 18 }}>
//       <CircularProgressbar
//         styles={buildStyles({
//           strokeLinecap: 'butt',
//           trailColor: '#EAEAEA',
//           pathColor: '#1F78FF',
//         })}
//         strokeWidth={24}
//         value={percentage}
//       />
//     </div>
//   )
// }

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
