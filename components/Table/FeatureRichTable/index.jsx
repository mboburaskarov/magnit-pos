import React, { useCallback, useEffect, useRef, useState, memo } from 'react'
import { useTable, usePagination, useRowSelect, useColumnOrder, useResizeColumns, useMountedLayoutEffect, useExpanded, useBlockLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'
import isEqual from '../../../utils/isEqual'
import { Box, Button } from '@mui/material'
import DownloadIcon from '../../../src/assets/icons/DownloadIcon'
import useDeepCompareEffect from '../../../src/hooks/useDeepCompareEffect'
import { useLocation, useNavigate } from 'react-router-dom'
import * as qs from 'qs'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { useTranslation } from 'react-i18next'
import event from '../../../utils/event'
import LoadingBlurry from '../../LoadingBlurry'
import useDidUpdate from '../../../src/hooks/useDidUpdate'
import colors from '../../../src/assets/theme/mui.config'
import { useSelector } from 'react-redux'
import checkTableProps from './checkTableProps'
import RowCheckbox from './RowCheckbox'
import useStyles from './useStyles'
import Pagination from '../Pagination'
import ColumnsFilterButton from './ColumnsFilterButton'
import RowFilterButton from './RowFilterButton'
import TableSortableHeader from './TableSortableHeader'
import TableSortableHeaderCell from './TableSortableHeaderCell'

function FeatureRichTable({
  columns,
  data,
  isSelectable,
  pagination = true,
  isDataLoading,
  noRedirect,
  download,
  width,
  pageCount: controlledPageCount,
  selectedRows = {},
  setSelectedRows,
  noDataTitle,
  eventMessages,
  noDataDesc,
  onRowSelect,
  renderRowSubComponent,
  pageQuery = 'page',
  limitQuery = 'limit',
  defaultPageSize = 5,
  defaultPageIndex = 0,
  darkHeaderTitle,
  totalData,
  tableSettings = true,
  autoResetSelectedRows = true,
  SettingsComponent,
  settingsComponentProps,
  blueTotalData,
  updateMyData,
  onColumnSequenceChange = () => {},
  selectAll,
  setSelectAll,
  percentage,
  disableScroll,
  isDownloading,
  setIsDownloading,
}) {
  const { isOpen } = useSelector((state) => state?.sidebarSettings)
  const classes = useStyles({
    isOpen,
    width,
    darkHeaderTitle,
    totalData,
    blueTotalData,
    disableScroll,
  })
  const queryParams = useQueryParams()
  const [dragOutArea, setDragOutArea] = useState('')
  const navigate = useNavigate()
  const tableContainerRef = useRef()
  const location = useLocation()
  const [paginatedSelectedRows, setPaginatedSelectedRows] = useState({})

  const { t } = useTranslation()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    allColumns,
    setPageSize,
    selectedFlatRows,
    visibleColumns,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      autoResetHiddenColumns: false,
      initialState: {
        pageSize: defaultPageSize,
        pageIndex: defaultPageIndex,
        selectedRowIds: selectedRows,
      },
      getRowId: (row, relativeIndex, parent) => row?.id || row?.product_id || (parent ? [parent?.id, relativeIndex].join('.') : relativeIndex),
      manualPagination: true,
      pageCount: controlledPageCount,
      updateMyData,
      autoResetPage: true,
    },
    useExpanded,
    usePagination,
    useColumnOrder,
    useRowSelect,
    useBlockLayout,
    useResizeColumns,
    useSticky,
    (hooks) => {
      hooks.visibleColumns.push((propColumns) =>
        isSelectable
          ? [
              {
                id: 'selection',
                width: 46,
                Header: ({ getToggleAllPageRowsSelectedProps }) => (
                  <div className={classes.checkbox}>
                    <RowCheckbox
                      {...getToggleAllPageRowsSelectedProps()}
                      percentage={percentage}
                      onClick={() => {
                        const { title, checked } = getToggleAllPageRowsSelectedProps()
                        if (selectAll && title === 'Toggle All Current Page Rows Selected' && setSelectAll) {
                          setSelectAll((prev) => !prev)
                          if (!checked) selectAll()
                          else setSelectedRows([])
                        }
                      }}
                    />
                  </div>
                ),
                Cell: ({ row }) => (
                  <div className={classes.checkbox}>
                    <RowCheckbox {...row.getToggleRowSelectedProps()} />
                  </div>
                ),
              },
              ...propColumns,
            ]
          : propColumns
      )
    }
  )

  useMountedLayoutEffect(() => {
    const rows = selectedFlatRows.map((item) => item.original)
    if (setSelectedRows) {
      setSelectedRows(rows)
    }
  }, [])

  useDeepCompareEffect(() => {
    const formatted = Object.values(paginatedSelectedRows)?.flat()

    if (setSelectedRows) {
      setSelectedRows(formatted)
    }
  }, [paginatedSelectedRows])

  useDidUpdate(() => {
    if (!noRedirect) {
      const pageParams = qs.stringify(
        {
          ...queryParams?.values,
          [limitQuery]: pageSize,
          [pageQuery]: pageIndex + 1,
        },
        { addQueryPrefix: true }
      )
      navigate(`${location.pathname}${pageParams}`)
    }
  }, [pageIndex, pageSize])
  const changePage = useCallback((newPage) => {
    const activePage = newPage + 1
    if (newPage !== activePage) {
      gotoPage(newPage - 1)
      event('change_page')
    }
  }, [])
  useEffect(() => {
    const helperDraggableElement = document.getElementsByClassName(classes.sortable_header)?.[0]
    if (helperDraggableElement) {
      if (dragOutArea) {
        helperDraggableElement.classList.add(classes.sortable_header_out)
      } else {
        helperDraggableElement.classList.remove(classes.sortable_header_out)
      }
    }
  }, [dragOutArea])

  useDeepCompareEffect(() => {
    const rows = selectedFlatRows.map((item) => item.original)

    setPaginatedSelectedRows({
      ...paginatedSelectedRows,
      [pageIndex]: rows || [],
    })
  }, [selectedRowIds])

  return (
    <div className={`${classes.root}`} ref={tableContainerRef}>
      <div
        className={`${classes.wrapper} 
        ${isDataLoading ? classes.visibleOverflowc : ''}
        `}
      >
        <table {...getTableProps()} className={classes.table}>
          <thead className={classes.thead}>
            {headerGroups.map((headerGroup) => (
              <TableSortableHeader
                axis='x'
                helperClass={classes.sortable_header}
                onSortEnd={({ newIndex, oldIndex }) =>
                  onColumnSequenceChange({
                    newIndex,
                    oldIndex,
                    isRemoved: dragOutArea,
                  })
                }
                onSortMove={(e) => {
                  const isOut = !tableContainerRef.current?.contains(e.target)
                  setDragOutArea(isOut)
                }}
                pressDelay={300}
                useDragHandle
                hideSortableGhost={false}
                {...headerGroup.getHeaderGroupProps()}
                style={{
                  ...headerGroup.getHeaderGroupProps()?.style,
                  width: blueTotalData ? '100%' : Number(headerGroup.getHeaderGroupProps()?.style.width?.replace('px', '')) + 70,
                }}
              >
                {headerGroup.headers?.map((column) => {
                  const shouldBeStickyCheckbox = column.id === 'selection' && allColumns.some((el) => el?.sticky === 'left')
                  return (
                    <TableSortableHeaderCell
                      id={column?.id}
                      tabIndex={column.sequence_number}
                      index={column.sequence_number}
                      {...column.getHeaderProps()}
                      value={column?.id}
                      {...(shouldBeStickyCheckbox && {
                        'data-sticky-last-left-td': true,
                        'data-sticky-td': true,
                      })}
                      style={{
                        ...(column.borderRight && {
                          borderRight: `2px solid ${colors.gray[200]}`,
                        }),
                        ...(column.borderLeft && {
                          borderLeft: `2px solid ${colors.gray[200]}`,
                        }),
                        ...(column.minWidth && {
                          minWidth: column.minWidth,
                        }),
                        ...column.getHeaderProps()?.style,
                        ...((column.sticky || shouldBeStickyCheckbox) && {
                          zIndex: 6,
                        }),
                        ...(shouldBeStickyCheckbox && {
                          position: 'sticky',
                          left: 0,
                        }),
                        ...(column.id === 'selection' && {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }),
                        opacity: 1,
                        visibility: 'visible',
                        whiteSpace: 'normal',
                      }}
                      className={classes.th}
                    >
                      {typeof column.render('Header') === 'string' ? (
                        <Box id={`head-${column?.id}`} p={2}>
                          {column.render('Header', {
                            resizeProps: column.getResizerProps(),
                          })}
                        </Box>
                      ) : (
                        column.render('Header', {
                          resizeProps: column.getResizerProps(),
                        })
                      )}
                    </TableSortableHeaderCell>
                  )
                })}
              </TableSortableHeader>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className={classes.tbody}>
            {!data?.length && noDataTitle ? (
              <tr>
                <td colSpan={allColumns?.length}>
                  {/* <Placeholder
                    boxStyle={{ mt: 2 }}
                    className={classes.fullViewPort}
                    title={noDataTitle}
                    width={tableContainerRef?.current?.offsetWidth}
                    desc={noDataDesc}
                    isStickyToLeft={!data?.length}
                  /> */}
                </td>
              </tr>
            ) : (
              <>
                {page.map((row) => {
                  prepareRow(row)
                  const rowProps = row.getRowProps()
                  return (
                    <>
                      <tr {...rowProps} className={classes.tr}>
                        {row.cells.map((cell) => {
                          const shouldBeStickyCheckbox = cell.column.id === 'selection' && allColumns.some((el) => el?.sticky === 'left')
                          return (
                            <td
                              {...cell.getCellProps()}
                              {...(shouldBeStickyCheckbox && {
                                'data-sticky-last-left-td': true,
                                'data-sticky-td': true,
                              })}
                              style={{
                                ...(cell.column.borderRight && {
                                  borderRight: `2px solid ${colors.gray[200]}`,
                                }),
                                ...(cell.column.borderLeft && {
                                  borderLeft: `2px solid ${colors.gray[200]}`,
                                }),
                                ...cell.getCellProps()?.style,
                                minWidth: cell.column.minWidth,
                                ...(shouldBeStickyCheckbox && {
                                  position: 'sticky',
                                  left: 0,
                                }),
                              }}
                              className={classes.td}
                            >
                              <Box>{cell.render('Cell')}</Box>
                            </td>
                          )
                        })}
                        {/* <td
                          className={classes.td}
                          style={{ minWidth: 64, width: 64 }}
                        /> */}
                      </tr>
                      {row.isExpanded &&
                        renderRowSubComponent({
                          row,
                          rowProps,
                          visibleColumns,
                        })}
                    </>
                  )
                })}
              </>
            )}
            {}
            {data?.length && totalData ? (
              <tr
                style={{
                  padding: 16,
                  visibility: 'hidden',
                }}
              >
                invisible content
              </tr>
            ) : (
              ''
            )}
            {data?.length && totalData ? (
              <tr>
                <Box
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.default,
                    boxShadow: theme.boxShadow['16-8'],
                    color: colors.blue[500],
                    height: blueTotalData ? 72 : undefined,
                    borderRadius: 16,
                    marginBottom: 2,
                  })}
                >
                  {Object.entries(totalData)?.map(([key, value]) => (
                    <td
                      key={key}
                      className={`${classes.td}`}
                      style={{
                        color: blueTotalData ? '#fff' : colors.blue[500],
                        width: value?.width || '150px',
                        height: '100%',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        ...value?.styles,
                      }}
                    >
                      <Box margin={0} key={key} id={`total-${key}`}>
                        {value?.value || value}
                      </Box>
                    </td>
                  ))}
                </Box>
              </tr>
            ) : (
              ''
            )}
            <tr>
              <td colSpan={allColumns?.length}>
                <LoadingBlurry outside isLoading={isDataLoading} width={tableContainerRef?.current?.offsetWidth} />
              </td>
            </tr>
            {blueTotalData ? '' : <tr />}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className={classes.footer}>
          <Pagination
            count={controlledPageCount}
            handleChangePage={(p) => {
              changePage(p)
              if (eventMessages) event(eventMessages[0])
            }}
            page={pageIndex + 1}
            size={pageSize}
            pageQuery={pageQuery}
          />
          <Box display='flex' alignItems='center'>
            <Box minWidth={148} mr={2}>
              <Button
                variant='outlined'
                size='small'
                adornmentStart={<DownloadIcon />}
                fullWidth
                onClick={() => {
                  if (setIsDownloading) setIsDownloading(true)
                  download()
                  event(eventMessages?.[1])
                }}
                isLoading={isDownloading}
              >
                {t('table_columns.download')}
              </Button>
            </Box>
            <RowFilterButton eventMessage={eventMessages?.[2]} pageSize={pageSize} setPageSize={setPageSize} />
          </Box>
        </div>
      )}
      {tableSettings && (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          style={{
            position: 'absolute',
            top: 8,
            right: 16,
            zIndex: 100,
          }}
        >
          {SettingsComponent ? (
            <SettingsComponent columns={allColumns?.filter((el) => !el?.is_temporary)} {...settingsComponentProps} />
          ) : (
            <ColumnsFilterButton columns={allColumns?.filter((el) => !el?.is_temporary)} {...settingsComponentProps} />
          )}
        </Box>
      )}
    </div>
  )
}
export default memo(checkTableProps(FeatureRichTable), (prevProps, nextProps) => isEqual(prevProps, nextProps))
