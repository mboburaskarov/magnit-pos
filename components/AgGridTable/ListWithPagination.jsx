import { Box, Button, ClickAwayListener, List, ListItem, Paper, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import Pagination from './Pagination'
import { makeStyles } from '@mui/styles'
import ArrowDown from '../../src/assets/icons/ArrowDown'
import TickIcon from '../../src/assets/icons/TickIcon'
import * as qs from 'qs'
import { useNavigate } from 'react-router-dom'
import { get } from 'lodash'
import LoadingBlock from '../LoadingBlock'
import LoadingBlurry from '../LoadingBlurry'

const useStyles = makeStyles((theme) => ({
  lineSortContainer: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    width: '200px',
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: 16,
    zIndex: '999',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  lineSortList: {
    padding: 0,
    overflow: 'hidden',
  },
  lineSortItem: {
    background: 'inherit',
    border: '0',
    outline: '0',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px 16px',
    '&:hover': {
      background: theme.palette.gray[100],
    },
  },
}))
function ListWithPagination({ request, limit = 5, limitQuery = 'customLimit', renderItem, statePath = 'productsList', customFilter, maxHeight = '100vh' }) {
  const { values } = useQueryParams()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  console.log(customFilter)

  const handleChange = (e) => {
    setPage(e)
  }
  useEffect(() => {
    if (!get(values, limitQuery)) {
      const offsetLimitParams = qs.stringify(
        {
          ...values,
          [limitQuery]: limit,
        },
        { addQueryPrefix: true }
      )
      navigate(`${location.pathname}${offsetLimitParams}`)
    }
  }, [])
  const changeOffsetSize = (offsetSize) => {
    const offsetLimitParams = qs.stringify(
      {
        ...values,
        [limitQuery]: offsetSize,
      },
      { addQueryPrefix: true }
    )

    navigate(`${location.pathname}${offsetLimitParams}`)
    setOpen(false)
  }
  const dataFilter = useMemo(() => {
    return {
      limit: limit,
      offset: page > 0 ? page * 5 - 5 : 0,
    }
  }, [values?.offset, page, limit])

  const {
    data: datList,
    isLoading: dataLoading,
    isFetching: isDataList,
    refetch,
  } = useQuery([statePath, dataFilter, customFilter], () => request({ ...dataFilter, ...customFilter }))
  return (
    <Box>
      <Box sx={{ padding: '0 0 10px 0', borderRadius: '10px', overflow: 'auto', position: 'relative', height: maxHeight }}>
        <LoadingBlurry outside isLoading={dataLoading} />

        {datList?.data?.data?.data?.map((item) => renderItem(item))}
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} mt='15px' position={'relative'}>
        <Box>
          <Button
            sx={(theme) => ({ height: '40px', padding: '8px 12px', borderRadius: '8px', background: theme.palette.background.default })}
            variant='outlined'
            size='small'
            endIcon={<ArrowDown />}
            fullWidth
            onClick={() => setOpen(!open)}
          >
            {get(values, limitQuery)}
          </Button>
          {open && (
            <Paper className={classes.lineSortContainer}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <List className={classes.lineSortList}>
                  {[5, 10, 20]
                    // .filter((n) => n < totalCount - (offsetIndex - 1) * offsetSize)
                    .map((opt) => (
                      <ListItem key={opt} component='button' className={classes.lineSortItem} onClick={() => changeOffsetSize(opt)}>
                        <Typography>{opt} строк</Typography>
                        {opt == get(values, limitQuery) && <TickIcon />}
                      </ListItem>
                    ))}
                </List>
              </ClickAwayListener>
            </Paper>
          )}
        </Box>
        <Pagination count={Math.ceil(datList?.data?.data?._meta?.total_count / 5)} handleChangeOffset={handleChange} page={page + 1} pageQuery='page' />
      </Box>
    </Box>
  )
}

export default ListWithPagination
