import { Box, Typography } from '@mui/material'
import { numberToPrice } from '../../utils/numberToPrice'
import { colors } from '../../utils/getColors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { product_types } from '../../constants/product-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: '16px 24px',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.gray[100],
    marginBottom: 8,
    '& button': {
      border: 0,
      outline: 0,
      background: 'transparent',
      cursor: 'pointer',
      padding: 2,
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
    height: 40,
    width: 40,
    borderRadius: '50%',
    background: theme.palette.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.blue[500],
  },
  name: {
    margin: 0,
    marginBottom: 4,
    wordBreak: 'break-word',
  },
  articul: {
    margin: 0,
    color: theme.palette.gray[400],
    '& span': {
      color: theme.palette.gray[400],
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
    marginBottom: 4,
    color: theme.palette.blue[500],
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    '& svg': {
      marginBottom: -3,
      marginLeft: 4,
    },
  },
  newPrice: {
    display: 'block',
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 600,
    color: theme.palette.red[500],
  },
  oldPrice: {
    display: 'block',
    marginTop: 4,
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 600,
    textDecoration: 'line-through',
    color: theme.palette.gray[400],
  },
  seller: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    '& span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
    },
  },
  text_xira: {
    color: theme.palette.gray[400],
  },
  discount_type: {
    marginTop: 4,
    color: theme.palette.red[500],
    '&::before': {
      content: '/f02b',
    },
  },
  red: {
    color: theme.palette.red[500],
  },
}))
function OrderListItem({ data, type, returned, isDuplicate }) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { current_shop_id } = useSelector((state) => state.company)
  const productType = product_types?.find((item) => item.id === data?.product_type_id)

  const calculated_total_price = data?.price * (returned ? -data?.measurement_value : data?.measurement_value)

  return (
    <Box className={cls.root}>
      <Box className={cls.content}>
        <Box className={cls.details}>
          <Box className={cls.text} maxWidth={400}>
            <Typography id='product-name' className={cls.name}>
              {productType?.icon && (
                <span
                  style={{
                    marginRight: 8,
                  }}
                >
                  {productType?.icon}
                </span>
              )}
              {data.total_price < 0 || returned ? (
                <span className={cls.red}>
                  -{type === 'RETURN' ? data.returned_measurement_value : returned ? data.measurement_value : data.returned_measurement_value}{' '}
                  {data?.product?.measurement_unit?.short_name ? data?.product?.measurement_unit?.short_name : data?.product?.measurement_unit?.name || ''}
                </span>
              ) : (
                `${type === 'SALE' || type === 'EXCHANGE' ? data.measurement_value : data.returned_measurement_value} ${
                  data?.product?.measurement_unit?.short_name ? data?.product?.measurement_unit?.short_name : data?.product?.measurement_unit?.name || ''
                }`
              )}
              <span className={cls.text_xira}> x </span>
              {data.product.name}
            </Typography>
            <Typography className={cls.articul}>
              <span id='product-sku'>{data.product.sku}</span>
              <span>/</span>
              <span id='product-barcode'>{data.product.barcode}</span>
            </Typography>
            {data.discount_value !== 0 && (
              <Typography className={cls.discount_type}>
                <FontAwesomeIcon icon={faTag} />
                <span style={{ marginLeft: 8 }}>
                  {t('menu.sales.new.manual')} ({Math.round(data?.discount_percent * 100) / 100}%)
                </span>
              </Typography>
            )}
            {(data.total_price < 0 || returned) && (
              <Typography className={cls.red} style={{ marginTop: 4 }}>
                {t('menu.sales.new.returned_product')}
              </Typography>
            )}
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box className={cls.price}>
              <Box width='100%' textAlign='right'>
                {(!!data.discount_value || !!data.discount_percent) && (
                  <span id='price-with-discount' className={cls.newPrice}>
                    {numberToPrice(data?.total_price)}
                  </span>
                )}
                {!!data.used_wholesale_price && !data.discount_value && (
                  <span id='price-with-discount' className={cls.newPrice} style={{ color: '#8B5CF6' }}>
                    {numberToPrice(calculated_total_price)}
                  </span>
                )}
                <span id='total-price' className={data.discount_value || data.discount_percent || data.used_wholesale_price ? cls.oldPrice : ''}>
                  {numberToPrice(
                    data.discount_value
                      ? data.price * data?.measurement_value
                      : data.used_wholesale_price
                      ? data?.measurement_value *
                        (data?.product?.shop_prices?.find((item) => item?.shop_id === current_shop_id)?.retail_price || data?.product?.retail_price)
                      : calculated_total_price
                  )}
                </span>
              </Box>
            </Box>
            {data.sellers?.length > 0 &&
              data.sellers.map((item, index) => (
                <Box id='seller-details' className={cls.seller} key={index}>
                  <span id='seller-color' style={{ background: colors[index] }} />
                  <Typography id='seller-name' component='h5'>
                    {item.seller.name}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderListItem
