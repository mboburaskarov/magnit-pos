import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import { Skeleton } from '@mui/material'
import RowFilterButton from '../AgGridTable/RowFilterButton'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import * as qs from 'qs'
import Pagination from '../AgGridTable/Pagination'
import DateOrderAccordionSingle from './DateOrderAccordionSingle'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '16px 0',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  pagination: {
    flex: '0 0 30%',
    display: 'flex',
    alignItems: 'center',
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
  spread: {
    margin: '0 10px',
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
  skeleton: {
    borderRadius: 24,
    marginBottom: 8,
    height: '96px',
    transform: 'none',
    '&:first-child': {
      marginTop: 64,
    },
  },
}))

export default function DateOrderAccordion({
  setIsOpen,
  list,
  pageCount,
  noRedirect,
  setOpen,
  setDebtId,
  historyPage,
  repaymentPage,
  noPagination,
  isLoading,
}) {
  const classes = useStyles()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const queryParams = useQueryParams()
  const navigate = useNavigate()

  const changePage = (page) => {
    const activePage = page + 1
    if (page === activePage) {
      return
    }

    setPageIndex(page - 1)
  }

  useEffect(() => {
    if (!noRedirect) {
      const pageParams = qs.stringify({ ...queryParams?.values, limit: pageSize, page: pageIndex + 1 }, { addQueryPrefix: true })
      // navigate(`/order/all${pageParams}`)
    }
  }, [navigate, pageIndex, pageSize])

  useEffect(() => {
    changePage(1)
  }, [queryParams?.values?.search])

  useEffect(() => {
    changePage(pageIndex + 1)
  }, [pageCount])

  return (
    <div className={classes.root}>
      {list?.map((item, index) => {
        return isLoading ? (
          <Skeleton animation='wave' className={classes.skeleton} />
        ) : (
          <DateOrderAccordionSingle
            defaultExpanded
            key={index}
            historyPage={historyPage}
            repaymentPage={repaymentPage}
            setIsOpen={setIsOpen}
            list={item}
            setOpen={setOpen}
            setDebtId={setDebtId}
          />
        )
      })}
      {!!list?.length && !noPagination && (
        <Box className={classes.footer}>
          <Pagination count={pageCount} handleChangePage={changePage} page={pageIndex + 1} pageQuery='page' />

          <Box display='flex' alignItems='center'>
            <Box minWidth={148} mr={2} />
            <RowFilterButton id='row-filter' pageSize={pageSize} setPageSize={setPageSize} setPageIndex={setPageIndex} />
          </Box>
        </Box>
      )}
    </div>
  )
}
