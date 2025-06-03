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

const InfinityAgGridSimpleTable = ({
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
  pagination = false, // Changed to false for infinite scroll
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
  onCellSelectionChange,
  // New props for infinite scrolling
  onLoadMoreData, // Function to load more data
  hasMoreData = true, // Whether there's more data to load
  cacheBlockSize = 100, // Number of rows to load at once
  maxBlocksInCache = 10, // Maximum number of blocks to keep in cache
}) => {
  const tableOffsetSizes = localStorage?.getItem('table_offset_sizes') ? JSON.parse(localStorage?.getItem('table_offset_sizes')) : {}
  const classes = useStyles()
  const location = useLocation()
  const { values } = useQueryParams()
  const [gridApi, setGridApi] = useState(null)
  const [offsetIndex, setOffsetIndex] = useState(defaultOffsetIndex)
  const [offsetSize, setOffsetSize] = useState(tableOffsetSizes?.[id] || defaultOffsetSize)
  const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(null)
  const [selectedCells, setSelectedCells] = useState([])
  const OverlayLoadingTemplate = OverlayLoadingTemplateFunc()
  const allColumns = useMemo(() => gridApi?.columnApi?.getAllGridColumns(), [columns, gridApi])
  const popupParent = useMemo(() => document.querySelector('body'), [])
  const agGridTableArea = useMemo(() => document.getElementsByClassName('ag-root-wrapper-body'), [])
  const agGridTableScroll = useMemo(() => document.getElementsByClassName('ag-body-horizontal-scroll'), [])

  // For infinite scrolling, we don't use rowData directly
  const rowData = useMemo(() => {
    // Return undefined for infinite scroll datasource
    return pagination ? data : undefined
  }, [data, totalData, pagination])

  useScrollListener(agGridTableArea, agGridTableScroll)
  const navigate = useNavigate()
  const gridApiRef = useRef(null)
  const columnApiRef = useRef(null)

  // Create datasource for infinite scrolling
  const datasource = useMemo(() => {
    if (pagination || !onLoadMoreData) return null

    return {
      rowCount: hasMoreData ? undefined : totalCount, // undefined means unknown row count
      getRows: (params) => {
        const startRow = params.startRow
        const endRow = params.endRow
        const sortModel = params.sortModel
        const filterModel = params.filterModel

        // Call the provided function to load more data
        onLoadMoreData({
          startRow,
          endRow,
          sortModel,
          filterModel,
          successCallback: (rowsThisBlock, lastRow) => {
            params.successCallback(rowsThisBlock, lastRow)
          },
          failCallback: () => {
            params.failCallback()
          },
        })
      },
    }
  }, [onLoadMoreData, hasMoreData, totalCount, pagination])

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
            api.ensureIndexVisible(i)
            api.setFocusedCell(i, targetColId)
            document.querySelector('.ag-root')?.focus()
          }
          break
        }
      }
    },
    refreshInfiniteCache: () => {
      if (gridApiRef.current && !pagination) {
        gridApiRef.current.purgeInfiniteCache()
      }
    },
    setDatasource: (newDatasource) => {
      if (gridApiRef.current && !pagination) {
        gridApiRef.current.setDatasource(newDatasource)
      }
    },
  }))

  const prevStatus = usePrevious(status)

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      cellClass: (params) => {
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
          cellClass: 'cell-class',
        },
        ...columns,
      ]
    }
    return columns
  }, [selection, columns, headerCheckboxChecked, selectedRowsIds])

  // Hotkeys remain the same
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
        realTimeSelectedCellRowId({ id: custonName, rowId })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )

  const onCellClicked = useCallback(
    (params) => {
      if (params.column.colId === 'checkboxSelectionField') return
      const rowId = params.data[uniqId]
      const colId = params.column.colId
      const value = params.value

      setSelectedCells((prev) => {
        const existingIndex = prev.findIndex((cell) => cell.rowId === rowId && cell.colId === colId)
        let newSelectedCells
        if (existingIndex >= 0) {
          newSelectedCells = prev.filter((_, index) => index !== existingIndex)
        } else {
          onChangeSelectedCellRowId(rowId)
          newSelectedCells = [...prev, { rowId, colId, value }]
        }
        if (onCellSelectionChange) {
          onCellSelectionChange(newSelectedCells)
        }
        return newSelectedCells
      })
    },
    [uniqId, onCellSelectionChange]
  )

  // Modified navigation effect for infinite scroll
  useEffect(() => {
    if (pagination) {
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
    }
  }, [offsetIndex, offsetSize, data, location.pathname, status, pagination])

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

      // Refresh infinite cache when status changes
      if (gridApiRef.current && !pagination) {
        gridApiRef.current.purgeInfiniteCache()
      }
    }
  }, [status, pagination])

  const isRowSelectable = useCallback(() => {
    return true
  }, [])

  const pinnedBottomRowData = useMemo(() => {
    return totalData
  }, [totalData])

  const onGridReady = useCallback(
    (params) => {
      setGridApi(params.api)
      gridApiRef.current = params.api
      columnApiRef.current = params.columnApi

      // Set datasource for infinite scrolling
      if (!pagination && datasource) {
        params.api.setDatasource(datasource)
      }

      setTimeout(() => scrollShowHide(agGridTableArea, agGridTableScroll), 1000)
    },
    [datasource, pagination]
  )

  // Update datasource when it changes
  useEffect(() => {
    if (gridApi && !pagination && datasource) {
      gridApi.setDatasource(datasource)
    }
  }, [gridApi, datasource, pagination])

  const getRowStyle = (params) => {
    if (params.node.rowPinned === 'bottom') {
      return {}
    }
    return null
  }

  const getRowId = useCallback((params) => params.data[uniqId], [data, columns, totalData])

  return (
    <Fragment>
      <Box className={`${classes.root} ag-theme-alpine ${columnGroup ? 'column-group-header' : ''}`} id={id || 'simpleGrid'}>
        <AgGridReact
          rowBuffer={100}
          paginationPageSize={pagination ? 3000 : undefined}
          groupDisplayType='multipleColumns'
          onGridReady={onGridReady}
          overlayNoRowsTemplate={'<span></span>'}
          overlayLoadingTemplate={OverlayLoadingTemplate}
          rowData={rowData}
          columnDefs={modifyColumns}
          paginationOffsetSize={pagination ? offsetSize : undefined}
          components={components}
          rowSelection='multiple'
          getRowId={getRowId}
          defaultColDef={defaultColDef}
          suppressHorizontalScroll={true}
          isRowSelectable={isRowSelectable}
          domLayout={pagination ? 'autoHeight' : 'normal'} // Changed for infinite scroll
          onDisplayedColumnsChanged={debounce((p) => onDisplayedColumnsChanged({ ...p, updaterAction }), 1000)}
          onColumnResized={debounce((p) => onColumnResized({ ...p, updaterAction }), 1000)}
          rowHeight={48}
          suppressRowClickSelection={true}
          suppressPaginationPanel={true}
          getRowStyle={getRowStyle}
          suppressContextMenu={true}
          suppressCellFocus={false}
          icons={icons}
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
          onCellClicked={canCellClick && onCellClicked}
          // Infinite scroll specific props
          rowModelType={pagination ? 'clientSide' : 'infinite'}
          cacheBlockSize={cacheBlockSize}
          maxBlocksInCache={maxBlocksInCache}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1}
          suppressLoadingOverlay={false}
        />
        <LoadingBlurry isLoading={isDataLoading} height={-50} outside />
        {/* Show pagination only when pagination is enabled */}
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
    background-color: #e0f7fa !important;
    border: 1px solid #0288d1 !important;
  }
  
  .ag-theme-alpine .ag-center-cols-container {
    min-height: 500px; /* Ensure minimum height for infinite scroll */
  }
`

const styleSheet = document.createElement('style')
styleSheet.type = 'text/css'
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

export default memo(InfinityAgGridSimpleTable, (prevProps, nextProps) => isEqual(prevProps, nextProps))
