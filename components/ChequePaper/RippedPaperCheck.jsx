import { Box, Typography } from '@mui/material'
import { Fragment } from 'react'

import { QRCodeCanvas } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import DashedRow from './DashedRow.jsx'
import useStyles from './useStyles'

import dayjs from 'dayjs'
import { get } from 'lodash'
import palette from '../../src/assets/theme/mui.config'
import thousandDivider from '@utils/thousandDivider.js'
const FiskalText = ({ data }) => {
  return <Typography>Fiskal belgi: {data}</Typography>
}
const FiskalNumber = ({ data }) => {
  return <Typography>Fiskal raqami: {data}</Typography>
}
function RippedPaperCheck({
  data,
  margin,
  qrcodeUrl,
  cashBoxDetails,
  mode,
  customerId,
  checked,
  paymentsList,
  cartItemsList,
  chequeData: cheque,
  logo = '',

  noSticky,
  markingsList,
  orderItems,
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)
  console.log('cheque', cashBoxDetails,userData,cartItemsList,orderItems)

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
      <Box className={classes.inner}>
        <Box px={'10px'} py={4}>
          <Fragment key={'index0'}>
            <div className={classes.canvasContainer}>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: palette.black,
                  textAlign: 'center',
                }}
              >
                {get(userData, 'company.legal_name','"PHARMA COSMOS" MCHJ')}
                
              </p>
            </div>

            <Box sx={{ textAlign: 'center' }}>{qrcodeUrl == false && 'Не товарный чек'}</Box>
            <div className={classes.border} />
            <p
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: palette.black,
                textAlign: 'center',
              }}
            >
              {get(userData, 'company.legal_address')}
            </p>
          </Fragment>
          <div className={classes.border} />
          <Fragment key={'index'}>
            <Box className={classes.content}>
              <DashedRow
                id={`return-price-${'index1'}`}
                rowData={{
                  type: `STIR:`,
                  value: get(userData, 'company.company_inn','303970073'),  
                }}
              />
              {qrcodeUrl != false && disableSumsOnGoods() && (
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
                  id={`return-price-${'index9'}`}
                  rowData={{
                    type: `Kontakt:`,
                    value: get(userData, 'store.phone', '998').length > 3 ? `+${get(userData, 'store.phone', '-')}` : '-',
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
                    value: `08:00 - 23:00`,
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
                  <b style={{ fontSize: '17px' }} className={classes.bold}>
                    {index + 1}. {get(el, 'name')}
                  </b>
                </p>

                <Box mt={'15px'} mb={'10px'} display={'flex'} alignItems={'center'} justifyContent={'end'}>
                  <Typography sx={{ fontSize: '17px !important', fontWeight: '600 !important' }}>
                    {`${get(el, 'quantity') > 0 ? get(el, 'quantity') : ''}${
                      get(el, 'unit_quantity') > 0 ? ` (${get(el, 'unit_quantity')}/${get(el, 'unit_per_pack')})` : ''
                    } X `}
                    {thousandDivider(get(el, 'unit_price'))}
                  </Typography>

                  <Typography
                    sx={{
                      ml: '5px',
                      fontSize: '17px !important',
                      fontWeight: '600 !important',
                    }}
                  >{` = ${thousandDivider(get(el, 'total_price'))} so'm`}</Typography>
                </Box>
                <Box
                  sx={{
                    '& > p': {
                      fontWeight: '600 !important',
                      fontSize: '14px !important',
                    },
                  }}
                >
                  <Typography>O'lchov birligi: {get(el, 'package_name', '-')}</Typography>
                  <Typography>MXIK: {get(el, 'class_code', '-')}</Typography>
                  {get(el, 'is_marking') && (
                    <Box>
                      {Object.values(markingsList[get(el, 'id')] || {})?.length > 0 &&
                        Object.values(markingsList[get(el, 'id')] || {}).map((el) => <Typography>MK: {el.slice(0, 32)}</Typography>)}
                    </Box>
                  )}

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
              {
                (mode = 'lite'
                  ? paymentsList
                      .filter((a) => a.amount > 0)
                      ?.map(
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
                      )
                  : paymentsList?.map(
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
                    ))
              }
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index'}`}
                  rowData={{
                    type: `Karta turi`,
                    value: `${qrcodeUrl.cardType === 'corporative' ? 'Korporativ' : 'Shaxsiy'} karta`,
                  }}
                />
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
              <Box
                sx={{
                  '& > p': {
                    fontWeight: '800 !important',
                    fontSize: '14px !important',
                  },
                }}
              >
                <Typography>
                  Chek turi: {qrcodeUrl?.qr == 'pending' ? '' : get(cashBoxDetails, 'data.data.sale_type') == 'SALE' ? 'Sotuv' : 'Qaytarish'}
                </Typography>
                {qrcodeUrl?.qr !== 'pending' && <FiskalText data={qrcodeUrl.fiscal} />}
                {qrcodeUrl?.qr !== 'pending' && <FiskalNumber data={qrcodeUrl?.terminalId} />}
              </Box>
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
            <Box minWidth={'250px'} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              {qrcodeUrl?.qr == 'pending' ? (
                <>
                  <QRCodeCanvas size={200} value={'https://pharma-cosmos.uz'} />

                  <Typography fontWeight={'800'} textAlign={'center'} fontSize={'14px'} mt={'10px'}>
                    SOTILGAN TOVAR ALMASHTIRILMAYDI VA QAYTARIB OLINMAYDI
                  </Typography>
                  <Typography fontWeight={'800'} fontSize={'14px'} mt={'10px'}>
                    XARIDINGIZ UCHUN RAHMAT!!!
                  </Typography>
                </>
              ) : (
                <>
                  <Typography fontWeight={'800'} mb={'10px'} textAlign={'center'} mt={'10px'}>
                    Siz xaridning 1% miqdorida "Keshbek" olish huquqiga ega bo'ldingiz
                  </Typography>
                  <QRCodeCanvas size={200} value={qrcodeUrl.qr} />

                  <Typography fontWeight={'800'} textAlign={'center'} fontSize={'14px'} mt={'10px'}>
                    SOTILGAN TOVAR ALMASHTIRILMAYDI VA QAYTARIB OLINMAYDI
                  </Typography>
                  <Typography fontWeight={'800'} fontSize={'14px'} mt={'10px'}>
                    XARIDINGIZ UCHUN RAHMAT!!!
                  </Typography>
                </>
              )}
            </Box>
          </Fragment>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperCheck
