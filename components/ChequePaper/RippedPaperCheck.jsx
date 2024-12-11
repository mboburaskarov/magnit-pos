import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import TickOutlinedIcon from '../../src/assets/icons/BigTickIcon'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import DashedRow from './DashedRow.jsx'
import useStyles from './useStyles'

import palette from '../../src/assets/theme/mui.config'
import { get } from 'lodash'
import ChequeBarcode from './ChequeBarcode'
import dayjs from 'dayjs'

function RippedPaperCheck({
  data,
  margin,
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
      {/* <Box display='flex' alignItems='center' flexDirection='column' mb={4}>
        {checked && (
          <>
            <Box my={1}>
              <TickOutlinedIcon />
            </Box>
            <Typography variant='h5'>{data?.name || t('menu.settings.shops.shop_create.cheque_type')}</Typography>
          </>
        )}
      </Box> */}

      <Box className={classes.inner} mx={margin && 4}>
        <Box px={2} py={4}>
          <div className={classes.canvasContainer}>
            {/* <Box width={288} height={96} className={classes.canvas}> */}
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
            {/* </Box> */}
          </div>
          <div className={classes.border} />
          <Fragment key={'index'}>
            <Box className={classes.content}>
              {/* <p id={`return-name-${'index'}`}>
                <b className={classes.bold}>crcrcr</b>
              </p> */}
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
                    value: `Pharma Cosmos`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index4'}`}
                  rowData={{
                    type: `Sana:`,
                    value: ` ${dayjs().day(7).format('DD.MM.YYYY, HH:mm:ss')}`,
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
                    value: `${get(userData, 'fullName')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index8'}`}
                  rowData={{
                    type: `Mijoz:`,
                    value: `${get(customerId, 'name', '')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index9'}`}
                  rowData={{
                    type: `Kontakt:`,
                    value: `${get(customerId, 'phone', '')}`,
                  }}
                />
              )}
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
          </Fragment>
          {get(cartItemsList, 'data').map((el, index) => (
            <Fragment key={'index3'}>
              <Box className={classes.content}>
                <p id={`return-name-${'index'}`}>
                  <b className={classes.bold}>
                    {index + 1}. {get(el, 'product.name')}
                  </b>
                </p>
                {disableSumsOnGoods() && (
                  <DashedRow
                    id={`return-price-${'index'}`}
                    rowData={{
                      type: `${get(el, 'quantity')} dona`,
                      value: `${get(el, 'total_price')} so'm`,
                    }}
                  />
                )}
              </Box>
              {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
            </Fragment>
          ))}
          {/* <Fragment key={'index35'}>
            <Box className={classes.content}>
              <p id={`return-name-${'index'}`}>
                <b className={classes.bold}>2. Azitromirsin 250 mg / Dorilar/ Antibiotik</b>
              </p>
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `1 dona x 239 9000`,
                    value: `789 900 UZS`,
                  }}
                />
              )}
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
          </Fragment> */}
          <Fragment key={'index39'}>
            <Box className={classes.content}>
              {/* <p id={`return-name-${'index'}`}>
                <b className={classes.bold}>1. Azitromirsin 250 mg / Dorilar/ Antibiotik</b>
              </p> */}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Jami`,
                    value: `${get(cartItemsList, 'total_amount')}`,
                  }}
                />
              )}
              {paymentsList.map(
                (el) =>
                  disableSumsOnGoods() && (
                    <DashedRow
                      id={`return-price-${'index'}`}
                      rowData={{
                        type: `${el.name}:`,
                        value: `${el.amount}`,
                      }}
                    />
                  )
              )}
              {/* {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Naqt:`,
                    value: `789 900 UZS`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Humo:`,
                    value: `789 900 UZS`,
                  }}
                />
              )} */}
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
            <ChequeBarcode orderNumber={'323232323'} />
            <p>Xaridingiz uchun rahmat</p>
          </Fragment>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperCheck
