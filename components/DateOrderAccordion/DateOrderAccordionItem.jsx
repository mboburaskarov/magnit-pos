import { Box, Typography, Tooltip } from '@mui/material'
import { numberToPrice } from '@utils/numberToPrice'
import ArrowRightOutlined from '../../src/assets/icons/ArrowDown'
import { colors } from '@utils/getColors'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import event from '@utils/event'
import SmallUserIcon from '../../src/assets/icons/UserOutlineIcon'
import themeColors from '../../src/assets/theme/mui.config'
import { calculateCashbackAmount } from '@utils/calculateCashbackAmount'
import { makeStyles } from '@mui/styles'
import GiftCardBadge from '../GiftCardBadge'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px',
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.gray[100],
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all .2s',
    '&:hover': {
      backgroundColor: theme.palette.gray[101],
      '& svg': {
        fill: theme.palette.blue[500],
      },
    },
  },
  content: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  details: {
    display: 'flex',
    alignItems: 'center',
  },
  quantity: {
    height: 48,
    minWidth: 64,
    padding: 12,
    borderRadius: 32,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.blue[500],
  },
  text: {
    marginLeft: 24,
  },
  name: {
    margin: 0,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    color: theme.palette.gray[600],
    marginBottom: 8,
  },
  articul: {
    margin: 0,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    color: theme.palette.gray[400],
    '& span': {
      color: theme.palette.gray[600],
    },
    '& span:nth-of-type(2)': {
      color: theme.palette.gray[400],
      margin: '0 4px',
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: theme.palette.blue[500],
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '19px',
  },
  right: {
    marginLeft: 12,
  },
  seller: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    '& span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
    },
  },
  trashBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    transition: 'all .2s',
  },
  user: {
    height: 32,
    minWidth: 64,
    padding: 12,
    borderRadius: 32,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.gray[600],
  },
  username: {
    marginLeft: 5,
  },
  cashback: {
    height: 32,
    minWidth: 64,
    padding: 12,
    borderRadius: 32,
    background: theme.palette.blue[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.white,
  },
  info: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  red: {
    color: theme.palette.red[500],
  },
  tooltipIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    marginRight: 8,
    fontSize: 8,
  },
  tooltipItem: {
    display: 'flex',
    alignItems: 'center',
  },
  tooltipText: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
  },
  giftCardBadge: {
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    marginLeft: 8,
  },
  withoutCashback: {
    width: '126px',
    height: '32px',
    borderRadius: '32px',
    backgroundColor: theme.palette.gray[400],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withoutCashbackText: {
    fontSize: 16,
    color: '#fff',
  },
}))

export const CashbackInfo = ({ loyalty_balance_income, loyalty_balance_outcome }) => {
  const cls = useStyles()
  const tooltip = (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box className={cls.tooltipItem}>
        <Box className={cls.tooltipIcon} bgcolor={themeColors.green[400]}>
          +
        </Box>
        <span className={cls.tooltipText}>{numberToPrice(loyalty_balance_income)}</span>
      </Box>
      <Box className={cls.tooltipItem}>
        <Box className={cls.tooltipIcon} bgcolor={themeColors.red[500]}>
          -
        </Box>
        <span className={cls.tooltipText}>{numberToPrice(loyalty_balance_outcome)}</span>
      </Box>
    </Box>
  )

  return (
    <Tooltip placement='bottom' title={tooltip} arrow>
      <Box mt={3} className={cls.info}>
        <Box id='cashback' className={cls.cashback}>
          {calculateCashbackAmount(loyalty_balance_income, loyalty_balance_outcome)}
        </Box>
      </Box>
    </Tooltip>
  )
}

function DateOrderAccordionItem({ data, setIsOpen, searchTerm, title }) {
  const cls = useStyles()
  const { t } = useTranslation()

  const openDetails = () => {
    setIsOpen(data)
    event('transaction_detail_views')
  }

  const {
    total_products_measurement_value,
    total_services_measurement_value,
    total_sets_measurement_value,
    total_returned_measurement_value,
    loyalty_balance_income,
    loyalty_balance_outcome,
    has_certificate,
    has_voucher,
  } = data?.order_detail

  return (
    <Box id='cart-item' className={cls.root} onClick={openDetails}>
      <Box className={cls.content}>
        <Box className={cls.details}>
          <Box id='quantity' className={cls.quantity}>
            <Box>
              {total_products_measurement_value + total_sets_measurement_value + total_services_measurement_value}{' '}
              {total_returned_measurement_value ? (
                <>
                  <span className={cls.red}>(-{total_returned_measurement_value})</span>{' '}
                </>
              ) : (
                ''
              )}
              {t('dashboard.units')}
            </Box>
          </Box>
          <Box className={cls.text}>
            <p id='order-number' className={cls.name}>
              {title || t(`menu.orders.all.${data?.order_type?.toLowerCase()}`)} #
              <Highlighter
                highlightClassName='highlighter'
                searchWords={searchTerm ? searchTerm?.split(' ') : []}
                autoEscape
                textToHighlight={data?.order_number?.toString()}
              />
              <Box display='inline-flex' alignItems='center'>
                {has_certificate && <GiftCardBadge />}
                {has_voucher && <GiftCardBadge voucher />}
              </Box>
            </p>
            <p id='created-date' className={cls.articul}>
              <span>{dayjs(data?.display_sold_at || data?.order_detail?.created_at).format('DD.MM.YYYY | HH:mm:ss')}</span>
            </p>
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box className={`${cls.price} ${data?.order_detail?.has_discount ? cls.red : ''}`}>
              <Box>
                <span id='total-price'>{numberToPrice(data?.order_detail?.total_price)}</span>
              </Box>
            </Box>
            <Box id='shop-details' className={cls.seller}>
              <span style={{ background: colors[0] }} />
              <Typography id='shop-name' component='h5'>
                {data?.order_detail?.shop?.name}
              </Typography>
            </Box>
          </Box>
          <Box className={cls.right}>
            <div onClick={() => setIsOpen(null)} className={cls.trashBtn}>
              <ArrowRightOutlined />
            </div>
          </Box>
        </Box>
      </Box>
      <Box px={7} display='flex' justifyContent='space-between' width='100%' minWidth={420}>
        {data.order_detail?.customer.name ? (
          <Box mt={3} className={cls.info}>
            <Box className={cls.user}>
              <SmallUserIcon />
              <Typography id='customer-name' component='h1' className={cls.username}>
                {data?.order_detail?.customer?.name}
              </Typography>
            </Box>
          </Box>
        ) : null}
        {data.order_detail?.without_cashback && (
          <Box mt={3} className={cls.withoutCashback}>
            <Typography id='customer-name' component='h1' className={cls.withoutCashbackText}>
              {t('loyalty_program.without_cashback')}
            </Typography>
          </Box>
        )}
        {(loyalty_balance_income || loyalty_balance_outcome) && data.order_detail?.customer.name ? (
          <CashbackInfo loyalty_balance_income={loyalty_balance_income} loyalty_balance_outcome={loyalty_balance_outcome} />
        ) : null}
      </Box>
    </Box>
  )
}

export default DateOrderAccordionItem
