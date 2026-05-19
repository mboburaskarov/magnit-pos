import { useState } from 'react'
import { Pagination as MuiPagination, PaginationItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import useDidUpdate from '../../src/hooks/useDidUpdate'
import * as qs from 'qs'
import { useLocation } from 'react-router-dom'

const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: '#9CA3AF',
    fontFamily: 'Gilroy, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: '8px',
    minWidth: '32px',
    height: '32px',
    margin: '0 4px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#F3F4F6',
      color: '#4B5563',
    },
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      color: theme.palette.orange[500],
      border: `1px solid ${theme.palette.orange[500]}`,
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'rgba(254, 80, 0, 0.04)',
    },
  },
  '& .MuiPaginationItem-ellipsis': {
    color: '#9CA3AF',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  '& .MuiPaginationItem-previousNext': {
    color: '#111217',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    }
  },
}))

export default function Pagination({ count, handleChangePage, page, pageQuery }) {
  const { values } = useQueryParams()
  const [pageValue, setPageValue] = useState(Number(values?.[pageQuery] || page))

  const location = useLocation()
  useDidUpdate(() => {
    setPageValue(page)
  }, [page])

  useDidUpdate(() => {
    const pageQueryValue = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })?.[pageQuery]
    if (Number(pageQueryValue)) {
      if (pageValue !== Number(pageQueryValue)) {
        handleChangePage(pageQueryValue)
        setPageValue(pageQueryValue)
      }
    }
  }, [location.search])

  return (
    <StyledPagination
      count={count || 1}
      page={pageValue}
      onChange={(_, newVal) => {
        handleChangePage(newVal)
      }}
      siblingCount={1}
      boundaryCount={1}
      shape="rounded"
    />
  )
}
