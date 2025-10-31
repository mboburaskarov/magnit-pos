// OrderDrawer.jsx - Refactored version using shared hooks
import { LoadingButton } from '@mui/lab'
import { Box, Drawer, Grid, Button as MuiButton, Typography, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, size } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSelector } from 'react-redux'

import RemovePaymentIcon from '@icons/CloseIcon'
import CloseIcon from '@icons/CloseIcon'
import QrScanIcon from '@icons/QrScanIcon'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import TextField from '@components/Inputs/TextField'
import StyledDialog from '@components/Dialogs/StyledeEmptyDialog'
import { RippedPaperItem } from '@components/RippedPaperList'

import PaymentMethodInput from './PaymentMethodInput'
import SaleProgressSteps from '@/pages/sales/new-order/saleStepLoading'
import PreventRefresh from '../components/preventRefresh'
import PreventRefreshDialog from '../components/preventRefreshDialog'

// Import shared hooks from OrderLite
import { useSaleOperations } from '@hooks/sale/useSaleOperations'
import { usePrintOperations } from '@hooks/sale/usePrintOperations'
import { useFullOrderPayments } from '@hooks/sale/useFullOrderPayments'
import { useFullOrderHotkeys } from '@hooks/sale/useFullOrderHotkeys'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: 'calc(100% - 64px)',
      padding: 64,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  half: {
    '& .MuiDrawer-paper': {
      width: '768px',
      padding: 64,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    height: '-webkit-fill-available',
  },
  placeholder: {
    height: 110,
    border: `1px dashed ${theme.palette.gray[200]}`,
    borderRadius: 16,
    flex: '0 0 32.3%',
    marginRight: 8,
    marginBottom: 16,
    display: 'block',
  },
  box: {
    flex: '0 0 32.3%',
    borderRadius: 16,
    marginBottom: 16,
    border: `2px solid ${theme.palette.gray[300]}`,
    overflow: 'hidden',
  },
  boxHeader: {
    backgroundColor: theme.palette.gray[100],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    padding: '8px 5px 8px 12px',
    borderBottom: `1px solid ${theme.palette.gray[300]}`,
    '& .MuiButtonBase-root': {
      padding: 0,
      width: '32px !important',
      height: '32px !important',
      '&:hover': {
        backgroundColor: theme.palette.red[10],
        '& .icon-wrapper': {
          backgroundColor: theme.palette.red[10],
          '& svg path': {
            fill: theme.palette.red[700],
          },
        },
      },
    },
  },
  input: {
    height: 56,
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    '& input': {
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: theme.palette.background.default,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '500',
      color: theme.palette.bunker[950],
    },
  },
  boxBody: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    padding: '12px',
    '& > .MuiFormControl-root': {
      height: 34,
    },
  },
}))

const MAX_F_BUTTONS_QUANTITY = 10

export default function OrderDrawer({
  setIsOrderDrower,
  serviceType,
  isOrderDrower,
  sendToEpos,
  dmedOrganizedList,
  setDmedOrganizedList,
  markingsList,
  dmedPrescriptionsList,
  printContainer,
  cartItemsList,
  setDmedPrescriptionsList,
  customerId,
  cashBoxDetails,
  setMarkingList,
  setMarkingCount,
  setCustomerId,
  markingCount,
  half,
  setOpenDebt,
}) {
  const methods = useForm()
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()

  const userData = useSelector((state) => state.user)
  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())

  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)

  const [hasChange, setHasChange] = useState(false)
  const [newSaleId, setNewSaleId] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState({ qr: 'pending', fiscal: 'pending' })
  const [isOpenScanDialog, setOpenScanDialog] = useState(false)
  const [isOpenRefreshDialog, setOpenRefreshDialog] = useState(false)

  const lastPaymentInput = useRef()
  const scannedBarcodeRef = useRef()

  // Use shared hooks
  const { paymentsList, setPaymentsList, maxAmount, paymentAmount, paddedPaymentsList, handleAddPaymentType, removePaymentType, isVisiblePaymentType } =
    useFullOrderPayments({
      cartItemsList,
      paymentTypesList,
      isOrderDrower,
      cashBoxDetails,
      markingsList,
      markingCount,
      setMarkingList,
    })

  const { isFinishSaleWithoutAppPaymentType, isSaleError, isSendToEPOS, isEposError, isSendEPOSresponseToBackend, isSaleResponseError, submitSale } =
    useSaleOperations({
      cartItemsList,
      markingsList,
      dmedOrganizedList,
      dmedPrescriptionsList,
      serviceType,
      cashBoxDetails,
      customerId,
      setNewSaleId,
      setQrcodeUrl,
      setOpenRefreshDialog,
      setHasChange,
      setMarkingList,
      setDmedPrescriptionsList,
      setDmedOrganizedList,
      setCustomerId,
    })

  const { handlePrint } = usePrintOperations({
    childRef: null,
    newSaleId,
    setNewSaleId,
    setHasChange,
    setQrcodeUrl,
    setPaymentsList,
    defaultPaymentTypes: [],
    setMarkingList,
    sendToEpos: localStorage.getItem('send_to_epos'),
    onAfterPrint: () => {
      setIsOrderDrower(false)
    },
  })

  const { findTypeWithName, getPaymentTypeHotKeyLabel } = useFullOrderHotkeys({
    paymentTypesList,
    handleAddPaymentType,
    handleFinish: () => {
      if (paymentsList.find((el) => el.type === 'app')) {
        setOpenScanDialog(true)
      } else {
        onSubmit()
      }
    },
    maxAmount,
  })

  // Handle print when QR code is ready
  useEffect(() => {
    if (newSaleId && qrcodeUrl.qr !== 'pending') {
      handlePrint()
    }
  }, [newSaleId, qrcodeUrl])

  // Focus on last payment input
  useEffect(() => {
    if (!paymentTypesList || !lastPaymentInput?.current) return
    lastPaymentInput.current.focus()
  }, [paymentsList])

  // Focus on scan dialog input
  useEffect(() => {
    if (isOpenScanDialog) {
      setTimeout(() => {
        scannedBarcodeRef.current?.focus()
      }, 100)
    }
  }, [isOpenScanDialog])

  const onSubmit = async (otpData) => {
    setHasChange(true)
    setOpenScanDialog(false)

    const paymentTypes = paddedPaymentsList
      .filter((type) => get(type, 'isPlaceholder', false) === false)
      .map(({ id, ...type }) => ({
        ...(get(type, 'type') === 'cash' ? { return_amount: Math.abs(maxAmount) } : {}),
        amount: get(type, 'amount'),
        payment_type_id: id,
        type: get(type, 'type'),
        ...(otpData ? { otp_data: otpData } : {}),
        app_type: get(type, 'name').toLowerCase(),
      }))

    submitSale(paymentTypes, otpData, maxAmount)
  }

  return (
    <Box hidden>
      <PreventRefresh
        isDirty={isFinishSaleWithoutAppPaymentType || isSendToEPOS || isSendEPOSresponseToBackend}
        setShowModal={() => setOpenRefreshDialog(true)}
      />

      <Box width='calc(100% + 32px)' mx={-2} mt={-4}>
        <Drawer
          open={isOrderDrower}
          onClose={() => setIsOrderDrower(false)}
          anchor='right'
          elevation={1}
          className={`${classes.drawer} ${half ? classes.half : ''}`}
        >
          <FormProvider {...methods}>
            <Box className={classes.wrapper}>
              {/* Left side - Payment section */}
              <Box width='calc(75% - 64px)' padding={'0 40px 0 0'}>
                {/* Total and Remaining Amount */}
                <Box mb={'40px'} display='flex' width={'100%'} justifyContent={'space-between'}>
                  <Box
                    width={'100%'}
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    mr={'24px'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      {t('total')}:
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={'bunker.950'}>
                      {thousandDivider(get(cartItemsList, 'total_amount'), 'сум')}
                    </Typography>
                  </Box>
                  <Box
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    width={'100%'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      {maxAmount < 0 ? t('return') : t('should_pay')}
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={maxAmount === 0 ? 'green.700' : 'red.700'}>
                      {thousandDivider(Math.abs(maxAmount), 'сум')}
                    </Typography>
                  </Box>
                </Box>

                {SALE_STAGE !== 8 && (
                  <>
                    {/* Payment Type Selection */}
                    <Box>
                      <Typography fontSize={16} fontWeight={'600'} lineHeight={'24px'} color={'bunker.700'}>
                        To'lov turi:
                      </Typography>
                      <Grid container display={'flex'}>
                        {get(paymentTypesList, 'data.data', [])
                          .filter((pay) => {
                            if (get(cashBoxDetails, 'data.data.sale_type') === 'RETURN') {
                              return pay?.type === 'cash'
                            }
                            return pay
                          })
                          .map((item) => (
                            <Grid key={item.id} item xs={3} sm={3} lg={3} xl={3} p={'8px'} m={'3'} onClick={() => handleAddPaymentType(item)}>
                              <Box
                                display={'flex'}
                                p={'20px'}
                                sx={{
                                  '& p': {
                                    color: isVisiblePaymentType(item) ? 'bunker.600' : 'bunker.400',
                                  },
                                  cursor: isVisiblePaymentType(item) ? 'pointer' : 'not-allowed',
                                }}
                                height={'80px'}
                                bgcolor={'bg.10'}
                                justifyContent={'space-between'}
                                borderRadius={'24px'}
                              >
                                <Typography fontSize={18} fontWeight={'600'} lineHeight={'40px'}>
                                  {get(item, 'name')}
                                </Typography>
                                <Typography alignItems={'center'} justifyContent={'center'} display={'flex'}>
                                  <Box
                                    sx={{
                                      color: '#bdbdbd',
                                      border: '2px solid #cfcfcf',
                                      height: '34px',
                                      display: 'flex',
                                      padding: '2px',
                                      ml: '5px',
                                      minWidth: '34px',
                                      alignItems: 'center',
                                      borderRadius: '8px',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    {getPaymentTypeHotKeyLabel(get(item, 'name'))}
                                  </Box>
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </Box>

                    {/* Selected Payments Grid */}
                    <Box>
                      <Grid container width={'100%'} display={'flex'}>
                        {paddedPaymentsList?.map((el, index) => (
                          <Grid item sm={3} lg={3} xl={3} xs={3} m={'3'} key={el.id}>
                            {el?.name ? (
                              <Box mr={'16px'} mb={'16px'} id={`payment-box${el.id}`} className={classes.box}>
                                <div className={classes.boxHeader}>
                                  <Typography lineHeight={'24px'} fontSize={'16px'} fontWeight={'600'} color={'bunker.950'}>
                                    {el.name}
                                  </Typography>
                                  <Box display='flex' alignItems='center'>
                                    <MuiButton variant='primary' onClick={() => removePaymentType(el.id)} sx={{ paddingRight: 0, paddingLeft: 1 }}>
                                      <RemovePaymentIcon color={theme.palette.black} />
                                    </MuiButton>
                                  </Box>
                                </div>
                                <div className={classes.boxBody}>
                                  <PaymentMethodInput
                                    id={el.id}
                                    index={el.id}
                                    classes={classes}
                                    isLast={paddedPaymentsList.filter((el) => el.name)?.length - 1 === index}
                                    lastPaymentInput={(el) => (lastPaymentInput.current = el)}
                                    item={el}
                                    isReturnDrawer={true}
                                    removePaymentType={removePaymentType}
                                    cashbackPaymentPercentage={1}
                                    paymentsList={paymentsList}
                                    setPaymentsList={setPaymentsList}
                                    totalPrice={1}
                                    clientInfo={'clientInfo'}
                                    max={maxAmount}
                                    totalAmount={get(cartItemsList, 'total_amount')}
                                    paymentAmount={paymentAmount}
                                    disabled={false}
                                    webkassaOn={true}
                                  />
                                </div>
                              </Box>
                            ) : (
                              <Box mr={'16px'} mb={'16px'} id={`payment-box${el.id}`} className={classes.placeholder} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>

              {/* Right side - Receipt Preview */}
              <Box
                maxWidth='400px'
                sx={{
                  display: 'flex',
                  width: '355px',
                  overflowY: 'scroll',
                  maxHeight: '75vh',
                }}
              >
                <Box mx={-2} mt={'-3px'} style={{ padding: '20px' }} ref={printContainer}>
                  <RippedPaperItem
                    qrcodeUrl={qrcodeUrl}
                    qrcode='pending'
                    markingsList={markingsList}
                    paymentsList={paymentsList}
                    cartItemsList={cartItemsList}
                    id='cheque_of_orders'
                    cashBoxDetails={cashBoxDetails}
                    customerId={customerId}
                    noFormControl
                    printContainer={printContainer}
                  />
                </Box>
              </Box>
            </Box>

            {/* Pay Button */}
            <LoadingButton
              sx={{ minHeight: '48px !important ', display: 'flex' }}
              variant='contained'
              loading={isSendToEPOS || isSendEPOSresponseToBackend || isFinishSaleWithoutAppPaymentType}
              disabled={maxAmount > 0 && SALE_STAGE !== 8}
              onClick={() => {
                if (paymentsList.find((el) => el.type === 'app')) {
                  setOpenScanDialog(true)
                } else {
                  onSubmit()
                }
              }}
            >
              {t('menu.orders.new_order.cart_container.pay')}
              <Box
                sx={{
                  color: '#fff',
                  border: '2px solid #fff',
                  height: '34px',
                  display: 'flex',
                  padding: '2px',
                  ml: '15px',
                  minWidth: '34px',
                  fontSize: '12px',
                  alignItems: 'center',
                  borderRadius: '8px',
                  justifyContent: 'center',
                }}
              >
                F12
              </Box>
            </LoadingButton>
          </FormProvider>

          <SaleProgressSteps
            isFinishSaleWithoutAppPaymentType={isFinishSaleWithoutAppPaymentType}
            isSendToEPOS={isSendToEPOS}
            isSendEPOSresponseToBackend={isSendEPOSresponseToBackend}
            isSaleResponseError={isSaleResponseError}
            isEposError={isEposError}
            isSaleError={isSaleError}
          />
        </Drawer>
      </Box>

      {/* QR Scan Dialog */}
      <StyledDialog
        backbtn={false}
        onClose={() => setOpenScanDialog(false)}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpenScanDialog(false)} />}
        title={
          <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.500'}>
            {t('scanner')}
          </Typography>
        }
        open={isOpenScanDialog}
      >
        <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <QrScanIcon width='64' />
          <Typography mb={'16px'} justifyContent={'center'} textAlign={'center'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'bunker.950'}>
            {t('new_order.app.pass_scan')}
          </Typography>
          <TextField
            required
            inputRef={(el) => (scannedBarcodeRef.current = el)}
            fullWidth
            borderRadius={'40px'}
            setValue={() => {}}
            uncontrolled
            name='barcode-click'
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                onSubmit(e.target.value)
                scannedBarcodeRef.current.value = ''
              }
            }}
            placeholder={t('scanned_code.placeholder')}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', mt: '10px' }}>
            <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'bunker.500'}>
              {t('payment_type')}:
            </Typography>
            <Typography ml={'5px'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'purple.500'}>
              {paymentsList.find((el) => el.type === 'app')?.name}
            </Typography>
          </Box>
        </Box>
      </StyledDialog>

      <PreventRefreshDialog isOpenRefreshDialog={isOpenRefreshDialog} setOpenRefreshDialog={setOpenRefreshDialog} />
    </Box>
  )
}
