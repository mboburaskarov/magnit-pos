import { Pagination as MuiPagination } from '@mui/material'
import { styled } from '@mui/material/styles'

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

export default function Pagination({ count, handleChangeOffset, offset }) {
  // The 'offset' prop corresponds directly to the active page index passed from AgGridBottom
  const currentPage = Number(offset) === 0 ? 1 : Number(offset)
  const totalPages = count || 1

  const handlePageChange = (event, page) => {
    if (page >= 1 && page <= totalPages) {
      handleChangeOffset(page)
    }
  }

  return (
    <StyledPagination 
      count={totalPages} 
      page={currentPage} 
      onChange={handlePageChange} 
      siblingCount={1}
      boundaryCount={1}
      shape="rounded"
    />
  )
}
