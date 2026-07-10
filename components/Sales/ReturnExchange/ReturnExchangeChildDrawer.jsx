import { Box, Button, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { checkPermission } from '@utils/checkPermission'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import axios from 'axios'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import LeftArrowIcon from '../../../src/assets/icons/LeftArrow'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import { error, success } from '../../../utils/toast'
import CustomImg from '../../CustomImg'
import LoadingContainer from '../../LoadingContainer'
import ReturnExchangeChildItemBox from './ReturnExchangeChildItemBox'
import RippedPaperCheckReturn from '../../ChequePaper/RippedPaperCheckReturn'
import { loadSvgAsEscposHex } from '../../../utils/escposImage'
import { buildReceiptLayout } from '../../../utils/receiptBuilder'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '10px 24px',
    height: '60px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  rightArrowIcon: {
    backgroundColor: theme.palette.bg[10],
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    '& svg': {
      backgroundColor: 'transparent',
    },
  },
  usrImg: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    margin: '0 4px',
  },
}))

function ReturnExchangeItemDrawer({ open, cash_box_operation_id, setChildOpen, setOpen }) {
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const printContainer = useRef()
  const userData = useSelector((state) => state.user)
  const [selectedReturnItems, setSelectedReturnItems] = useState([])
  const [returnedSale, setReturnedSale] = useState(null)
  const [returnedSaleId, setReturnedSaleId] = useState(null)

  const documentName = useRef('Cheque')
  const navigate = useNavigate()
  const { id: sale_id } = useParams()
  const { t } = useTranslation()

  const selectReturnItem = (e, item) => {
    if (e.target.checked) {
      setSelectedReturnItems((p) => [
        ...p,
        { quantity: item?.quantity, id: item?.store_product_id, unit_quantity: item?.unit_quantity, store_product_id: item?.store_product_id },
      ])
    } else {
      setSelectedReturnItems((p) => p.filter((i) => i?.store_product_id != item?.store_product_id))
    }
  }

  const selectAllReturnItem = (e) => {
    if (e.target.checked) {
      const items = get(darftChildList, 'data.data.products', [])
      setSelectedReturnItems([])
      items.map((item) => {
        setSelectedReturnItems((p) => [
          ...p,
          { id: item?.store_product_id, quantity: item?.quantity, unit_quantity: item?.unit_quantity, store_product_id: item?.store_product_id },
        ])
      })
    } else {
      setSelectedReturnItems([])
    }
  }

  const isAllChecked = () => {
    const itemsLength = get(darftChildList, 'data.data.products', [])?.length
    return itemsLength === selectedReturnItems.length
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {
      if (returnedSale?.isDuplicatePrint) {
        setReturnedSale(null)
        return
      }
      setChildOpen(false)
      setOpen(false)
      if (returnedSaleId) {
        navigate(`/sales/pos/${returnedSaleId}`)
        window.location.reload()
      }
    },
    onPrintError: (err) => {
      error('Ошибка при печати чека: ' + err)
      if (returnedSale?.isDuplicatePrint) {
        setReturnedSale(null)
        return
      }
      setChildOpen(false)
      setOpen(false)
      if (returnedSaleId) {
        navigate(`/sales/pos/${returnedSaleId}`)
        window.location.reload()
      }
    }
  })

  useEffect(() => {
    if (returnedSale) {
      setTimeout(() => {
        handlePrint()
      }, 300)
    }
  }, [returnedSale])

  const classes = useStyles()

  const { mutate: returnSaleItem, isLoading: isreturnSaleItem } = useMutation(requests.returnSaleItem, {
    onSuccess: ({ data }) => {
      const resData = get(data, 'data')
      setReturnedSale(resData)
      setReturnedSaleId(resData?.id)
      success('Возврат успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании возврата!')
      console.error('err', err)
    },
  })

  const {
    data: darftChildList,
    refetch,
    isLoading: cashBoxDetaildWithSaleIdLoading,
  } = useQuery('cashBoxDetaildWithSaleId', () => requests.getCashBoxDetaildWithSaleId(get(open, 'item.id')))

  useEffect(() => {
    refetch()
  }, [open])

  const handleDuplicatePrint = async () => {
    const saleData = get(darftChildList, 'data.data')
    if (!saleData) return

    try {
      let logoHex = null
      try {
        logoHex = await loadSvgAsEscposHex('/MagnitLogoPremiumCheque.svg', 400, 576)
      } catch (e) {
        console.warn('Duplicate logo loading failed:', e)
      }

      const cashierNameStr = `${saleData.employee?.first_name || ''} ${saleData.employee?.last_name || ''}`.trim() || 'Кассир'
      const paymentType = saleData.sale_payments?.[0]?.payment_type?.name?.toLowerCase() || 'cash'

      const payloadData = {
        saleId: String(saleData.sale_number || ''),
        cashier: cashierNameStr,
        paymentType: paymentType,
        date: saleData.completed_at || new Date().toISOString(),
        items: (saleData.products || []).map((item) => ({
          name: item.name || 'Товар',
          mxik: item.class_code || item.code || '',
          qty: item.quantity || 1,
          price: Number(item.unit_price || 0),
          total: Number(item.total_price || 0),
          vatPercent: item.vat_percent || 12,
          vatAmount: item.vat || 0,
        })),
        discount: Number(saleData.discount_amount || 0),
        totalAmount: Number(saleData.total_amount || 0),
        paidAmount: Number(saleData.total_amount || 0),
        changeAmount: 0,
        vatAmount: Number(saleData.vat_sum || 0),
        chequeType: 'sale',
        fiscalSign: saleData.fiscal_sign || '',
        fiscalNumber: saleData.terminal_id || '',
        fiscalDate: saleData.completed_at || '',
        qrData: saleData.fiscal_sign || '',
        customer: saleData.customer_name || '',
        isDuplicate: true,
      }

      const layoutLines = buildReceiptLayout(payloadData, {
        logoHex,
        name: get(userData, 'store.name'),
        address: get(userData, 'store.address'),
      })
      const reqPayload = {
        lines: layoutLines,
        paymentType: paymentType,
      }

      const res = await axios.post('http://localhost:7788/print/raw-template', reqPayload)
      if (res.data && res.data.ok) {
        success(t('pos.printer.receipt_printed') || 'Чек напечатан!')
        return
      }
    } catch (err) {
      console.warn('ESC/POS printing failed, falling back to browser print:', err)
    }

    setReturnedSale({ ...saleData, isDuplicatePrint: true })
  }

  useEffect(() => {
    if (open?.autoPrintDuplicate && darftChildList?.data?.data && !cashBoxDetaildWithSaleIdLoading) {
      handleDuplicatePrint()
      open.autoPrintDuplicate = false
    }
  }, [darftChildList, cashBoxDetaildWithSaleIdLoading])

  const theme = useTheme()
  const employeeFirstName = get(darftChildList, 'data.data.employee.first_name')
  const customerName = get(darftChildList, 'data.data.customer_name')
  const hasValidCustomer = customerName && customerName.toLowerCase() !== 'unknown'

  return (
    <LoadingContainer readyState={!cashBoxDetaildWithSaleIdLoading}>
      <Box className={classes.drawer}>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Box display={'flex'} alignItems={'center'}>
            <Box onClick={() => setChildOpen(false)} className={classes.rightArrowIcon}>
              <LeftArrowIcon />
            </Box>
            <Box ml={'16px'}>
              <Typography fontSize={16} lineHeight={'22px'} fontWeight={700}>
                Продажа #{get(darftChildList, 'data.data.sale_number')}
              </Typography>
              <Typography fontSize={14} lineHeight={'20px'} color={'orange.500'} fontWeight={600}>
                {thousandDivider(get(darftChildList, 'data.data.total_amount', 0), 'сум')}
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            color={theme.palette.black}
            onClick={() => {
              setOpen(false)
              setChildOpen(false)
            }}
          />
        </Box>

        <Box padding={'0'}>
          <Box p={'12px 24px'} alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
              {t('cart')}
            </Typography>
            {employeeFirstName && (
              <Box display={'flex'} alignItems={'center'}>
                <Typography fontSize={13} lineHeight={'18px'} fontWeight={500} color={'bunker.500'}>
                  {t('vendor')}:
                </Typography>
                <CustomImg className={classes.usrImg} src='default-user-img.png' />
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={600}>
                  {employeeFirstName}
                </Typography>
              </Box>
            )}
          </Box>
          <Box maxHeight={'calc(100vh - 420px)'} sx={{ overflowY: 'auto' }} padding={'0px 24px'}>
            {!get(open, 'item.is_returned') && (
              <Box mb={'8px'} borderRadius={'8px'} p={'8px 16px'} bgcolor={'bg.10'} mr={'0px'} display={'flex'} height={'40px'} alignItems={'center'}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                  }}
                >
                  <input onChange={(e) => selectAllReturnItem(e)} name='checkbox_zero' checked={isAllChecked()} className='customCheckbox' type='checkbox' />
                </Box>
                <Typography fontSize={'14px'} fontWeight={600}>Выбрать все</Typography>
              </Box>
            )}
            {get(darftChildList, 'data.data.products', []).map((el) => (
              <ReturnExchangeChildItemBox selectedReturnItems={selectedReturnItems} open={open} selectReturnItem={selectReturnItem} key={el.id} item={el} />
            ))}
          </Box>
          <Box p={'16px 24px'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'12px'} fontSize={16} lineHeight={'24px'} fontWeight={600}>
              {t('features')}
            </Typography>
            <Box display={'grid'} gridTemplateColumns={'repeat(2, 1fr)'} gap={'8px'}>
              <Box bgcolor={'bg.10'} borderRadius={'8px'} padding={'8px 12px'}>
                <Typography fontSize={11} fontWeight={500} color={'bunker.500'}>
                  Дата создания
                </Typography>
                <Typography fontSize={13} mt={'2px'} color={'bunker.950'} fontWeight={600}>
                  {dayjs(get(darftChildList, 'data.data.completed_at')).format('DD.MM.YYYY HH:mm:ss')}
                </Typography>
              </Box>
              <Box bgcolor={'bg.10'} borderRadius={'8px'} padding={'8px 12px'}>
                <Typography fontSize={11} fontWeight={500} color={'bunker.500'}>
                  {t('store')}
                </Typography>
                <Typography fontSize={13} mt={'2px'} color={'bunker.950'} fontWeight={600}>
                  MAGNIT
                </Typography>
              </Box>
              {hasValidCustomer && (
                <Box bgcolor={'bg.10'} borderRadius={'8px'} padding={'8px 12px'} gridColumn={'span 2'}>
                  <Typography fontSize={11} fontWeight={500} color={'bunker.500'}>
                    Клиент
                  </Typography>
                  <Typography fontSize={13} mt={'2px'} color={'bunker.950'} fontWeight={600}>
                    {customerName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {get(open, 'item.is_returned') && (
            <Typography
              sx={{
                color: 'white',
                bgcolor: 'red.600',
                borderRadius: '8px',
                padding: '12px',
                m: '10px 24px',
                fontSize: '13px',
                lineHeight: '18px',
              }}
            >
              Поскольку вы перешли в статус возврата, вы больше не можете выполнять какие-либо операции с этой продажей.
            </Typography>
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: '24px',
              right: '24px',
              display: 'flex',
              gap: '12px',
              width: 'calc(100% - 48px)',
              '& .MuiButtonBase-root': {
                height: 40,
              },
            }}
          >
            <Button
              onClick={handleDuplicatePrint}
              fullWidth
              sx={{
                height: '40px !important',
                border: '2px solid #cbd5e1 !important',
                bgcolor: '#ffffff !important',
                color: '#1e293b !important',
                textTransform: 'none !important',
                borderRadius: '8px !important',
                fontWeight: '600 !important',
                fontSize: '14px !important',
                boxShadow: 'none !important',
                '&:hover': {
                  bgcolor: '#f1f5f9 !important',
                  borderColor: '#94a3b8 !important',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              Повторный чек
            </Button>

            {!get(open, 'item.is_returned') && (
              <Button
                onClick={() =>
                  returnSaleItem({
                    cash_box_operation_id,
                    sale_id: get(open, 'item.id'),
                    sale_items: selectedReturnItems.map(({ id, ...others }) => ({ ...others })),
                  })
                }
                fullWidth
                disabled={selectedReturnItems?.length == 0}
                variant='contained'
                type='submit'
                sx={{
                  textTransform: 'none',
                }}
              >
                <Typography fontSize={14} color={'white'} fontWeight={600}>
                  Возврат
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
        {/* Hidden print container */}
        <div style={{ display: 'none' }}>
          <div ref={printContainer}>
            {returnedSale && (
              <RippedPaperCheckReturn
                saleDetailsList={returnedSale}
                qrCodeUrl={returnedSale.fiscal_sign || 'https://-cosmos.uz'}
                customerId={returnedSale.customer}
                noSticky
                isDuplicate={Boolean(returnedSale.isDuplicatePrint)}
              />
            )}
          </div>
        </div>
      </Box>
    </LoadingContainer>
  )
}

export default ReturnExchangeItemDrawer
