import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useWindowHeight } from '@hooks/useWindowHeight'
import { useCallback, useEffect, useRef } from 'react'
import thousandDivider from '@utils/thousandDivider'
import SortIcon from '@icons/dashboard/SortIcon'
import { useInfiniteQuery } from 'react-query'
import { requests } from '@utils/requests'
import { get } from 'lodash'
import { t } from 'i18next'
import dayjs from 'dayjs'

const BonusTableRow = ({ item, product }) => {
  const isActive = !dayjs(item.start_date).isAfter(dayjs(), 'day') && !dayjs(item.end_date).isBefore(dayjs(), 'day')
  return (
    <TableRow
      sx={{
        '& td': {
          borderColor: 'bunker.100',
        },
      }}
    >
      <TableCell sx={{ padding: '16px 12px' }}>
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '14px',
            lineHeight: '20px',
            color: 'bunker.950',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '200px',
          }}
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '12px',
            lineHeight: '18px',
            color: 'grey.700',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '200px',
          }}
        >
          {dayjs(item.start_date).format('DD.MM.YYYY')} - {dayjs(item.end_date).format('DD.MM.YYYY')}
        </Typography>
      </TableCell>
      <TableCell sx={{ padding: '8px 12px' }}>
        <Box>
          <Typography sx={{ fontWeight: '500', fontSize: '14px', lineHeight: '20px', color: 'bunker.500' }}>
            {thousandDivider(product.supply_price, 'сум')}
          </Typography>
          <Typography
            sx={{
              borderRadius: '16px',
              fontWeight: '600',
              fontSize: '10px',
              lineHeight: '12px',
              padding: '3px 4px 2px',
              bgcolor: isActive ? '#FFC120' : '#aaa',
              color: isActive ? 'bunker.950' : '#fff',
              width: 'max-content',
            }}
          >
            +{thousandDivider(item.bonus_amount, 'сум')}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  )
}

function BonusProductTable({  bonusTableHeight }) {
  const LIMIT = 5
  const observerTarget = useRef(null)

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['allBonusProductsList'],
    ({ pageParam = 0 }) => requests.getProductBonusList({ offset: pageParam, limit: LIMIT }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const currentOffset = (allPages.length - 1) * LIMIT
        const totalItems = get(lastPage, 'data.data._meta.total_count', 0)
        const hasMore = currentOffset + LIMIT < totalItems
        return hasMore ? currentOffset + LIMIT : undefined
      },
    },
  )

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const element = observerTarget.current
    const option = { threshold: 0 }

    const observer = new IntersectionObserver(handleObserver, option)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [handleObserver])

  // Flatten all pages data
  const allProducts = data?.pages.flatMap((page) => (get(page, 'data.data.data', false) ? get(page, 'data.data.data', []) : [])) || []
  const maxHeight = useWindowHeight()

  return (
    <Box sx={{ padding: '0 20px', mt: '12px' }}>
      <TableContainer sx={{ maxHeight: `${maxHeight - 800 + bonusTableHeight}px`, overflowY: 'auto' }}>
        <Table>
          <TableHead
            sx={{
              bgcolor: 'bg.10',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              '& th': {
                p: '8px 12px',
                borderBottom: 'none',
              },
              '& th:nth-child(1)': {
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
              },
              '& th:nth-child(2)': {
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
              },
            }}
          >
            <TableCell>
              <Typography
                sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: '600',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: 'bunker.300',
                }}
              >
                {t('name')} {
                // false ? <SortUpIcon /> ? false : <SortDownIcon /> :
                 <SortIcon />}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: '600',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: 'bunker.300',
                }}
              >
                {t('price')} {
                // true ? <SortUpIcon /> : false ? <SortDownIcon /> :
                 <SortIcon />}
              </Typography>
            </TableCell>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} align='center' sx={{ padding: '40px' }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : allProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align='center' sx={{ padding: '40px' }}>
                  <Typography sx={{ color: 'bunker.500' }}>Нет данных</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {allProducts &&
                  allProducts.length &&
                  allProducts.map((item, index) => <BonusTableRow key={item.id || index} item={item} product={item?.product} />)}
                {/* Observer target for infinite scroll */}
                <TableRow ref={observerTarget}>
                  <TableCell colSpan={2} align='center' sx={{ padding: '20px', border: 'none' }}>
                    {isFetchingNextPage && <CircularProgress size={24} />}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default BonusProductTable
