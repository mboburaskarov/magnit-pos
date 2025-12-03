import StyledDialog from '@components/Dialogs/StyledeEmptyDialog'
import { RippedPaperItem } from '@components/RippedPaperList'
import { usePaymentShortcuts } from '@hooks/sale/useKeyboardShortcuts' //lite sale own hook
import { usePaymentOperations } from '@hooks/sale/usePaymentOperations' //lite sale own hook
import { usePrintOperations } from '@hooks/sale/usePrintOperations' //sales global hook
import CloseIcon from '@icons/CloseIcon'
import QrScanIcon from '@icons/QrScanIcon'
import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { requests } from '@utils/requests'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { useSaleOperations } from '@/hooks/sale/useSaleOperations'
import { PaymentInputField } from '../components/PaymentInputField'
import { PaymentSummaryBox } from '../components/PaymentSummaryBox'
import PreventRefresh from '../components/PreventRefresh'
import PreventRefreshDialog from '../components/PreventRefreshDialog'
import SaleProgressSteps from '../saleStepLoading'
import { LoadingButton } from '@mui/lab'

function LiteOrder({
  serviceType,
  cartItemsList,
  setDmedOrganizedList,
  markingsList,
  childRef,
  setDmedPrescriptionsList,
  setCustomerId,
  setMarkingList,
  setHasChange,
  liteOrder,
  dmedOrganizedList,
  setMaxAmount,
  cashBoxDetails,
  setLiteOrder,
  customerId,
  dmedPrescriptionsList,
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { setValue, errors, control, watch } = useFormContext()

  const scannedBarcodeRef = useRef()
  const inputRefs = useRef([])
  useEffect(() => {
    inputRefs.current[0].value = ''
    inputRefs.current[1].value = ''
    inputRefs.current[2].value = ''
  }, [cartItemsList])
  const [openCartType, setOpenCartType] = useState(false)
  const [isOpenScanDialog, setOpenScanDialog] = useState(false)
  const [isOpenRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [newSaleId, setNewSaleId] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState({ qr: 'pending', fiscal: 'pending' })

  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())

  // Custom hooks for operations
  const { paymentsList, setPaymentsList, paymentAmount, onlinePaymentType, setOnlinePaymentType, cardPaymentType, setCardPaymentType, maxAmount } =
    usePaymentOperations(cartItemsList, paymentTypesList, setMaxAmount)

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
      paymentsList,
      maxAmount,
    })

  usePaymentShortcuts({
    inputRefs,
    setValue,
    setOnlinePaymentType,
    setCardPaymentType,
    remainingAmount: maxAmount,
  })

  const { printContainer, printContainerEmpty, handlePrint } = usePrintOperations({
    childRef,
    newSaleId,
    setNewSaleId,
    setHasChange,
    setQrcodeUrl,
    setPaymentsList,
    defaultPaymentTypes: [],
    setMarkingList,
    sendToEpos: localStorage.getItem('send_to_epos'),
  })

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 3)
  }, [])

  // Handle lite order submission
  useEffect(() => {
    if (paymentAmount <= 0) {
      setLiteOrder(false)
      return
    }
    if (liteOrder) {
      if (paymentsList.find((el) => el.type === 'app')?.amount > 0) {
        setOpenScanDialog(true)
        setLiteOrder(false)
      } else if (paymentsList.find((el) => el.type === 'card')?.amount > 0) {
        setOpenCartType(true)
      } else {
        onSubmit()
        setLiteOrder(false)
      }
    }
  }, [liteOrder])

  // Handle print when QR code is ready
  useEffect(() => {
    if (newSaleId && qrcodeUrl.qr !== 'pending') {
      handlePrint()
    }
  }, [newSaleId, qrcodeUrl])

  // Focus on scan dialog input
  useEffect(() => {
    if (isOpenScanDialog) {
      setTimeout(() => {
        scannedBarcodeRef.current?.focus()
      }, 100)
    }
  }, [isOpenScanDialog])

  const onSubmit = async ({ otp: otpData, cardType }) => {
    setOpenScanDialog(false)
    setOpenCartType(false)
    setLiteOrder(false)
    submitSale(paymentsList, otpData, maxAmount, cardType)
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        '& .MuiFormControl-root': {
          borderRadius: '16px',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '20px',
          border: '2px solid transparent',
          height: '48px !important',
        },
      }}
    >
      <PreventRefresh
        isDirty={isFinishSaleWithoutAppPaymentType || isSendToEPOS || isSendEPOSresponseToBackend}
        setShowModal={() => setOpenRefreshDialog(true)}
      />

      <SaleProgressSteps
        isFinishSaleWithoutAppPaymentType={isFinishSaleWithoutAppPaymentType}
        isSendToEPOS={isSendToEPOS}
        isSendEPOSresponseToBackend={isSendEPOSresponseToBackend}
        isSaleResponseError={isSaleResponseError}
        isEposError={isEposError}
        isSaleError={isSaleError}
      />

      {/* Payment Input Fields */}
      <Box sx={{ width: '100%', minWidth: '320px' }}>
        <PaymentInputField
          name='lite_cash_amount'
          placeholder={t('cash')}
          control={control}
          errors={errors}
          inputRef={(el) => (inputRefs.current[0] = el)}
          shortcut='N'
          setValue={setValue}
          setPaymentsList={setPaymentsList}
          paymentsLis={paymentsList}
        />

        <PaymentInputField
          name='lite_card_amount'
          placeholder={t('card')}
          control={control}
          errors={errors}
          inputRef={(el) => (inputRefs.current[1] = el)}
          paymentType={cardPaymentType}
          setPaymentType={setCardPaymentType}
          paymentOptions={['Uzcard', 'Humo']}
          setPaymentsList={setPaymentsList}
          setValue={setValue}
          paymentsLis={paymentsList}
        />
        <PaymentInputField
          name='lite_online_amount'
          placeholder={t('online_pay')}
          control={control}
          errors={errors}
          inputRef={(el) => (inputRefs.current[2] = el)}
          paymentType={onlinePaymentType}
          setPaymentType={setOnlinePaymentType}
          paymentOptions={['Payme', 'Click']}
          setValue={setValue}
          setPaymentsList={setPaymentsList}
          paymentsLis={paymentsList}
        />
        <PaymentInputField
          setPaymentsList={setPaymentsList}
          name='lite_cash_amount_soon'
          placeholder={t('balance')}
          readOnly
          shortcut='L'
          soon
          paymentsLis={paymentsList}
        />
      </Box>

      {/* Payment Summary */}
      <PaymentSummaryBox cartItemsList={cartItemsList} maxAmount={maxAmount} />

      {/* Hidden print containers */}
      <Box sx={{ display: 'none' }}>
        <Box ref={printContainer} style={{ padding: '20px' }}>
          <RippedPaperItem
            qrcodeUrl={qrcodeUrl}
            markingsList={markingsList}
            paymentsList={paymentsList}
            cartItemsList={cartItemsList}
            mode='lite'
            cashBoxDetails={cashBoxDetails}
            customerId={customerId}
            noFormControl
          />
        </Box>
        <Box ref={printContainerEmpty} style={{ padding: '20px' }}>
          <RippedPaperItem
            qrcodeUrl='pending'
            markingsList={markingsList}
            paymentsList={paymentsList}
            cartItemsList={cartItemsList}
            mode='lite'
            cashBoxDetails={cashBoxDetails}
            customerId={customerId}
            noFormControl
          />
        </Box>
      </Box>
      <StyledDialog
        backbtn={false}
        maxWidth={'300px'}
        onClose={() => setOpenCartType(false)}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpenCartType(false)} />}
        title={
          <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.500'}>
            {t('Karta turi')}
          </Typography>
        }
        open={openCartType}
      >
        <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
          <LoadingButton
            sx={{ minHeight: '48px !important ', display: 'flex', mb: '20px' }}
            variant='contained'
            loading={isSendToEPOS || isSendEPOSresponseToBackend || isFinishSaleWithoutAppPaymentType}
            onClick={() => {
              onSubmit({ cardType: 'personal' })
            }}
          >
            {t('Shaxsiya karta')}
          </LoadingButton>
          <LoadingButton
            sx={{ minHeight: '48px !important ', display: 'flex' }}
            variant='contained'
            loading={isSendToEPOS || isSendEPOSresponseToBackend || isFinishSaleWithoutAppPaymentType}
            onClick={() => {
              onSubmit({ cardType: 'carparative' })
            }}
          >
            {t('Korporativ karta')}
          </LoadingButton>
        </Box>
      </StyledDialog>
      {/* QR Scan Dialog */}
      <StyledDialog
        backbtn={false}
        onClose={() => setOpenScanDialog(false)}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpenScanDialog(false)} />}
        title={
          <Typography fontSize='24px' lineHeight='32px' fontWeight='700' color='bunker.500'>
            {t('scanner')}
          </Typography>
        }
        open={isOpenScanDialog}
      >
        <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <QrScanIcon width='64' />
          <Typography mb='16px' fontSize='24px' lineHeight='32px' fontWeight='600' color='bunker.950'>
            {t('new_order.app.pass_scan')}
          </Typography>
          <TextField
            inputRef={scannedBarcodeRef}
            fullWidth
            name='barcode-click'
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                onSubmit({ otp: e.target.value })
                scannedBarcodeRef.current.value = ''
              }
            }}
            placeholder={t('scanned_code.placeholder')}
          />
          <Box sx={{ display: 'flex', mt: '10px' }}>
            <Typography fontSize='24px' lineHeight='32px' fontWeight='600' color='bunker.500'>
              {t('payment_type')}:
            </Typography>
            <Typography ml='5px' fontSize='24px' lineHeight='32px' fontWeight='600' color='purple.500'>
              {paymentsList.find((el) => el.type === 'app')?.name}
            </Typography>
          </Box>
        </Box>
      </StyledDialog>

      <PreventRefreshDialog isOpenRefreshDialog={isOpenRefreshDialog} setOpenRefreshDialog={setOpenRefreshDialog} />
    </Box>
  )
}

export default LiteOrder
