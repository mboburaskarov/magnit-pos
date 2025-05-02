import { Box, Typography } from '@mui/material'
import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import DashedRow from './DashedRow.jsx'
import useStyles from './useStyles'

import dayjs from 'dayjs'
import { get } from 'lodash'

function RippedPaperZReportCheck({ margin, zrepo, cashBoxDetails, customerId, chequeData: cheque, noSticky, orderItems }) {
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
          {/* <div className={classes.border} /> */}
          <Fragment key={'index69'}>
            <Box minWidth={'250px'} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <p style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', textAlign: 'center', marginTop: '10px' }}>"PHARMA COSMOS" MChJ</p>
              <p style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', textAlign: 'center', marginTop: '10px' }}>
                {get(userData, 'store.address')}
              </p>
            </Box>
          </Fragment>
          <Fragment key={'index'}>
            <Box className={classes.content}>
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index2'}`}
                  rowData={{
                    type: `ИД ТЕРМИНАЛА:`,
                    value: `#${get(zrepo, 'terminalID')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index3'}`}
                  rowData={{
                    type: `ВРЕМЯ ОТКРЫТИЯ:`,
                    value: `${get(zrepo, 'openTime')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index4'}`}
                  rowData={{
                    type: `ВРЕМЯ ЗАКРЫТИЯ:`,
                    value: `${get(zrepo, 'closeTime')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index5'}`}
                  rowData={{
                    type: `НОМЕР:`,
                    value: `+${get(zrepo, 'number', '-')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index6'}`}
                  rowData={{
                    type: `КОЛ-ВО:`,
                    value: `${get(zrepo, 'count')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index7'}`}
                  rowData={{
                    type: `ИТОГО ЧЕКОВ:`,
                    value: `${get(zrepo, 'totalSaleCount')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index8'}`}
                  rowData={{
                    type: `ИТОГО КАРТЫ:`,
                    value: `${get(zrepo, 'totalSaleCard') / 100}.00`,
                  }}
                />
              )}

              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index9'}`}
                  rowData={{
                    type: `ИТОГО НАЛИЧНЫЕ:`,
                    value: `${get(zrepo, 'totalSaleCash', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index10'}`}
                  rowData={{
                    type: `ИТОГО НДС:`,
                    value: `${get(zrepo, 'totalSaleVAT', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index11'}`}
                  rowData={{
                    type: `ИТОГО ВОЗВРАТОВ:`,
                    value: `${get(zrepo, 'totalRefundCount', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index12'}`}
                  rowData={{
                    type: `ИТОГО ВОЗВРАТА НАЛИЧНЫЕ:`,
                    value: `${get(zrepo, 'totalRefundCash', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index13'}`}
                  rowData={{
                    type: `ИТОГО ВОЗВРАТА КАРТЫ:`,
                    value: `${get(zrepo, 'totalRefundCard', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index14'}`}
                  rowData={{
                    type: `ИТОГО ВОЗВРАТА НДС:`,
                    value: `${get(zrepo, 'totalRefundVAT', '-') / 100}.00`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index15'}`}
                  rowData={{
                    type: `LastReceiptsed:`,
                    value: `${get(zrepo, 'lastReceiptSeq', '-')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index16'}`}
                  rowData={{
                    type: `FirstReceiptSeq:`,
                    value: `${get(zrepo, 'firstReceiptSeq', '-')}`,
                  }}
                />
              )}
              {disableSumsOnGoods() && (
                <DashedRow
                  id={`return-price-${'index17'}`}
                  rowData={{
                    type: `AppletVersion:`,
                    value: `${get(zrepo, 'appletVersion', '-')}`,
                  }}
                />
              )}
            </Box>
            {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
          </Fragment>

          <Fragment key={'index39'}>
            <Box minWidth={'250px'} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <Typography mb={'10px'} textAlign={'center'} mt={'10px'}>
                Отчет о закрытии смены время на компьютере
              </Typography>
              <Typography mb={'10px'} textAlign={'center'} mt={'10px'}>
                {dayjs().format('DD.MM.YYYY HH:mm:ss')}
              </Typography>
            </Box>
          </Fragment>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperZReportCheck
