import { useColumnOrder, useExpanded, useMountedLayoutEffect, usePagination, useRowSelect, useTable } from 'react-table';
import { forwardRef, Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import isEqual from '@utils/isEqual';
import * as qs from 'qs';

import useDeepCompareEffect from '../../src/hooks/useDeepCompareEffect';
import { useQueryParams } from '../../src/hooks/useQueryParams';
import paletteLight from '../../src/assets/theme/paletteLight';
import DownloadIcon from '../../src/assets/icons/DownloadIcon';
import colors from '../../src/assets/theme/mui.config';
import StyledSwitch from '../Switch/StyledSwitch';
import RowFilterButton from './RowFilterButton';
import InputSearch from '../Inputs/SearchInput';
import checkTableProps from './checkTableProps';
import Pagination from '../Table/Pagination';
import LoadingBlurry from '../LoadingBlurry';
import Placeholder from '../Placeholder';


const useStyles = makeStyles((theme) => ({
  root: {
    width: (props) => (props?.width ? '100%' : !props.isHasNavbarInDOM ? 'calc(100vw - 288px)' : props.isOpen ? 'calc(100vw - 380px)' : 'calc(100vw - 160px)'),

    position: 'relative',
  },
  parentWidth: {
    width: (props) => props.width || '100%',
  },
  wrapper: {
    width: '100%',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '4px !important',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.gray[200],
      height: '4px !important',
      margin: 0,
    },
    transform: ({ noHeader }) => noHeader && 'translateY(-20px)',
  },
  fullHeight: {
    flex: 1,
    '& > div:nth-child(1)': {
      height: 'calc(100% - 70px)',
    },
  },
  table: {
    display: 'table',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderSpacing: 0,
    whiteSpace: 'noWrap',
  },
  selectInput: {
    display: 'table',
    position: 'relative',
    width: '100%',
    borderSpacing: 0,
  },
  thead: {
    width: '100%',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      height: 2,
      backgroundColor: theme.palette.gray[200],
      width: '100%',
      left: 0,
      display: ({ noHeader }) => noHeader && 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      height: 2,
      backgroundColor: theme.palette.gray[200],
      width: '100%',
      left: 0,
      display: ({ noHeader }) => noHeader && 'none',
    },
    '& th': {
      padding: ({ noHeader }) => (noHeader ? 0 : '19px 15px'),
      opacity: ({ noHeader }) => noHeader && 0,
    },
  },
  th: {
    margin: 0,
    padding: ({ noHeader }) => (noHeader ? 0 : '16px 15px'),
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '19px',
    color: theme.palette.gray[800],
    fontFamily: theme.fontFamily.inter,
    textAlign: 'left',
  },
  tbody: {
    borderBottom: `2px solid ${theme.palette.gray[200]}`,
    width: '100%',
    '& > tr:nth-child(1)': {
      height: 16,
    },
  },
  tr: {
    transition: 'all .3s ease',
    '&:hover': {
      backgroundColor: ({ isExpendable, withHover }) => (isExpendable || withHover) && `${theme.palette.gray[101]} !important`,
    },

    '&:nth-child(even)': {
      backgroundColor: theme.palette.gray[50],
    },
    '&:nth-child(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  notStriped: {
    '&:nth-child(even)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:nth-child(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  fullViewPort: {
    width: (props) => (props.width ? props.width : '100%'),
  },
  td: {
    margin: 0,
    padding: ({ customTablePadding }) => customTablePadding || 15,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '19px',
    color: theme.palette.gray[600],
    fontFamily: theme.fontFamily.inter,
    '&:last-child': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
    },
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
    },
  },
  checkbox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& input': {
      width: 14,
      height: 18,
    },
  },
  spacer: {
    height: '16px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    borderTop: `2px solid ${theme.palette.gray[200]}`,
  },
  pagination: {
    maxWidth: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  hiddenOverflow: {
    overflowX: 'hidden',
  },
  arrowBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 4,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '& svg': {
      fill: theme.palette.blue[500],
    },
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 40,
    padding: 4,
    marginRight: 4,
    border: `1px solid transparent`,
    outline: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.gray[600],
    fontSize: 16,
    lineHeight: '19px',
    fontFamily: theme.fontFamily.inter,
    fontWeight: 600,
    cursor: 'pointer',
    '&[disabled]': {
      cursor: 'default',
      border: `1px solid ${theme.palette.gray[300]}`,
      borderRadius: 16,
    },
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 4,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.gray[600],
    fontSize: 16,
    lineHeight: '19px',
    fontFamily: theme.fontFamily.inter,
    fontWeight: 600,
    cursor: 'default',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
  },
  selectesRowsInfo: {
    background: paletteLight.blue[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: '8px 16px',
    height: 56,
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '20px',
    '& button': {
      backgroundColor: 'transparent',
      border: 0,
      cursor: 'pointer',
    },
    '& > div:nth-child(1) > button': {
      marginRight: 30,
      display: 'flex',
      alignItems: 'center',
    },
    '& > div:nth-child(2) > button': {
      marginLeft: 8,
      height: 40,
      fontWeight: 600,
      borderRadius: 16,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.blue[500],
      padding: '0 16px',
      fontSize: 16,
      width: 192,
    },
  },
}))
const CheckedInputIcon = () => (
  <svg width='14' height='15' viewBox='0 0 14 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12.5 14.5C13.3125 14.5 14 13.8438 14 13V2C14 1.1875 13.3125 0.5 12.5 0.5H1.5C0.65625 0.5 0 1.1875 0 2V13C0 13.8438 0.65625 14.5 1.5 14.5H12.5ZM6.09375 11.4375C5.90625 11.6562 5.5625 11.6562 5.375 11.4375L2.125 8.1875C1.9375 8 1.9375 7.6875 2.125 7.5L2.84375 6.78125C3.03125 6.59375 3.34375 6.59375 3.53125 6.78125L5.75 8.96875L10.4375 4.28125C10.625 4.09375 10.9375 4.09375 11.125 4.28125L11.8438 5C12.0312 5.1875 12.0312 5.5 11.8438 5.6875L6.09375 11.4375Z'
      fill='white'
    />
  </svg>
)

function PaginationTable({
  id,
  columns,
  data,
  switchEnd,
  pagination = true,
  pageCount: controlledPageCount,
  setTableHeaderColumns,
  navigateUrl,
  updateMyData,
  defaultPageSize = 10,
  defaultPageIndex = 0,
  resetTable,
  searchInputValue,
  notStriped,
  selection,
  addAllProducts,
  deleteAllProducts,
  width,
  fullHeight,
  setSelectedRows,
  searchable,
  onSearchInputChange,
  parentWidth,
  selectedRows = {},
  selectedRowActionOne,
  selectedRowActionTwo,
  isDataLoading,
  onTableSettingsChange,
  pageQuery = 'offset',
  limitQuery = 'limit',
  noRedirect,
  noDataTitle,
  noDataDesc,
  download,
  isDownloading,
  pricesWidth,
  selectInput = false,
  autoResetSelectedRows = true,
  totalData,
  eventMessages,
  setTableHeaderColumnsWithSettingsIcon = true,
  percentage,
  selectAll,
  addSingleProduct,
  addSingleProductData,
  removeSingleProduct,
  removeSingleProductData,
  setAddOrRemove,
  customTablePadding,
  blueTotalData,
  videoInstruction,
  isExpendable,
  withHover,
  noHeader,
  disabledCheckbox,
  setSelectAll,
  setRemovedItems, // for remove items (single ones)
  setAddedItems, // for added items (single ones)
  selectedItemsCount,
  setSelectedItems,
}) {
  const { isOpen } = useSelector((state) => state?.sidebarSettings)
  const isHasNavbarInDOM = !!document.getElementById('navbar')

  const classes = useStyles({
    width,
    isOpen,
    customTablePadding,
    isExpendable,
    withHover,
    noHeader,
    isHasNavbarInDOM,
  })
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const tableContainer = useRef()

  const IndeterminateCheckbox = forwardRef(({ indeterminate, rowId, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate
      }
    }, [resolvedRef, indeterminate])

    return (
      <>
        {selectAll && percentage > 0 && percentage < 100 && rest.title === 'Toggle All Current Page Rows Selected' ? (
          <div style={{ width: 18, height: 18 }}>
            <CircularProgressbar
              styles={buildStyles({
                strokeLinecap: 'butt',
                trailColor: '#EAEAEA',
                pathColor: '#1F78FF',
              })}
              strokeWidth={24}
              value={percentage}
            />
          </div>
        ) : selectAll && percentage > 0 && percentage < 100 && rest.title !== 'Toggle All Current Page Rows Selected' ? (
          <input disabled type='checkbox' style={{ cursor: 'default' }} />
        ) : (
          <input
            onClick={(e) => {
              e.stopPropagation()
              if (setSelectAll && rest.title === 'Toggle All Current Page Rows Selected') {
                setSelectAll((prev) => !prev)
              }
              if (addAllProducts && rest.title === 'Toggle All Current Page Rows Selected') {
                if (!rest.checked) {
                  addAllProducts()
                } else {
                  deleteAllProducts()
                }
              }
              if ((addSingleProduct || setRemovedItems) && rest.title !== 'Toggle All Current Page Rows Selected') {
                if (!rest.checked) {
                  if (!!addSingleProductData) {
                    addSingleProductData.data.product_id = rowId
                    addSingleProduct(addSingleProductData)
                  }
                  if (setAddedItems) {
                    setAddedItems(rowId)
                  }
                } else {
                  if (setAddOrRemove) {
                    setAddOrRemove(true)
                  }
                  if (setRemovedItems) {
                    setRemovedItems(rowId)
                  }
                  if (!!removeSingleProductData) {
                    removeSingleProductData.data.data.product_id = rowId
                    removeSingleProduct(removeSingleProductData)
                  }
                }
              }
            }}
            type='checkbox'
            ref={resolvedRef}
            disabled={disabledCheckbox?.includes(rowId)}
            {...rest}
          />
        )}
      </>
    )
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    allColumns,
    setPageSize,
    setColumnOrder,
    toggleAllRowsSelected,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      autoResetHiddenColumns: false,
      initialState: {
        pageIndex: defaultPageIndex,
        pageSize: localStorage.getItem(`${id}_table_limit`) || defaultPageSize,
        selectedRowIds: selectedRows,
      },
      manualPagination: true,
      pageCount: controlledPageCount,
      autoResetSelectedRows,
      getRowId: (row, relativeIndex, parent) => row?.id || row?.product_id || (parent ? [parent?.id, relativeIndex].join('.') : relativeIndex),
      updateMyData,
      autoResetPage: !resetTable,
    },
    useExpanded,
    usePagination,
    useColumnOrder,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((propColumns) =>
        selection
          ? [
              {
                id: 'selection',
                Header: ({ getToggleAllPageRowsSelectedProps }) => (
                  <div className={classes.checkbox}>
                    <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                  </div>
                ),
                Cell: ({ row }) => {
                  return (
                    <div className={classes.checkbox}>
                      <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} rowId={row?.original?.id} id={`checkbox-${row?.index}`} />
                    </div>
                  )
                },
              },
              ...propColumns,
            ]
          : switchEnd
          ? [
              ...propColumns,
              {
                id: 'selection',
                Header: () => <div />,
                Cell: ({ row }) => (
                  <div className={classes.checkbox}>
                    <StyledSwitch {...row.getToggleRowSelectedProps()} />
                  </div>
                ),
              },
            ]
          : propColumns
      )
    }
  )

  const [paginatedSelectedRows, setPaginatedSelectedRows] = useState({})

  const changePage = useCallback((newPage) => {
    // const activePage = newPage - 1
    // if (newPage !== activePage) {
    gotoPage(newPage - 1)
    // }
  }, [])

  useEffect(() => {
    const baseUrl = navigateUrl || location.pathname
    if (baseUrl && !noRedirect) {
      const pageParams = qs.stringify(
        {
          ...queryParams?.values,
          [pageQuery]: pageIndex * pageSize,
          [limitQuery]: pageSize,
        },
        { addQueryPrefix: true }
      )

      navigate(`${baseUrl}${pageParams}`)
    }

    if (onTableSettingsChange) {
      onTableSettingsChange(pageIndex, pageSize)
    }
  }, [pageIndex, pageSize, location.pathname])

  useEffect(() => {
    changePage(Number(queryParams?.values?.page) || 1)
  }, [])

  useDeepCompareEffect(() => {
    const rows = selectedFlatRows.map((item) => item.original)

    setPaginatedSelectedRows({
      ...paginatedSelectedRows,
      [pageIndex]: rows || [],
    })
  }, [selectedRowIds])

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

  useEffect(() => {
    if (!!id) {
      localStorage.setItem(`${id}_table_limit`, pageSize)
    }
  }, [pageSize])

  return (
    <>
      <div
        className={`${classes.root} ${fullHeight ? classes.fullHeight : ''} ${parentWidth ? classes.parentWidth : ''} `}
        ref={tableContainer}
        style={{ width: pricesWidth && tableContainer.current?.offsetWidth }}
      >
        {setTableHeaderColumnsWithSettingsIcon && setTableHeaderColumns && (
          <ColumnsFilterButtonForAll
            setTableHeaderColumnsWithSettingsIcon={setTableHeaderColumnsWithSettingsIcon}
            columns={allColumns}
            setColumnOrder={setColumnOrder}
            setTableHeaderColumns={setTableHeaderColumns}
            eventMessage={eventMessages?.[0]}
          />
        )}
        <div
          className={`${classes.wrapper} ${!data?.length && noDataTitle && !isDataLoading ? classes.hiddenOverflow : ''} ${
            isDataLoading ? classes.visibleOverflow : ''
          }`}
        >
          <table {...getTableProps()} className={selectInput ? classes.selectInput : classes.table}>
            <thead className={classes.thead}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers?.map((column) => (
                    <th
                      id={column?.id}
                      {...column.getHeaderProps({
                        style: {
                          ...(column?.maxWidth && {
                            maxWidth: column.maxWidth,
                          }),
                          ...(column?.width && {
                            width: column.id === 'selection' ? 48 : column.width,
                          }),
                          ...(column?.minWidth && {
                            minWidth: column.minWidth,
                          }),
                          ...(column.borderRight && {
                            borderRight: `2px solid ${colors.gray[200]}`,
                          }),
                          ...(column.borderLeft && {
                            borderLeft: `2px solid ${colors.gray[200]}`,
                          }),
                        },
                      })}
                      className={classes.th}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()} className={classes.tbody}>
              {blueTotalData ? '' : <tr />}
              <>
                {searchable ? (
                  selectedItemsCount === 0 || !selectedRowActionOne || !selectedRowActionTwo ? (
                    <tr>
                      <td colSpan={allColumns?.length}>
                        <Box
                          my={1}
                          style={{
                            width: tableContainer.current?.offsetWidth || '100%',
                          }}
                        >
                          <InputSearch
                            name='search'
                            placeholder={t('menu.settings.shops.table_placeholder')}
                            fullWidth
                            onChange={(e) => onSearchInputChange(e.target.value)}
                            white
                            value={searchInputValue}
                            setSearchTerm={onSearchInputChange}
                          />
                        </Box>
                      </td>
                    </tr>
                  ) : (
                    (selectedRowActionOne || selectedRowActionTwo) && (
                      <tr>
                        <td colSpan={allColumns?.length}>
                          <Box
                            my={1}
                            className={classes.selectesRowsInfo}
                            style={{
                              width: tableContainer.current?.offsetWidth || '100%',
                            }}
                          >
                            <Box display='flex' alignItems='center'>
                              <button
                                type='button'
                                onClick={() => {
                                  toggleAllRowsSelected(false)
                                  setSelectedItems([])
                                }}
                              >
                                <CheckedInputIcon />
                              </button>
                              {t('ag_grid.selected_products_count', {
                                selectedItemsCount,
                              })}
                            </Box>
                            <Box>
                              <button onClick={() => selectedRowActionOne && selectedRowActionOne(selectedFlatRows)} type='button'>
                                {t('titles.print_price_tag')}
                              </button>

                              <button
                                onClick={() => {
                                  if (selectedRowActionTwo) {
                                    toggleAllRowsSelected(false)
                                    selectedRowActionTwo(selectedFlatRows)
                                  }
                                }}
                                type='button'
                              >
                                {t('ag_grid.reset_quantity')}
                              </button>
                            </Box>
                          </Box>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  ''
                )}
              </>

              {!data?.length && noDataTitle ? (
                <tr>
                  <td colSpan={allColumns?.length}>
                    <Placeholder fullHeight className={classes.fullViewPort} title={noDataTitle} desc={noDataDesc} videoInstruction={videoInstruction} />
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row)

                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr
                        {...row.getRowProps()}
                        className={`${classes.tr} ${notStriped && classes.notStriped}`}
                        onClick={() => {
                          if (isExpendable) {
                            row?.getToggleRowExpandedProps()?.onClick()
                          }
                        }}
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              borderRight: cell.column.borderRight && `2px solid ${colors.gray[200]}`,
                              borderLeft: cell.column.borderLeft && `2px solid ${colors.gray[200]}`,
                              cursor: isExpendable && 'pointer',
                            }}
                            className={classes.td}
                          >
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    </Fragment>
                  )
                })
              )}
              <>
                {data?.length && totalData ? (
                  <tr
                    style={{
                      backgroundColor: blueTotalData ? colors.blue[600] : '#fff',
                      boxShadow: theme.boxShadow['16-8'],
                      color: colors.blue[500],
                      borderRadius: 16,
                    }}
                  >
                    {Object.entries(totalData)
                      ?.filter(([_, value]) => value || value === 0 || value === '')
                      .map(([key, value]) => (
                        <td
                          key={key}
                          className={`${classes.td}`}
                          style={{
                            color: blueTotalData ? '#fff' : colors.blue[500],
                          }}
                        >
                          <Box key={key}>{value?.value ? <Typography style={value.style}>{value.value}</Typography> : value}</Box>
                        </td>
                      ))}
                  </tr>
                ) : (
                  ''
                )}
              </>
              <tr className={classes.spacer} />
            </tbody>
            <LoadingBlurry isLoading={isDataLoading} outside />
          </table>
        </div>
        {data?.length > 0 && pagination && (
          <div className={classes.footer}>
            <Pagination count={controlledPageCount} handleChangePage={changePage} page={pageIndex + 1} pageQuery={pageQuery} />
            <Box display='flex' alignItems='center'>
              {download && (
                <Box minWidth={148} mr={2}>
                  <Button variant='outlined' size='small' startIcon={<DownloadIcon />} fullWidth isLoading={isDownloading} onClick={download}>
                    {t('table_columns.download')}
                  </Button>
                </Box>
              )}

              {!setTableHeaderColumnsWithSettingsIcon && setTableHeaderColumns && (
                <ColumnsFilterButtonForAll
                  columns={allColumns}
                  setColumnOrder={setColumnOrder}
                  setTableHeaderColumns={setTableHeaderColumns}
                  eventMessage={eventMessages?.[0]}
                />
              )}
              <RowFilterButton eventMessage={eventMessages?.[1]} offsetSize={pageSize} setOffsetSize={setPageSize} />
            </Box>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(checkTableProps(PaginationTable), (prevProps, nextProps) => isEqual(prevProps, nextProps))
