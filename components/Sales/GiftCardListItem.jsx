import { Box, Typography } from '@mui/material'
import { numberToPrice } from '@utils/numberToPrice'
import { colors } from '@utils/getColors'
import { useTranslation } from 'react-i18next'
import { useStyles } from './OrderListItem'
import React from 'react'
import GiftCardBadge from '../GiftCardBadge'
import { getGiftCardTitle } from '@utils/getGiftCardTitle'

const GiftCardListItem = ({ data }) => {
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <Box className={cls.root}>
      <Box className={cls.content}>
        <Box className={cls.details}>
          <Box className={cls.text} maxWidth={400}>
            <Typography id='product-name' className={cls.name}>
              {t(getGiftCardTitle(data?.product?.type))} {data?.product?.barcode}
              <GiftCardBadge voucher={data?.product?.type === 'VOUCHER'} size={24} />
            </Typography>
            <Typography className={cls.articul}>
              <span id='product-sku'>{data?.product?.expire_date}</span>
              <span>/</span>
              <span id='product-barcode'>{t(`menu.marketing.certificates.types.${data?.product?.gift_card_use_type.toLowerCase()}`)}</span>
            </Typography>
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box className={cls.price}>
              <Box width='100%' textAlign='right'>
                <span id='amount'>{numberToPrice(data?.total_price)}</span>
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

export default GiftCardListItem
