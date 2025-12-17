import isEqual from '@utils/isEqual'
import { AgGridReact } from 'ag-grid-react'
import debounce from 'lodash/debounce'
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrevious } from 'react-use'
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { Box } from '@mui/material'
import * as qs from 'qs'

import { useQueryParams } from '../../src/hooks/useQueryParams'
import LoadingBlurry from '../LoadingBlurry'
import AgGridBottom from './AgGridBottom'
import { HeaderCheckbox, icons, OverlayLoadingTemplateFunc, OverlayNoRowsTemplate } from './AgGridComponents'
import { onColumnResized, onDisplayedColumnsChanged, scrollShowHide, useScrollListener } from './AgGridFunctions'
import CheckBoxRenderer from './CheckboxRenderer'
import useStyles from './useStyles'
import { get } from 'lodash'

const AgGridUnSelectableSimpleTable = ({
  id,
  emptyTableText,
  data,
  columns,
  components,
  selection,
  navigateUrl,
  noRedirect = false,
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
  setAddedItems,
  resetTable,
  totalData,
  columnGroup,
  uniqId = 'id',
  totalCount = 0,
  customDisplayColumnsChangeHandler,
  simpleTable,
  isRefreshing,
  status,
}) => {
  const tableOffsetSizes = localStorage?.getItem('table_offset_sizes') ? JSON.parse(localStorage?.getItem('table_offset_sizes')) : {}
  const classes = useStyles()
  const location = useLocation()
  const { values } = useQueryParams()
  const [gridApi, setGridApi] = useState(null)
  const [offsetIndex, setOffsetIndex] = useState(defaultOffsetIndex)
  const [offsetSize, setOffsetSize] = useState(tableOffsetSizes?.[id] || defaultOffsetSize)
  const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(null)
  const OverlayLoadingTemplate = OverlayLoadingTemplateFunc()
  const allColumns = useMemo(() => gridApi?.columnApi?.getAllGridColumns(), [columns, gridApi])
  const popupParent = useMemo(() => document.querySelector('body'), [])
  const agGridTableArea = useMemo(() => document.getElementsByClassName('ag-root-wrapper-body'), [])
  const agGridTableScroll = useMemo(() => document.getElementsByClassName('ag-body-horizontal-scroll'), [])
  const rowData = useMemo(() => data, [data, totalData])
  useScrollListener(agGridTableArea, agGridTableScroll)
  const navigate = useNavigate()

  const prevStatus = usePrevious(status)

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      cellClass: 'cell-class',
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
    []
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
        },
        ...columns,
      ]
    }
    return columns
  }, [selection, columns, headerCheckboxChecked, selectedRowsIds])

  useEffect(() => {
    const baseUrl = navigateUrl || location.pathname
    if (baseUrl && !noRedirect) {
      const offsetLimitParams = qs.stringify(
        {
          ...values,
          [limitQuery]: offsetSize,
          // [offsetQuery]: offsetIndex == 0 ? 0 : (offsetIndex - 1) * offsetSize,
          [offsetQuery]:
            values[offsetQuery] && values[offsetQuery] != '0' && offsetIndex == 0 ? values[offsetQuery] : offsetIndex == 0 ? 0 : (offsetIndex - 1) * offsetSize,
        },
        { addQueryPrefix: true }
      )

      navigate(`${baseUrl}${offsetLimitParams}`)
    }
  }, [offsetIndex, offsetSize, data, location.pathname, status])

  useEffect(() => {
    if (totalCount == 0) return

    const limit = Number(offsetSize)
    const offset = Number(offsetIndex) * Number(offsetSize) - Number(offsetSize)
    if ((totalCount + limit) / limit < offsetIndex) {
      const baseUrl = navigateUrl || location.pathname

      if (baseUrl && !noRedirect) {
        const offsetLimitParams = qs.stringify(
          {
            ...values,
            [limitQuery]: offsetSize,
            [offsetQuery]: 0,
          },
          { addQueryPrefix: true }
        )

        // navigate(`${baseUrl}${offsetLimitParams}`)
        setOffsetIndex(0)
      }
    }
  }, [totalCount])

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

  const onGridReady = useCallback((params) => {
    setGridApi(params.api)
    setTimeout(() => scrollShowHide(agGridTableArea, agGridTableScroll), 1000)
  }, [])
  useEffect(() => {
    if (gridApi && data?.length >= 0) {
      gridApi.setRowData(data)
    }
  }, [data, gridApi])

  const getRowId = useCallback((params) => params.data[uniqId], [data, columns, totalData])

  return (
    <Fragment>
      <Box className={`${classes.root} ag-theme-alpine ${columnGroup ? 'column-group-header' : ''}`} id={id || 'simpleGrid'}>
        <AgGridReact
          groupDisplayType='multipleColumns'
          onGridReady={onGridReady}
          overlayLoadingTemplate={OverlayLoadingTemplate}
          overlayNoRowsTemplate={'<div></div>'}
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
          suppressContextMenu={true}
          suppressCellFocus={true}
          icons={icons}
          // suppressRowVirtualisation={true}
          popupParent={popupParent}
          enableCellTextSelection={true}
          pinnedBottomRowData={pinnedBottomRowData}
          alwaysShowHorizontalScroll={true}
          debounceVerticalScrollbar={true}
          suppressAnimationFrame={true}
          animateRows={true}
          animateColums={true}
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
export default memo(AgGridUnSelectableSimpleTable, (prevProps, nextProps) => isEqual(prevProps, nextProps))
