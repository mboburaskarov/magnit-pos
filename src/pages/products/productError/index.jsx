import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import CheckAccess from '../../../../components/CheckAccess'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { requests } from '../../../../utils/requests'
import EditIcon from '../../../assets/icons/EditIcon'
import LeftArrowIcon from '../../../assets/icons/LeftArrow'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function RejectedProducts({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [selectedShops, setSelectedShops] = useState('all')
  const { t } = useTranslation()

  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: selectedShops == 'all' ? undefined : selectedShops?.id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
    }
  }, [values?.limitHistory, selectedShops, values?.offsetHistory, values?.search])

  const {
    data: productErrorsList,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductErrorsList,
    refetch,
  } = useQuery(['productErrorsList', productHistoryFilter], () => requests.getProductErrors(productHistoryFilter, id))
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))

  useEffect(() => {
    const count = productErrorsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [productErrorsList?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: '№',
        colId: 'number',
        minWidth: 60,
        width: 60,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offsetHistory', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} textAlign={'start'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      },
      {
        headerName: 'Наименование',
        colId: 'name',
        minWidth: 300,
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Создатель',
        colId: 'created_by',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.created_by}</Typography>
          </Box>
        ),
      },
      // {
      //   headerName: 'Решающий',
      //   colId: 'resolved_by',
      //   minWidth: 185,
      //   maxWidth: 185,
      //   width: 185,
      //   cellRenderer: ({ data, rowIndex }) => (
      //     <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
      //       <Typography>{data?.resolved_by}</Typography>
      //     </Box>
      //   ),
      // },

      {
        headerName: 'Причина',
        colId: 'reason',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.reason}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Тип ошибки',
        colId: 'error_type',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => {
          const categories = [
            { name: 'Мл/доза неверна', value: '1' },
            { name: 'Ошибка производителя', value: '2' },
            { name: 'Ошибка изображения', value: '3' },
            { name: 'Другой', value: '4' },
          ]
          return (
            <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
              <Typography>{categories.find((i) => i?.value == data?.category)?.name}</Typography>
            </Box>
          )
        },
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
      {
        headerName: t('table_columns.actions'),
        colId: 'action',
        minWidth: 120,
        maxWidth: 120,
        width: 120,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <CheckAccess id={'edit-product'}>
              <IconButton onClick={() => navigate(`/products/edit/${data.product_id}`)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
          </Box>
        ),
      },
    ],
    []
  )

  const formattedData = productErrorsList?.data?.data?.data

  return (
    <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/products/all`)}
        >
          <Box
            sx={{
              width: '48px',
              height: '48px',
              padding: '0',
              display: 'flex',
              mr: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'bunker.100',
              '&:hover': {
                backgroundColor: 'gray.10',
              },
            }}
          >
            <LeftArrowIcon />
          </Box>
          <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            Ошибки в информации о лекарствах
          </Typography>
        </Box>
      </Box>

      <Box
        width='100%'
        sx={{
          mb: '20px',
          display: 'flex',
          '& .MuiBox-root': {
            width: 'auto',
          },
          '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
          '& .MuiFormControl-root, .MuiFormControl-root:hover': {
            background: 'transparent',
            width: '400px',
            height: 48,
          },
        }}
      >
        <InputSearch fullWidth={false} id='producrs-search' name='search' placeholder={'Наименование'} uncontrolled />

        {/* <Box maxWidth={'300px'} ml={2} mr={2}>
          <MultiOptionSelectNew
            zIndex={999}
            placeholder={t('placeholders.select_shops')}
            // multiple
            defaultSelectedAll
            beforeContent={t('placeholders.select_shops')}
            value={selectedShops}
            allOptions={get(shopList, 'data.data.ids', [])}
            selectAllLabel={'Все филиалы'}
            options={get(shopList, 'data.data.data', [])}
            isLoading={false}
            onChange={(val) => {
              setSelectedShops(val)
            }}
            request={requests.getAllStores}
          />
        </Box> */}
      </Box>

      <Box>
        <AgGridTable
          isDataLoading={isproductDataLoadingHistory || isFetchingproductErrorsList}
          offsetQuery='offsetHistory'
          limitQuery='limitHistory'
          id='products-history-table'
          totalCount={productErrorsList?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          defaultOffsetSize={5}
        />
      </Box>
    </Box>
  )
}
