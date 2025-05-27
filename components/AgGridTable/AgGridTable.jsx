/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { Box } from '@mui/material'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import debounce from 'lodash/debounce'
import * as qs from 'qs'
import { Fragment, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrevious } from 'react-use'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import isEqual from '../../utils/isEqual'
import LoadingBlurry from '../LoadingBlurry'
import AgGridBottom from './AgGridBottom'
import { HeaderCheckbox, icons, OverlayLoadingTemplateFunc, OverlayNoRowsTemplate } from './AgGridComponents'
import { onColumnResized, onDisplayedColumnsChanged, scrollShowHide, useScrollListener } from './AgGridFunctions'
import CheckBoxRenderer from './CheckboxRenderer'
import useStyles from './useStyles'

// New prop for cell selection callback
const AgGridSimpleTable = ({
  id,
  emptyTableText,
  data,
  columns,
  gettingId = 'product_id',
  components,
  enableFillHandle = false,
  selection,
  navigateUrl,
  noRedirect = false,
  onCellValueChanged = () => {},
  enableGetRealTimeSelectedCellRowId = false,
  defaultOffsetSize = 10,
  defaultOffsetIndex = 1,
  offsetQuery = 'offset',
  limitQuery = 'limit',
  offsetCount: controlledOffsetCount,
  pagination = true,
  eventMessages,
  fullDownload,
  downloadByFilter,
  isDownloading,
  isDataLoading,
  fullInfoAboutCurrentPage = false,
  tableSettings = false,
  updaterAction,
  selectedRowsIds = [],
  setSelectAll,
  addAllProducts,
  deleteAllProducts,
  setRemovedItems,
  custonName = 'custonName',
  setAddedItems,
  resetTable,
  canCellClick = false,
  selectedCellRowId = () => {},
  realTimeSelectedCellRowId = () => {},
  totalData,
  onChangeSelectedCellRowId = () => {},
  columnGroup,
  uniqId = 'id',
  totalCount = 0,
  customDisplayColumnsChangeHandler,
  simpleTable,
  childRef = null,
  isRefreshing,
  status,
  onCellSelectionChange, // New prop to handle cell selection changes
}) => {
  const tableOffsetSizes = localStorage?.getItem('table_offset_sizes') ? JSON.parse(localStorage?.getItem('table_offset_sizes')) : {}
  const classes = useStyles()
  const location = useLocation()
  const { values } = useQueryParams()
  const [gridApi, setGridApi] = useState(null)
  const [offsetIndex, setOffsetIndex] = useState(defaultOffsetIndex)
  const [offsetSize, setOffsetSize] = useState(tableOffsetSizes?.[id] || defaultOffsetSize)
  const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(null)
  const [selectedCells, setSelectedCells] = useState([]) // New state for selected cells
  const OverlayLoadingTemplate = OverlayLoadingTemplateFunc()
  const allColumns = useMemo(() => gridApi?.columnApi?.getAllGridColumns(), [columns, gridApi])
  const popupParent = useMemo(() => document.querySelector('body'), [])
  const agGridTableArea = useMemo(() => document.getElementsByClassName('ag-root-wrapper-body'), [])
  const agGridTableScroll = useMemo(() => document.getElementsByClassName('ag-body-horizontal-scroll'), [])
  const rowData = useMemo(() => data, [data, totalData])
  useScrollListener(agGridTableArea, agGridTableScroll)
  const navigate = useNavigate()
  const gridApiRef = useRef(null)
  const columnApiRef = useRef(null)

  useImperativeHandle(childRef, () => ({
    focusCellByRowId: (rowId, colId) => {
      const api = gridApiRef.current
      const columnApi = columnApiRef.current
      if (!api || !columnApi) return

      const rowModel = api.getModel()
      const rowCount = rowModel.getRowCount()

      for (let i = 0; i < rowCount; i++) {
        const rowNode = rowModel.getRow(i)

        if (rowNode?.data?.[uniqId] === rowId) {
          const targetColId = colId || columnApi.getAllDisplayedColumns()?.[0]?.colId
          if (targetColId) {
            api.ensureIndexVisible(i) // Scroll to row
            api.setFocusedCell(i, targetColId)

            // Optional: DOM focus so keyboard nav works
            document.querySelector('.ag-root')?.focus()
          }
          break
        }
      }
    },
  }))
  const prevStatus = usePrevious(status)

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      cellClass: (params) => {
        // Add class for selected cells
        const isSelected = selectedCells.some((cell) => cell.rowId === params.data[uniqId] && cell.colId === params.column.colId)
        return isSelected ? 'cell-class selected-cell' : 'cell-class'
      },
      autoHeight: true,
      lockPosition: false,
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined) {
          return ''
        }
        return params.value
      },
      comparator: () => null,
      menuTabs: ['generalMenuTab'],
    }),
    [selectedCells, uniqId]
  )
  const cellSelection = useMemo(() => {
    return {
      handle: { mode: 'fill' },
    }
  }, [])
  const modifyColumns = useMemo(() => {
    if (selection) {
      return [
        {
          field: 'checkboxSelectionField',
          headerName: '',
          headerComponent: memo((props) => (
            <HeaderCheckbox
              deleteAllProducts={deleteAllProducts}
              addAllProducts={addAllProducts}
              setSelectAll={setSelectAll}
              checked={headerCheckboxChecked}
              setChecked={setHeaderCheckboxChecked}
              {...props}
            />
          )),
          cellRenderer: memo((props) => (
            <CheckBoxRenderer setAddedItems={setAddedItems} setRemovedItems={setRemovedItems} selectedRowsIds={selectedRowsIds} {...props} />
          )),
          width: 50,
          resizable: false,
          sortable: false,
          lockPosition: 'left',
          cellClass: 'cell-class', // Ensure checkbox column is not affected by cell selection styling
        },
        ...columns,
      ]
    }
    return columns
  }, [selection, columns, headerCheckboxChecked, selectedRowsIds])

  useHotkeys(
    'ctrl+shift',
    () => {
      if (!gridApi) return

      const focusedCell = gridApi.getFocusedCell()
      if (!focusedCell) return

      const rowNode = gridApi.getDisplayedRowAtIndex(focusedCell.rowIndex)
      const rowId = rowNode?.data?.[gettingId]

      if (rowId) {
        selectedCellRowId(rowId)

        // handleRowSubmit(rowId)
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )
  useHotkeys(
    ['ArrowUp', 'ArrowDown'],
    () => {
      if (!gridApi) return

      const focusedCell = gridApi.getFocusedCell()
      if (!focusedCell) return

      const rowNode = gridApi.getDisplayedRowAtIndex(focusedCell.rowIndex)
      const rowId = rowNode?.data?.[gettingId]

      if (rowId) {
        // if (!enableGetRealTimeSelectedCellRowId) {
        //   return
        // }
        realTimeSelectedCellRowId({ id: custonName, rowId })
        // handleRowSubmit(rowId)
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )
  // Handle cell selection
  const onCellClicked = useCallback(
    (params) => {
      // return
      console.log('k')

      if (params.column.colId === 'checkboxSelectionField') return // Ignore clicks on checkbox column
      const rowId = params.data[uniqId]
      const colId = params.column.colId
      const value = params.value

      setSelectedCells((prev) => {
        const existingIndex = prev.findIndex((cell) => cell.rowId === rowId && cell.colId === colId)
        let newSelectedCells
        if (existingIndex >= 0) {
          // Deselect cell if already selected
          newSelectedCells = prev.filter((_, index) => index !== existingIndex)
        } else {
          // Select new cell
          onChangeSelectedCellRowId(rowId)
          newSelectedCells = [...prev, { rowId, colId, value }]
        }
        // Notify parent component of selection change
        if (onCellSelectionChange) {
          onCellSelectionChange(newSelectedCells)
        }
        return newSelectedCells
      })
    },
    [uniqId, onCellSelectionChange]
  )

  useEffect(() => {
    const baseUrl = navigateUrl || location.pathname
    if (baseUrl && !noRedirect) {
      const offsetLimitParams = qs.stringify(
        {
          ...values,
          [limitQuery]: offsetSize,
          [offsetQuery]: offsetIndex == 0 ? 0 : (offsetIndex - 1) * offsetSize,
        },
        { addQueryPrefix: true }
      )

      navigate(`${baseUrl}${offsetLimitParams}`)
    }
  }, [offsetIndex, offsetSize, data, location.pathname, status])

  useEffect(() => {
    setOffsetIndex(0)
  }, [values?.store_id, values?.no_barcode, values?.vendor_id, values?.vendor_name, values?.payment_type_id, values?.cashbox_name])

  useEffect(() => {
    if (id) {
      const new_table_offset_sizes = JSON.stringify({
        ...tableOffsetSizes,
        [id]: offsetSize,
      })
      localStorage.setItem('table_offset_sizes', new_table_offset_sizes)
    }
  }, [offsetSize])

  const changeOffset = useCallback((newOffset) => {
    setOffsetIndex(newOffset)
  }, [])

  useEffect(() => {
    if (status !== prevStatus) {
      setOffsetSize(values?.limit || defaultOffsetSize)
      changeOffset(defaultOffsetIndex)
    }
  }, [status])

  const isRowSelectable = useCallback(() => {
    return true
  }, [])

  const pinnedBottomRowData = useMemo(() => {
    return totalData
  }, [totalData])
  useHotkeys(
    ['numenter', 'NumpadEnter'],
    (event) => {
      if (!gridApi) return
      const focusedCell = gridApi.getFocusedCell()
      if (focusedCell) {
        event.preventDefault()
        gridApi.startEditingCell({
          rowIndex: focusedCell.rowIndex,
          colKey: focusedCell.column.colId,
        })
      }
    },
    { enableOnFormTags: true }
  )
  const onGridReady = useCallback((params) => {
    setGridApi(params.api) // ✅ only the API, not the full params
    gridApiRef.current = params.api
    columnApiRef.current = params.columnApi
    setTimeout(() => scrollShowHide(agGridTableArea, agGridTableScroll), 1000)
  }, [])
  const getRowStyle = (params) => {
    console.log(params)

    if (params.node.rowPinned === 'bottom') {
      return {
        // fontWeight: 'bold',
        // backgroundColor: '#f8f9fa',
        // position: 'sticky',
        // bottom: 0,
        // zIndex: 1,
        // borderTop: '2px solid #dee2e6',
      }
    }
    return null
  }
  const getRowId = useCallback((params) => params.data[uniqId], [data, columns, totalData])

  return (
    <Fragment>
      <Box
        className={`${classes.root} ag-theme-alpine ${columnGroup ? 'column-group-header' : ''}`}
        id={id || 'simpleGrid'}
        // sx={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <AgGridReact
          rowBuffer={100} // Optional: how many rows outside viewport to render
          // domLayout='normal' // or "autoHeight", but avoid it with big data sets
          // domLayout='normal'
          // pagination={true}
          paginationPageSize={3000}
          groupDisplayType='multipleColumns'
          onGridReady={onGridReady}
          overlayNoRowsTemplate={'<span></span>'}
          overlayLoadingTemplate={OverlayLoadingTemplate}
          rowData={rowData}
          columnDefs={modifyColumns}
          paginationOffsetSize={offsetSize}
          components={components}
          rowSelection='multiple'
          getRowId={getRowId}
          defaultColDef={defaultColDef}
          suppressHorizontalScroll={true}
          isRowSelectable={isRowSelectable}
          domLayout='autoHeight'
          onDisplayedColumnsChanged={debounce((p) => onDisplayedColumnsChanged({ ...p, updaterAction }), 1000)}
          onColumnResized={debounce((p) => onColumnResized({ ...p, updaterAction }), 1000)}
          rowHeight={48}
          suppressRowClickSelection={true}
          suppressPaginationPanel={true}
          getRowStyle={getRowStyle}
          suppressContextMenu={true}
          suppressCellFocus={false} // Enable cell focus for cell selection
          icons={icons}
          // cellSelection={cellSelection}
          onCellValueChanged={onCellValueChanged}
          popupParent={popupParent}
          enableFillHandle={enableFillHandle}
          enableCellTextSelection={true}
          pinnedBottomRowData={pinnedBottomRowData}
          alwaysShowHorizontalScroll={true}
          debounceVerticalScrollbar={true}
          suppressAnimationFrame={true}
          animateRows={true}
          animateColums={true}
          onCellClicked={canCellClick && onCellClicked} // Add cell click handler
        />
        <LoadingBlurry isLoading={isDataLoading} height={-50} outside />
        {data?.length > 0 && pagination && (
          <AgGridBottom
            classes={classes}
            controlledOffsetCount={controlledOffsetCount}
            changeOffset={changeOffset}
            offsetIndex={offsetIndex}
            offsetQuery={offsetQuery}
            setOffsetIndex={setOffsetIndex}
            fullDownload={fullDownload}
            downloadByFilter={downloadByFilter}
            resetTable={resetTable}
            isRefreshing={isRefreshing}
            fullInfoAboutCurrentPage={fullInfoAboutCurrentPage}
            isDownloading={isDownloading}
            totalCount={totalCount}
            offsetSize={offsetSize}
            setOffsetSize={setOffsetSize}
            eventMessages={eventMessages}
          />
        )}
        {!data?.length && <OverlayNoRowsTemplate emptyTableText={emptyTableText} />}
      </Box>
    </Fragment>
  )
}

// Add CSS for selected cell styling
const styles = `
  .selected-cell {
    background-color: #e0f7fa !important; /* Light cyan for selected cells */
    border: 1px solid #0288d1 !important; /* Blue border for visibility */
  }
`

// Inject styles into the document
const styleSheet = document.createElement('style')
styleSheet.type = 'text/css'
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

export default memo(AgGridSimpleTable, (prevProps, nextProps) => isEqual(prevProps, nextProps))
