import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNew'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import InputSearch from '@components/Inputs/InputSearch'
import { useQueryParams } from '@hooks/useQueryParams'
import { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { requests } from '@utils/requests'
import { useQuery } from 'react-query'
import { get } from 'lodash'
import { t } from 'i18next'
import dayjs from 'dayjs'

const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    let newOrder = { position: 0, colId: '' }
    if (lastStort) {
      if (orderPosition == 2 && ordercolId == props.column.colId) {
        newOrder = {
          position: 0,
          colId: '',
        }
      } else {
        if (ordercolId != props.column.colId && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: props.column.colId,
          }
        } else {
          newOrder = {
            position: orderPosition + 1,
            colId: props.column.colId,
          }
        }
      }
    }

    props.column.colDef.setOrderStoring(newOrder)
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        padding: '12px',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111217',
          fontSize: '16px',
          fontWeight: ' 600',
          lineHeight: '24px',
        }}
      >
        {props.displayName}
        <Box height={'18px'} ml='10px'>
          {orderPosition == 1 && currentColId == ordercolId && <ArrowUpward color='#ccc' />}
          {orderPosition == 2 && currentColId == ordercolId && <ArrowDownward color='#ccc' />}
        </Box>
      </Typography>
    </Box>
  )
}

export default function RejectedProducts({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [selectedShops, setSelectedShops] = useState('all')
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const navigate = useNavigate()
  const rejectedProductListFIlter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: selectedShops == 'all' ? undefined : selectedShops?.id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
    }
  }, [values?.limitHistory, selectedShops, values?.offsetHistory, values?.search, orderStoring])

  const {
    data: rejectedProductList,
    isLoading: isRejectedProductList,
    isFetching: isFetchingrejectedProductList,
    refetch,
  } = useQuery(['rejectedProductList', rejectedProductListFIlter], () => requests.getRejectedProductList(rejectedProductListFIlter, id))
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))

  useEffect(() => {
    const count = rejectedProductList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [rejectedProductList?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [rejectedProductListFIlter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Aптека',
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
        headerName: 'Кол-во',
        colId: 'rejected_times',
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(data?.created_at).format('DD.MM.YYYY')}</Typography>
          </Box>
        ),
      },
    ],
    [orderStoring],
  )

  const formattedData = rejectedProductList?.data?.data?.data

  return (
    <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
      <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Товары с отказом
        </Typography>
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

        <Box maxWidth={'300px'} ml={2} mr={2}>
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
        </Box>
      </Box>
      <Box>
        <AgGridTable
          isDataLoading={isRejectedProductList || isFetchingrejectedProductList}
          offsetQuery='offsetHistory'
          limitQuery='limitHistory'
          id='products-history-table'
          totalCount={rejectedProductList?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          updaterAction={(newData) => {}}
          defaultOffsetSize={5}
        />
      </Box>
    </Box>
  )
}
