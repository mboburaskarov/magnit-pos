import { Box, Typography } from '@mui/material'
import { numberToPrice } from '@utils/numberToPrice'
import ArrowRightOutlined from '../../src/assets/icons/ArrowDown'
import { colors } from '@utils/getColors'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import SmallUserIcon from '../../src/assets/icons/ArrowDown'
import event from '@utils/event'
import currency from '@utils/currency'
import { makeStyles } from '@mui/styles'

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
    background: theme.palette.white,
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
    width: '38%',
    padding: 12,
    borderRadius: 32,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.gray[600],
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
    width: '100%',
    justifyContent: 'space-around',
  },
  red: {
    color: theme.palette.red[500],
  },
}))
function DateHistoryAccordionItem({ data, setIsOpen, searchTerm }) {
  const cls = useStyles()
  const { t } = useTranslation()

  const openDetails = () => {
    setIsOpen(data)
    event('transaction_detail_views')
  }
  const { total_products_measurement_value, total_services_measurement_value, total_sets_measurement_value, total_returned_measurement_value } =
    data?.order_detail

  return (
    <Box className={cls.root} onClick={openDetails}>
      <Box className={cls.content}>
        <Box className={cls.details}>
          <Box className={cls.quantity}>
            <Box>
              {total_products_measurement_value + total_services_measurement_value + total_sets_measurement_value}{' '}
              {total_returned_measurement_value ? (
                <>
                  <span className={cls.red}>(-{total_returned_measurement_value})</span>{' '}
                </>
              ) : (
                ''
              )}
              {t('dashboard.pcs')}
            </Box>
          </Box>
          <Box className={cls.text}>
            {data?.order_type ? (
              <p className={cls.name}>
                {t(`menu.orders.all.${data?.order_type?.toLowerCase()}`)} #
                <Highlighter
                  highlightClassName='highlighter'
                  searchWords={searchTerm ? searchTerm?.split(' ') : []}
                  autoEscape
                  textToHighlight={data?.order_number?.toString()}
                />
              </p>
            ) : null}
            <p className={cls.articul}>
              <span>{dayjs(data?.display_sold_at).format('DD.MM.YYYY | HH:mm:ss')}</span>
            </p>
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box className={`${cls.price} ${data?.order_detail?.has_discount ? cls.red : ''}`}>
              <Box>
                <span>{numberToPrice(data?.order_detail?.total_price)}</span>
              </Box>
            </Box>
            <Box className={cls.seller}>
              <span style={{ background: colors[0] }} />
              <Typography component='h5'>{data?.order_detail?.shop?.name}</Typography>
            </Box>
          </Box>
          <Box className={cls.right}>
            <div onClick={() => setIsOpen(null)} className={cls.trashBtn}>
              <ArrowRightOutlined />
            </div>
          </Box>
        </Box>
      </Box>
      {data.order_detail?.customer?.name ? (
        <Box mt={3} className={cls.info}>
          <Box className={cls.user}>
            <SmallUserIcon />
            <Typography component='h1' ml={5}>
              {data?.order_detail?.customer?.name}
            </Typography>
          </Box>
          <Box className={cls.cashback}>+ 50000 {currency()}</Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default DateHistoryAccordionItem
