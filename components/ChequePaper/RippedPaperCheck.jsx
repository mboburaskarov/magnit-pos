import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import TickOutlinedIcon from '../../src/assets/icons/BigTickIcon'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { QRCodeCanvas } from 'qrcode.react'
import DashedRow from './DashedRow.jsx'
import useStyles from './useStyles'

import palette from '../../src/assets/theme/mui.config'
import { get } from 'lodash'
import dayjs from 'dayjs'
import thousandDivider from '../../utils/thousandDivider.js'

function RippedPaperCheck({
  data,
  margin,
  qrcodeUrl,
  cashBoxDetails,
  customerId,
  checked,
  paymentsList,
  cartItemsList,
  chequeData: cheque,
  logo = '',
  noSticky,
  orderItems,
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)

  const disableSumsOnGoods = () => {
    const found = cheque?.information_block?.find((el) => el?.id === '30e14632-dc10-40a1-b97a-1be73a53054a')

    return !!found ? found?.is_active === true : true
  }

  const disableDiscountOnCheque = () => {
    const found = cheque?.information_block?.find((el) => el?.id === '8f610bdf-f875-4f14-aac7-2ffa0eb5f267')

    return !!found ? found?.is_active === true : true
  }

  const disableSumsOnCheque = () => {
    const found = cheque?.information_block?.find((el) => el?.id === 'bf55661b-b18c-4c15-a806-3bffb50b9001')

    return !!found ? found?.is_active === true : true
  }

  return (
    <Box className={`${classes.root} ${noSticky ? classes.noSticky : ''}`}>
      <Box className={classes.inner} mx={margin && 4}>
        <Box px={2} py={4}>
          <div className={classes.canvasContainer}>
            <img
              src={'/brand_cheque.png'}
              alt=''
              style={{
                position: 'relative',
                top: logo?.y,
                left: logo?.x,
                transformOrigin: 'left top',
                transform: `rotate(${logo?.rotation}deg)`,
                color: palette.black,
                width: `${logo?.width}px`,
                height: `${logo?.height}px`,
                verticalAlign: 'middle',
                lineHeight: `${logo?.height}px`,
              }}
            />
          </div>
          <div className={classes.border} />
          <Fragment key={'index'}>
            <Box className={classes.content}>
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index2'}`}
                  rowData={{
                    type: `Sotuv raqami:`,
                    value: `#${get(cashBoxDetails, 'data.data.sale_number')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index3'}`}
                  rowData={{
                    type: `Do'kon:`,
                    value: `${get(userData, 'store.name')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index3'}`}
                  rowData={{
                    type: `Manzil:`,
                    value: `${get(userData, 'store.address')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index9'}`}
                  rowData={{
                    type: `Kontakt:`,
                    value: `+${get(userData, 'store.phone', '-')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index4'}`}
                  rowData={{
                    type: `Sana:`,
                    value: `${dayjs(new Date()).format('DD.MM.YYYY, HH:mm:ss')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index5'}`}
                  rowData={{
                    type: `Ish tartibi:`,
                    value: `09:00 - 18:00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index6'}`}
                  rowData={{
                    type: `Sotuvchi:`,
                    value: `${get(userData, 'first_name')}`,
                  }}
                />
              )}

              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index8'}`}
                  rowData={{
                    type: `Mijoz:`,
                    value: `${get(customerId, 'name', '-')}`,
                  }}
                />
              )}
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
          </Fragment>
          {get(cartItemsList, 'data', [])?.map((el, index) => (
            <Fragment key={'index3'}>
              <Box className={classes.content}>
                <p id={`return-name-${'index'}`}>
                  <b className={classes.bold}>
                    {index + 1}. {get(el, 'name')}
                  </b>
                </p>
                {disableSumsOnGoods() && (
                  <DashedRow
                    id={`return-price-${'index'}`}
                    rowData={{
                      type: `${get(el, 'quantity')},${get(el, 'unit_quantity')} dona`,
                      value: `${thousandDivider(get(el, 'total_price'))} so'm`,
                    }}
                  />
                )}
                <Box>
                  <Typography>O'lchiv birligi: {get(el, 'package_name', '-')}</Typography>
                  <Typography>MXIK: {get(el, 'class_code', '-')}</Typography>
                  <Typography>ShtKod: {get(el, 'barcode', '-')}</Typography>
                </Box>
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `QQS: ${get(el, 'vat_percent')}%`,
                    value: `${thousandDivider(get(el, 'vat'))} so'm`,
                  }}
                />
              </Box>
              {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
            </Fragment>
          ))}

          <Fragment key={'index39'}>
            <Box className={classes.content}>
              {paymentsList?.map(
                (el) =>
                  disableSumsOnGoods() && (
                    <DashedRow
                      id={`return-price-${'index'}`}
                      rowData={{
                        type: `${el.name}:`,
                        value: `${thousandDivider(el.amount)} so'm`,
                      }}
                    />
                  )
              )}

              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Umumiy narx`,
                    value: `${thousandDivider(get(cartItemsList, 'sum'))} so'm`,
                  }}
                />
              )}
              {disableSumsOnGoods() && get(cartItemsList, 'discount_amount', 0) > 0 && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Chegirma`,
                    value: `${thousandDivider(get(cartItemsList, 'discount_amount'))} so'm`,
                  }}
                />
              )}
              <DashedRow
                id={`return-price-${'index'}`}
                rowData={{
                  type: `Umumiy QQS`,
                  value: `${thousandDivider(get(cartItemsList, 'vat_sum'))} so'm`,
                }}
              />
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  main
                  rowData={{
                    type: `Yakuniy narx`,
                    value: `${thousandDivider(get(cartItemsList, 'total_amount'))} so'm`,
                  }}
                />
              )}
              <Box>
                <Typography>Chek turi: {get(cashBoxDetails, 'data.data.sale_type') == 'SALE' ? 'Sotuv' : 'Qaytarish'}</Typography>
              </Box>
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
            <Box minWidth={'250px'} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <Typography mb={'10px'} textAlign={'center'} mt={'10px'}>
                Sizning xaridning 1% miqdorida "Keshbek" olish huquqiga ega bo'ldingiz
              </Typography>

              <QRCodeCanvas value={qrcodeUrl} />
              <Typography fontSize={'14px'} mt={'10px'}>
                CHEK NUSXASI
              </Typography>
              <Typography textAlign={'center'} fontSize={'14px'} mt={'10px'}>
                SOTILGAN TOVAR ALMASHTIRILMAYDI VA QAYTARIB OLINMAYDI
              </Typography>
              <Typography fontSize={'14px'} mt={'10px'}>
                XARIDINGIZ UCHUN RAXMAT!!!
              </Typography>
            </Box>
          </Fragment>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperCheck
