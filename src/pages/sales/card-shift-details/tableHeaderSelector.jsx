import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import TextField from '../../../../components/Inputs/TextField'
import { get } from 'lodash'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ cardShiftColumns, t, setValue, changeCloseBoxNetAmout }) {
  const columns = cardShiftColumns?.map((el) => {
    if (el.field === 'type') {
      return {
        ...el,
        headerName: 'Тип',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography fontSize={'16px'} lineHeight={'24px'} fontWeight={'600'} color={'orange.500'}>
            {get(p, 'data.name')}
          </Typography>
        )),
      }
    }
    if (el.field === 'amount') {
      return {
        ...el,
        headerName: 'Попало',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='amount' />),
      }
    }
    if (el.field === 'expense_amount') {
      return {
        ...el,
        headerName: 'Ушло',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='expense_amount' />),
      }
    }
    if (el.field === 'net_amount') {
      return {
        ...el,
        headerName: 'Фактически',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            {p?.data?.id == 'ag-grid-footer' || p?.data?.amount == '0' ? (
              <Typography>{thousandDivider(get(p, 'data.net_amount'))}</Typography>
            ) : (
              <NumberFormatInput
                onBlur={({ target }) => {
                  if (get(p, 'data.net_amount') != Number(get(target, 'value')))
                    changeCloseBoxNetAmout({ id: get(p, 'data.id'), data: { net_amount: Number(get(target, 'value', '')?.replace(/\s+/g, '')) } })
                }}
                setValue={setValue}
                id={`net_amount_${p?.data?.id}`}
                name={`net_amount_${p?.data?.id}`}
                type='number'
              />
            )}
          </>
        )),
      }
    }
    if (el.field === 'difference_amount') {
      return {
        ...el,
        headerName: 'Разница',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${get(p, 'data.difference_amount') >= 0 ? 'green.100' : 'red.10'}`,
              color: `${get(p, 'data.difference_amount') >= 0 ? 'green.500' : 'red.500'}`,
              height: '32px',
              padding: '6px 20px',

              minWidth: '170px',
              borderRadius: '24px',
            }}
          >
            {thousandDivider(get(p, 'data.difference_amount'))}
          </Box>
        )),
      }
    }
  })

  return columns
}
