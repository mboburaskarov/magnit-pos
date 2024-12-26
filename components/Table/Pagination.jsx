import { useState } from 'react'
import { Pagination as MuiPagination, PaginationItem } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowForward from '../../src/assets/icons/ArrowRight'
import BackArrowIcon from '../../src/assets/icons/LeftArrow'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import useDidUpdate from '../../src/hooks/useDidUpdate'
import * as qs from 'qs'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& ul li button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 40,
      height: 40,
      padding: 4,
      borderRadius: 16,
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
      },
    },
    '& ul li button.Mui-selected': {
      backgroundColor: `transparent`,
      border: `1px solid #e5e9eb`,
      fontWeight: 600,
      color: theme.palette.primary[600],
    },
    '& ul li button:hover': {
      backgroundColor: theme.palette.gray[100],
    },
    '& ul li button.Mui-selected:hover': {
      backgroundColor: 'transparent',
    },
    '& ul li button span ': {
      display: 'none',
    },
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
}))
export default function Pagination({ count, handleChangePage, page, pageQuery }) {
  const { values } = useQueryParams()
  const classes = useStyles()
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
    <MuiPagination
      count={count || 1}
      onChange={(_, newVal) => {
        handleChangePage(newVal)
      }}
      renderItem={(props) =>
        ['previous', 'next'].includes(props.type) ? (
          <button {...props} type='button' className={classes.arrowBtn} id={props.type === 'previous' ? 'previousPageBtn' : 'nextPageBtn'}>
            {props.type === 'previous' ? <BackArrowIcon color='#FF6018' /> : <ArrowForward />}
          </button>
        ) : (
          <PaginationItem id={`pageCount-${pageValue}`} {...props} />
        )
      }
      page={pageValue}
      siblingCount={1}
      boundaryCount={1}
      className={classes.root}
    />
  )
}
