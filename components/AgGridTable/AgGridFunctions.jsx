import { useEffect } from 'react'
import addCssToElement from '../../utils/addCssToElement'

export const scrollShowHide = (agGridTableArea, agGridTableScroll) => {
  const tableBottom = Math.round(agGridTableArea?.[0]?.getBoundingClientRect()?.bottom)
  const tableRight = Math.round(agGridTableArea?.[0]?.getBoundingClientRect()?.right)
  const tableLeft = Math.round(agGridTableArea?.[0]?.getBoundingClientRect()?.left)

  const windowFullHeight = window.innerHeight
  const windowFullWidth = window.innerWidth

  if (tableBottom - windowFullHeight > 0) {
    addCssToElement(agGridTableScroll?.[0], {
      position: 'fixed',
      left: `${tableLeft}px`,
      right: `${windowFullWidth - tableRight}px`,
      width: 'auto',
    })
  } else {
    addCssToElement(agGridTableScroll?.[0], {
      position: 'static',
    })
  }
}

export const onDisplayedColumnsChanged = ({ api, updaterAction }) => {
  const newColumnDefs = api.getColumnDefs()?.filter((col) => col.field !== 'checkboxSelectionField')

  if (!!updaterAction && !!newColumnDefs?.length) {
    updaterAction(newColumnDefs)
  }
}

export const onColumnResized = ({ api, column, updaterAction }) => {
  const newColumnDefs = api
    .getColumnDefs()
    ?.filter((col) => col.field !== 'checkboxSelectionField')
    .map((col) => {
      return {
        ...col,
        width: col?.field === column?.colId ? column?.actualWidth : col?.width,
      }
    })
  updaterAction(newColumnDefs)
}

export const useScrollListener = (agGridTableArea, agGridTableScroll) => {
  useEffect(() => {
    document.addEventListener('scroll', () => scrollShowHide(agGridTableArea, agGridTableScroll), true)
    return () => document.removeEventListener('scroll', () => scrollShowHide(agGridTableArea, agGridTableScroll), true)
  }, [])
}

export const getMainMenuItems = (params) => {
  const columnId = params.column.getId()
  const columnPin = params.column.pinned
  const columnName = params.column.getColDef().headerName
  const columnActiveRowGroupStatus = !!params.column.getColDef()?.grouped
  const columnRowGroupStatus = params.column.isAllowRowGroup()
  const customMenuItems = []

  customMenuItems.push({
    icon: `<i class="fas fa-thumbtack fa-lg" style="padding-right: 12px; color: #119676;"></i>`,
    name: 'ag_grid.column_menu.pin_column',
    action: null,
    subMenu: [
      {
        name: 'ag_grid.column_menu.pin_left',
        action: () => {
          params.columnApi.setColumnPinned(columnId, 'left')
        },
        checked: columnPin === 'left',
      },
      {
        name: 'ag_grid.column_menu.pin_right',
        action: () => {
          params.columnApi.setColumnPinned(columnId, 'right')
        },
        checked: columnPin === 'right',
      },
      {
        name: 'ag_grid.column_menu.no_pin',
        action: () => {
          params.columnApi.setColumnPinned(columnId, null)
        },
        checked: columnPin === null,
      },
    ],
  })
  customMenuItems.push('separator')
  customMenuItems.push({
    name: 'ag_grid.column_menu.auto_size_this_column',
    action: () => {
      params.columnApi.autoSizeColumn(columnId)
    },
  })
  customMenuItems.push({
    name: 'ag_grid.column_menu.auto_size_all_columns',
    action: () => {
      params.columnApi.autoSizeAllColumns()
    },
  })
  customMenuItems.push('separator')

  customMenuItems.push('separator')

  if (columnRowGroupStatus) {
    customMenuItems.push({
      name: 'ag_grid.column_menu.expand_all',
      action: () => {},
    })
    customMenuItems.push({
      name: 'ag_grid.column_menu.collapse_all',
      action: () => {},
    })
  }
  return customMenuItems
}
