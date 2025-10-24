import { useTheme } from '@mui/styles'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { useRef, useCallback } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { Box, Grid, Typography, CircularProgress } from '@mui/material'
import { get } from 'lodash'
import { requests } from '../../../../utils/requests'
import Label from '../../../../components/Label'
import dayjs from 'dayjs'

export default function TransferDetailModal({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { t } = useTranslation()

  const observerTarget = useRef(null)
  const LIMIT = 10 // Items per page

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['transferHistoryList', open],
    ({ pageParam = 0 }) =>
      requests.getTransferLogs({
        id: get(open, 'id'),
        offset: pageParam,
        limit: LIMIT,
      }),
    {
      enabled: !!open,
      getNextPageParam: (lastPage, allPages) => {
        const totalLoaded = allPages.reduce((acc, page) => acc + get(page, 'data.data', []).length, 0)
        const totalCount = get(lastPage, 'data.total', 0)

        return totalLoaded < totalCount ? totalLoaded : undefined
      },
    }
  )

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  // Set up observer
  useCallback(() => {
    const element = observerTarget.current
    const option = { threshold: 0 }
    const observer = new IntersectionObserver(handleObserver, option)

    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [handleObserver, observerTarget])()

  // Flatten all pages data
  const allItems = data?.pages?.flatMap((page) => get(page, 'data.data', [])) || []

  return (
    <StyledEmptyDialog
      maxWidth={900}
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'История перемещение'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {allItems.map((item, index) => (
              <Box
                key={`${get(item, 'id', index)}`}
                sx={{
                  '&:not(:last-child)': {
                    borderBottom: '1px solid',
                    borderColor: 'bunker.100',
                  },
                  width: '100%',
                  display: 'flex',
                  padding: '40px',
                  '& .field-data': {
                    bgcolor: 'bg.10',
                    borderRadius: '16px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: '500',
                  },
                }}
              >
                <Grid m={'3'} spacing={4} container>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Stage</Label>
                    <Typography className='field-data'>{get(item, 'stage')}</Typography>
                  </Grid>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Quantity</Label>
                    <Typography className='field-data'>{get(item, 'quantity')}</Typography>
                  </Grid>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Transfer type</Label>
                    <Typography className='field-data'>{get(item, 'transfer_type')}</Typography>
                  </Grid>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Сотрудник</Label>
                    <Typography className='field-data'>{get(item, 'employee.full_name', 'Unknown')}</Typography>
                  </Grid>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Created at</Label>
                    <Typography className='field-data'>{dayjs(get(item, 'created_at')).format('DD.MM.YYYY HH:mm:ss')}</Typography>
                  </Grid>
                  <Grid sm={6} lg={6} xl={6} xs={6} item>
                    <Label>Updated at</Label>
                    <Typography className='field-data'>{dayjs(get(item, 'updated_at')).format('DD.MM.YYYY HH:mm:ss')}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}

            {/* Observer target for infinite scroll */}
            <div ref={observerTarget} />

            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress size={30} />
              </Box>
            )}

            {/* No more data message */}
            {!hasNextPage && allItems.length > 0 && (
              <Box sx={{ textAlign: 'center', padding: '20px', color: 'text.secondary' }}>
                <Typography variant='body2'>Все записи загружены</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </StyledEmptyDialog>
  )
}
