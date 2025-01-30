import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import StyledTooltip from '../../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import getImageUrl from '../../../../utils/getImageUrl'
import thousandDivider from '../../../../utils/thousandDivider'
import DefaultUserImgIcon from '../../../assets/icons/defaultUserImgIcon'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ productsColumns, setOpenSaleDrawer, values }) {
  const columns = productsColumns?.map((el) => {
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

    if (el.field === 'sale_number') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box sx={{ '& p': { color: 'orange.500' }, cursor: 'pointer' }} onClick={() => setOpenSaleDrawer({ id: p.data.id })}>
            <SimpleText {...p} type='sale_number' />
          </Box>
        )),
      }
    }
    if (el.field === 'document') {
      return {
        ...el,
        headerName: 'Kасса',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='cash_box_name' />),
      }
    }
    // if (el.field === 'organisation') {
    //   return {
    //     ...el,
    //     headerName: 'Организация',
    //     colId: el.field,
    //     cellRenderer: memo((p) => <SimpleText {...p} type='organisation' />),
    //   }
    // }
    if (el.field === 'total_amount') {
      return {
        ...el,
        headerName: 'Общая сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='total_amount' />),
      }
    }
    if (el.field === 'cash') {
      return {
        ...el,
        headerName: 'Наличные',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Naqd')}
            type='amount'
          />
          // )
          // <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
          //   <Typography>
          //     {get(
          //       get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Naqd'),
          //       'amount',
          //       0
          //     )}
          //     сум
          //   </Typography>
          // </Box>
        )),
      }
    }
    if (el.field === 'humo') {
      return {
        ...el,
        headerName: 'Humo',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Humo')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'uzcard') {
      return {
        ...el,
        headerName: 'Uzcard',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Uzcard')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'visa') {
      return {
        ...el,
        headerName: 'Visa',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Visa')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'payme') {
      return {
        ...el,
        headerName: 'Payme',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Payme')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'click') {
      return {
        ...el,
        headerName: 'Click',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Click')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'uzumbank') {
      return {
        ...el,
        headerName: 'Uzumbank',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'UzumBank')}
            type='amount'
          />
        )),
      }
    }
    if (el.field === 'balance') {
      return {
        ...el,
        headerName: 'Баланс',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            currency='сум'
            withDevider
            {...p}
            data={get(p, 'data.sale_payments', []).find((payment) => payment.payment_type.name == 'Balanc')}
            type='amount'
          />
        )),
      }
    }

    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата регистрации',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {get(p, 'data.store_name', '-')}
          </Typography>
        )),
      }
    }

    if (el.field === 'employee') {
      return {
        ...el,
        headerName: 'Сотрудник',
        colId: el.field,
        cellRenderer: memo((p) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + p.data?.employee?.phone)}>
            <Box display={'flex'} alignItems={'center'}>
              {p.data.employee?.image ? (
                <img style={{ width: '40px', borderRadius: '50%', height: '40px', marginRight: '10px' }} src={getImageUrl(p.data.customer?.image)} />
              ) : (
                <DefaultUserImgIcon />
              )}
              <a href={`tel:${'+' + p.data.employee?.phone}`}>
                <Typography
                  id={p.data.employee?._id}
                  style={{ whiteSpace: 'pre-line', color: 'bunker.950', fontSize: '16px', lineHeight: '24px', marginLeft: '8px', fontWeight: 600 }}
                >
                  {p.data.employee?.first_name}
                </Typography>
              </a>
            </Box>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'customer') {
      return {
        ...el,
        headerName: 'Клиент',
        colId: el.field,
        cellRenderer: memo((p) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + p.data?.customer?.phone)}>
            <Box display={'flex'} alignItems={'center'}>
              {p.data.customer?.image ? (
                <img style={{ width: '40px', borderRadius: '50%', height: '40px', marginRight: '10px' }} src={getImageUrl(p.data.customer?.image)} />
              ) : (
                <DefaultUserImgIcon />
              )}
              <a href={`tel:${'+' + p.data.customer?.phone}`}>
                <Typography
                  id={p.data.customer?._id}
                  style={{ whiteSpace: 'pre-line', color: 'bunker.950', marginLeft: '8px', fontSize: '16px', lineHeight: '24px', fontWeight: 600 }}
                >
                  {get(p, 'data.customer.first_name', 'Unknown')}
                </Typography>
              </a>
            </Box>
          </StyledTooltip>
        )),
      }
    }
  })

  return columns
}
