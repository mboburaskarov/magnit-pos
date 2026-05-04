import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import SentFastIcon from '@/assets/icons/step-progress/SentFast'
import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import { get } from 'lodash'
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
export default function tableHeaderSelector({ branchesColumns, values, setOrderStoring, orderStoring, setOpen }) {
  const columns = branchesColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }

    if (el.field === 'material_code') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_code' />),
      }
    }

    if (el.field === 'store_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'sale_date') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Дата ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='sale_date' customText={dayjs(get(p, 'data.sale_date')).format('DD.MM.YYYY')} />),
      }
    }
    if (el.field === 'total_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Общая сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='total_amount' />),
      }
    }
    if (el.field === 'cash') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Наличные',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='cash' />),
      }
    }
    if (el.field === 'humo') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'HUMO',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='humo' />),
      }
    }
    if (el.field === 'return_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Возврат',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='return_amount' />),
      }
    }
    if (el.field === 'uzcard') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'UZCARD',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='uzcard' />),
      }
    }
    if (el.field === 'click') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'CLICK',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='click' />),
      }
    }
    if (el.field === 'payme') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Payme',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='payme' />),
      }
    }
    if (el.field === 'alif') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Alif',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='alif' />),
      }
    }
    if (el.field === 'uzum') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Uzum',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='uzum' />),
      }
    }
    if (el.field === 'uzum_tez_kor') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Uzum Tezkor',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='uzum_tez_kor' />),
      }
    }
    if (el.field === 'discount_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Сумма скидки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='discount_amount' />),
      }
    }
    if (el.field === 'cheque_count') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Количество чеков',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='cheque_count' />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerComponent: CustomHeader,
        headerName: 'Отп в 1c',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            sx={{
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'orange.500',
              '&:hover': {
                bgcolor: 'orange.400',
              },
            }}
            onClick={() => setOpen(p?.data)}
          >
            <SentFastIcon color='white' />
          </Box>
        )),
      }
    }
  })

  return columns
}
