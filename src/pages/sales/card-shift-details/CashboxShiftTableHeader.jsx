// import Link from 'components/RouteAccess/Link'
import { Box } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import colors from '../../../assets/theme/mui.config'
import currency from '../../../../utils/currency'
import { Typography } from '@mui/material'
import EditableCell from './editable-cell'
import { useMemo } from 'react'

export const PriceBox = ({ data = [], id, color }) => {
  const uzs = useMemo(() => {
    if (!!data?.[0]) {
      return data[0]
    }

    return {}
  }, [data])

  const usd = useMemo(() => {
    if (!!data?.[1]) {
      return data[1]
    }

    return {}
  }, [data])

  return (
    <>
      <Typography
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          color,
        }}
      >
        <span id={`${id}-0`}>
          {thousandDivider(uzs?.cash_amount + uzs?.cashless_amount)} {uzs?.currency_name === 'UZS' ? currency() : uzs?.currency_name}
        </span>
      </Typography>
      {currency() !== 'USD' && (
        <>
          <Typography
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              color,
            }}
          >
            <span style={{ marginLeft: 4, color: color || colors.gray[400] }}>/</span>
            &nbsp;
            <span id={`${id}-1`}>
              {thousandDivider(usd?.cash_amount + usd?.cashless_amount)} {usd?.currency_name}
            </span>
          </Typography>
        </>
      )}
    </>
  )
}

const CashboxShiftTableHeader = (setPayment, t) => [
  {
    Header: t('table_columns.type'),
    accessor: 'type',
    borderRight: true,
    sticky: 'left',
    width: 158,
    Cell: ({ row }) => (
      <Box minHeight={72} display='flex' justifyContent='center' alignItems='center' maxWidth={158}>
        <a
          button
          onClick={() => setPayment(row?.original.payment_type_id)}
          style={{
            minWidth: 130,
          }}
          id={`shiftDrawer-type-${row.index}`}
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
        <PriceBox data={row.original.income} id={`shiftDrawer-get-${row.index}`} />
      </Box>
    ),
  },
  {
    Header: t('menu.sales.shifts.gone'),
    accessor: 'gone',
    width: 254,
    Cell: ({ row }) => (
      <Box style={{ whiteSpace: 'nowrap' }} display='flex'>
        <PriceBox data={row.original.expense} id={`shiftDrawer-gone-${row.index}`} />
      </Box>
    ),
  },
  {
    Header: t('menu.sales.shifts.waiting'),
    accessor: 'waiting',
    width: 254,
    Cell: ({ row }) => (
      <Box style={{ whiteSpace: 'nowrap' }} display='flex'>
        <PriceBox data={row.original.expected} id={`shiftDrawer-waiting-${row.index}`} />
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
      <Box display='flex'>
        <EditableCell
          id='shiftDrawer-actually'
          key={`${props.row.original.product_id}actually_first`}
          name='actually_first'
          adornment={currency()}
          {...props}
          dashed
          gray
          valuecustom={props?.row.original?.actual}
          info
        />
      </Box>
    ),
  },
  currency() !== 'USD' && {
    Header: ' ',
    accessor: 'actually_usd',
    borderRight: true,
    sticky: 'right',
    width: 183,
    Cell: (props) => (
      <Box display='flex'>
        <EditableCell
          id='shiftDrawer-actually_usd'
          key={`${props.row.original.product_id}actually_usd`}
          name='actually_usd'
          adornment={'USD'}
          marginRight
          dashed
          gray
          {...props}
          valuecustom={props?.row.original?.actual_usd}
          info
        />
      </Box>
    ),
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
          id={`shiftDrawer-difference-${row.index}`}
        >
          {rowOrg > 0 ? `+ ${thousandDivider(rowOrg)}` : thousandDivider(rowOrg)}
        </Box>
      )
    },
  },
]

export default CashboxShiftTableHeader
