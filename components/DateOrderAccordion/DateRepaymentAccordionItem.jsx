import { Box, Typography } from '@mui/material'
import { numberToPrice } from '@utils/numberToPrice'
import ArrowRightOutlined from '../../src/assets/icons/ArrowDown'
import { colors } from '@utils/getColors'
import dayjs from 'dayjs'
import Highlighter from 'react-highlight-words'
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
    textAlign: 'start',
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
    padding: 12,
    borderRadius: 32,
    background: theme.palette.white,
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
}))
function DateRepaymentAccordionItem({ data, searchTerm, setOpen, setDebtId }) {
  const cls = useStyles()
  return (
    <Box
      id='cart-item'
      className={cls.root}
      onClick={() => {
        setOpen(true)
        setDebtId(data?.debt_id)
      }}
    >
      <Box className={cls.content}>
        <Box className={cls.details}>
          <Box id='quantity' className={cls.quantity}>
            #{data?.external_id}
          </Box>
          <Box className={cls.text}>
            <p id='order-number' className={cls.name}>
              {data?.customer?.name}
              <Highlighter
                highlightClassName='highlighter'
                searchWords={searchTerm ? searchTerm?.split(' ') : []}
                autoEscape
                textToHighlight={data?.order_number?.toString()}
              />
            </p>
            <p id='created-date' className={cls.articul}>
              <span>{dayjs(data?.created_at).format('DD.MM.YYYY | HH:mm:ss')}</span>
            </p>
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box className={cls.price}>
              <Box>
                <span id='total-price'>{numberToPrice(data?.amount)}</span>
              </Box>
            </Box>
            <Box id='shop-details' className={cls.seller}>
              <span style={{ background: colors[0] }} />
              <Typography id='shop-name' component='h5'>
                {data?.shop?.name}
              </Typography>
            </Box>
          </Box>
          <Box className={cls.right}>
            <Box className={cls.trashBtn}>
              <ArrowRightOutlined />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DateRepaymentAccordionItem
