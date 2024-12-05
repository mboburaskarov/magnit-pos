// import Link from 'components/RouteAccess/Link'
import { Box } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import colors from '../../../assets/theme/mui.config'
import currency from '../../../../utils/currency'
import EditableCell from './editable-cell'
import { Typography } from '@mui/material'
import CustomTooltip from '../../../../components/StyledTooltip'
import { PriceBox } from './CashboxShiftTableHeader'

export const tableHeaders = ({ setPayment, setOpenCurrencyValue, currencyValue, systemValue, t, webkassa24, forbiddenRoutes }) => {
  const editRoute = forbiddenRoutes.find((el) => el.slug === 'cashbox-open-edit')
  return [
    {
      Header: t('table_columns.type'),
      accessor: 'type',
      borderRight: true,
      sticky: 'left',
      width: 158,
      Cell: ({ row }) => (
        <Box minHeight={72} display='flex' justifyContent='center' alignItems='center' maxWidth={158}>
          <a
            id={`cash-shift-type-${row.index}`}
            button
            onClick={() => setPayment(row?.original.payment_type_id)}
            style={{
              minWidth: 130,
            }}
          >
            {row.original.payment_type_name}
          </a>
        </Box>
      ),
    },
    {
      Header: t('menu.sales.shifts.get'),
      accessor: 'get',
      width: 254,
      whiteSpace: 'nowrap',
      Cell: ({ row }) => (
        <Box style={{ whiteSpace: 'nowrap !important' }} display='flex'>
          <PriceBox data={row.original.income} id={`cash-shift-get-${row.index}`} />
        </Box>
      ),
    },
    {
      Header: t('menu.sales.shifts.gone'),
      accessor: 'gone',
      width: 254,
      Cell: ({ row }) => (
        <Box style={{ whiteSpace: 'nowrap' }} display='flex'>
          <PriceBox data={row.original.expense} id={`cash-shift-gone-${row.index}`} />
        </Box>
      ),
    },
    {
      Header: t('menu.sales.shifts.waiting'),
      accessor: 'waiting',
      width: 254,
      Cell: ({ row }) => (
        <Box style={{ whiteSpace: 'nowrap' }} display='flex'>
          <PriceBox data={row.original.expected} id={`cash-shift-waiting-${row.index}`} />
        </Box>
      ),
    },
    {
      Header: t('menu.sales.shifts.actually'),
      accessor: 'actually',
      borderLeft: true,
      sticky: 'right',
      width: 178,
      Cell: (props) => (
        <CustomTooltip disabled={!webkassa24} title={t('alerts.close_cashbox_twenty_hour_desc')} placement='top'>
          <Box display='flex'>
            <EditableCell
              id='cash-shift-actually'
              key={`${props.row.original.product_id}actually_first`}
              name='actually_first'
              adornment={currency()}
              isError={props.row.original.isError}
              dashed={editRoute || webkassa24}
              {...props}
            />
          </Box>
        </CustomTooltip>
      ),
    },
    currency() !== 'USD' && {
      Header: (
        <Box
          borderRadius={12}
          height={32}
          onClick={() => !editRoute && setOpenCurrencyValue(true)}
          sx={(theme) => ({
            background: systemValue === currencyValue ? theme.palette.gray[100] : theme.palette.blue[600],
            border: systemValue === currencyValue && `1px solid ${theme.palette.gray[300]}`,
            marginLeft: 1.5,
            marginTop: 1.5,
            maxWidth: 160,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          })}
          id='currency-box'
        >
          <Typography
            style={{
              fontSize: 14,
              lineHeight: '17px',
              padding: '6px 12px',
              whiteSpace: 'nowrap',
              color: systemValue !== currencyValue && 'white',
            }}
            id='currency-text'
          >
            1 USD = {thousandDivider(currencyValue)} {currency()}
          </Typography>
        </Box>
      ),
      accessor: 'actually_usd',
      borderRight: true,
      sticky: 'right',
      width: 183,
      Cell: (props) => {
        const dashed = props.row.original.payment_type_name !== 'Наличные' || editRoute || webkassa24
        return (
          <CustomTooltip disabled={!webkassa24} title={t('alerts.close_cashbox_twenty_hour_desc')} placement='top'>
            <Box display='flex'>
              <EditableCell
                id='actually_usd'
                key={`${props.row.original.product_id}actually_usd`}
                name='actually_usd'
                adornment='USD'
                marginRight
                isError={props.row.original?.isError && !dashed}
                dashed={dashed}
                gray={props.row.original.payment_type_name !== 'Наличные'}
                {...props}
              />
            </Box>
          </CustomTooltip>
        )
      },
    },
    {
      Header: t('table_columns.difference'),
      accessor: 'difference',
      sticky: 'right',
      width: 158,
      Cell: (row) => {
        const rowOrg = row?.row?.original?.difference

        return (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            whiteSpace='nowrap'
            minWidth={126}
            height={32}
            bgcolor={rowOrg === 0 ? colors.green[400] : rowOrg < 0 ? colors.red[500] : colors.violet[500]}
            color={colors.white}
            borderRadius={32}
            id={`cash-shift-difference-${row?.row?.index}`}
          >
            {rowOrg > 0 ? `+ ${thousandDivider(rowOrg)}` : thousandDivider(rowOrg)}
          </Box>
        )
      },
    },
  ]
}
