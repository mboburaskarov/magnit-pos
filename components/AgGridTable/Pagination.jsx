import { useState } from 'react'
import { Pagination as MuiPagination, PaginationItem } from '@mui/material'
import { makeStyles } from '@mui/styles'
import BackArrow from '../../src/assets/icons/BackArrow'
import ForwardArrow from '../../src/assets/icons/ForwardArrow'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import useDidUpdate from '../../src/hooks/useDidUpdate'

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
      borderRadius: 8,
      border: `1px solid transparent`,
      outline: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.grey[600],
      fontSize: 16,
      lineHeight: '19px',
      fontFamily: theme.fontFamily.Gilroy,
      fontWeight: 600,
      cursor: 'pointer',
      '&[disabled]': {
        cursor: 'default',
      },
    },
    '& ul li button.Mui-selected': {
      backgroundColor: `transparent`,
      border: `1px solid ${theme.palette.orange[500]}`,
      fontWeight: 600,
      color: theme.palette.orange[500],
    },
    '& ul li button:hover': {
      backgroundColor: theme.palette.grey[100],
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
      fill: theme.palette.bunker[950],
    },
  },
}))

export default function Pagination({ count, handleChangeOffset, offset, offsetQuery }) {
  const { values } = useQueryParams()
  const classes = useStyles()
  const [offsetValue, setOffsetValue] = useState(Number(values?.[offsetQuery] || offset))

  useDidUpdate(() => {
    setOffsetValue(offset)
  }, [offset])

  return (
    <MuiPagination
      count={count || 1}
      onChange={(_, newVal) => {
        handleChangeOffset(newVal)
      }}
      renderItem={(props) =>
        ['previous', 'next'].includes(props.type) ? (
          <button {...props} type='button' className={classes.arrowBtn} id={props.type === 'previous' ? 'previousPageBtn' : 'nextPageBtn'}>
            {props.type === 'previous' ? <BackArrow /> : <ForwardArrow />}
          </button>
        ) : (
          <PaginationItem id={`offsetCount-${offsetValue}`} {...props} />
        )
      }
      offset={offsetValue}
      siblingCount={1}
      boundaryCount={1}
      page={offset}
      className={classes.root}
    />
  )
}
