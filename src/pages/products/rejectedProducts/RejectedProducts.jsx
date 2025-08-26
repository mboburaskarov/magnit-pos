import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function RejectedProducts({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: values?.store_id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
    }
  }, [values?.limitHistory, values?.offsetHistory, values?.search])

  const {
    data: productDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductDataHistory,
    refetch,
  } = useQuery(['productDataHistory', productHistoryFilter], () => requests.getRejectedProductList(productHistoryFilter, id))

  useEffect(() => {
    const count = productDataHistory?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [productDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'APTEKA',
        colId: 'store_name',
        minWidth: 300,
        maxWidth: 300,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.store_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Наименование',
        colId: 'product_name',
        minWidth: 300,
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.product_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.count}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Дата создания',
        colId: 'created_at',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(data?.created_at).format('DD.MM.YYYY')}</Typography>
          </Box>
        ),
      },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data?.data

  return (
    <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
      <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
        <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Товары с отказом
        </Typography>
      </Box>
      <Box
        width='100%'
        sx={{
          mb: '20px',
          '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
          '& .MuiFormControl-root, .MuiFormControl-root:hover': {
            background: 'transparent',
            width: '400px',
            height: 48,
          },
        }}
      >
        <InputSearch fullWidth={true} id='producrs-search' name='search' placeholder={'Магазин, наименование'} uncontrolled />
      </Box>
      <Box>
        <AgGridTable
          isDataLoading={isproductDataLoadingHistory || isFetchingproductDataHistory}
          offsetQuery='offsetHistory'
          limitQuery='limitHistory'
          id='products-history-table'
          totalCount={productDataHistory?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          defaultOffsetSize={5}
        />
      </Box>
    </Box>
  )
}
