import { ChangeCircle } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { useDebounce } from 'use-debounce'
import CheckAccess from '../../../../components/CheckAccess'
import RippedPaperCheckReturn from '../../../../components/ChequePaper/RippedPaperCheckReturn'
import CustomImg from '../../../../components/CustomImg'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import SaleChildItemsBox from './SaleChildItemsBox'
import ChangePaymentType from './changePaymentType'

const useStyles = makeStyles((theme) => ({
  drawer: {
    height: '100vh',
    overflowY: 'auto',
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '88px',
    padding: '16px 20px',
    position: 'absolute',
    backgroundColor: theme.palette.background.default,

    display: 'flex',
    width: '100%',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  rightArrowIcon: {
    backgroundColor: theme.palette.bg[10],
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    '& svg': {
      backgroundColor: theme.palette.bg[10],
    },
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    margin: '0 4px',
  },
}))
function SaleChildDrawer({ open, childRef, setOpen, ids }) {
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const classes = useStyles()
  const navigate = useNavigate()

  const [currentSaleId, setCurrentSaleId] = useState(get(values, 'sale_id', ''))
  const [currentIndex, setcurrentIndex] = useState(0)
  const [qrCodeUrl, setQrcodeUrl] = useState('pending')
  const [debouncedCurrentSaleId] = useDebounce(currentSaleId, 200)
  const printContainer = useRef()
  const printContainerEmpty = useRef()
  const documentName = useRef('Pharma CHEQUE')
  const reactToPrintContentEmpty = useCallback(() => printContainerEmpty.current, [])
  const [openCreateBonusModal, setopenCreateBonusModal] = useState(false)

  const emptyHandlePrint = useReactToPrint({
    content: reactToPrintContentEmpty,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
    },
    onAfterPrint: () => {
      setQrcodeUrl('pending')
    },
  })
  useEffect(() => {
    if (qrCodeUrl != 'pending') {
      emptyHandlePrint()
    } else {
    }
  }, [qrCodeUrl])
  useImperativeHandle(childRef, () => ({
    printChildCheque() {
      getQrCodeWithFiscal({
        token: 'DXJFX32CN1296678504F2',
        method: 'getReceiptInfoByFiscalSign',
        fiscalSign: get(saleDetailsList, 'data.data.fiscal_sign'),
      })
    },
  }))
  const {
    data: saleDetailsList,
    refetch,
    isLoading,
    isFetched: isFetch,
  } = useQuery(['saleDetailsList', debouncedCurrentSaleId], () => requests.getCashBoxDetaildWithSaleId(debouncedCurrentSaleId), {
    enabled: !!debouncedCurrentSaleId,
  })

  useEffect(() => {
    const id = get(open, 'id')
    if (id) setCurrentSaleId(id)
  }, [open])
  useHotkeys(['ArrowRight', 'ArrowLeft'], (key) => {
    if (key.key == 'ArrowRight') {
      // const currentIndex = ids.findIndex(() => currentSaleId)
      if (ids.length - 1 > currentIndex) {
        // 🧹 Clear old data

        // 🔄 Update index and ID
        setcurrentIndex((a) => a + 1)
        setCurrentSaleId(ids[currentIndex + 1])
      }
    }
    if (key.key == 'ArrowLeft') {
      refetch()
      // const currentIndex = ids.findIndex(() => currentSaleId)
      if (currentIndex >= 1) {
        // 🧹 Clear old data

        // 🔄 Update index and ID
        setcurrentIndex((a) => a - 1)
        setCurrentSaleId(ids[currentIndex - 1])
      }
    }
  })
  const theme = useTheme()
  const { mutate: saleMoveToPending, isLoading: isSaleMoveToPending } = useMutation(requests.saleMoveToPending, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
    },
    onError: (err) => {
      console.log(err)
      error('Ошибка: Продажа переведена в режим ожидания!')
    },
  })
  const { mutate: getQrCodeWithFiscal, isLoading: isgetQrCodeWithFiscal } = useMutation(requests.closeZReport, {
    onSuccess: ({ data }) => {
      if (!get(data, 'error', true)) {
        setQrcodeUrl(get(data, 'message.qrCodeURL', 'pending'))
      } else {
        saleMoveToPending(get(open, 'id'))
        error(`FISCAL: ${data?.message}`)
      }
    },
    onError: (err) => {
      console.log('err', err)
    },
  })
  function maskNumber(num) {
    if (num.length == 0) return '*****'
    const str = String(num)
    const visible = str.slice(-4) // last 4 digits
    const hidden = '*'?.repeat(str?.length - 4) // mask the rest
    return hidden + visible
  }
  return (
    <LoadingContainer noHeight readyState={debouncedCurrentSaleId || !isLoading}>
      <Box className={classes.drawer}>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Box display={'flex'} alignItems={'center'}>
            <Box ml={'16px'}>
              <Typography fontSize={24} lineHeight={'32px'} fontWeight={700}>
                #{get(saleDetailsList, 'data.data.sale_number')}
              </Typography>
              <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
                {thousandDivider(get(saleDetailsList, 'data.data.total_amount'), 'сум')}
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            color={theme.palette.black}
            onClick={() => {
              setOpen(false), setOpen(false)
            }}
          />
        </Box>

        <Box padding={'104px 10px 0'} paddingX={'20px'}>
          <Box alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('cart')}
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                {t('vendor')}:
              </Typography>
              <CustomImg className={classes.usrImg} src='/default-user-img.png' />
              <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
                {get(saleDetailsList, 'data.data.employee.first_name')}
              </Typography>
            </Box>
          </Box>
          <Box padding={'16px 0'}>
            {get(saleDetailsList, 'data.data.products', [])?.map((el, index) => (
              <SaleChildItemsBox key={index} item={el} />
            ))}
          </Box>
          <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('pay')}
            </Typography>
            <Grid container display={'flex'}>
              {get(saleDetailsList, 'data.data.sale_payments', [])?.map((pays) => (
                <Grid item xl={6} xs={6} sm={6} md={6} lg={6} width={'100%'} padding={'4px'}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minWidth: '180px',
                      borderRadius: '16px',
                      padding: '12px 16px',
                    }}
                    bgcolor={'bg.10'}
                  >
                    <Box>
                      <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                        {get(pays, 'payment_type.name')}
                      </Typography>
                      <Typography fontSize={16} mt={'4px'} flexShrink={'none'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                        {thousandDivider(get(pays, 'amount'), 'сум')}
                      </Typography>
                    </Box>
                    <CheckAccess id={'can-chnage-payment-type'}>
                      <Box
                        onClick={() => {
                          setopenCreateBonusModal({ types: get(saleDetailsList, 'data.data.sale_payments', []), sale_payment_id: pays.id })
                        }}
                      >
                        <ChangeCircle sx={{ color: '#fff', fontSize: '30px', mt: '10px' }} />
                      </Box>
                    </CheckAccess>
                  </Box>
                </Grid>
              ))}
              {get(saleDetailsList, 'data.data.total_discount', 0) > 0 && (
                <Grid item xl={6} xs={6} sm={6} md={6} lg={6} width={'100%'} padding={'4px'}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minWidth: '180px',
                      borderRadius: '16px',
                      padding: '12px 16px',
                    }}
                    bgcolor={'bg.10'}
                  >
                    <Box>
                      <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                        Сумма скидки {maskNumber(get(saleDetailsList, 'data.data.discount_barcode'))}
                      </Typography>
                      <Typography fontSize={16} mt={'4px'} flexShrink={'none'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                        {thousandDivider(get(saleDetailsList, 'data.data.total_discount'), 'сум')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
          <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('features')}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Дата создания
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {dayjs(get(saleDetailsList, 'data.data.completed_at')).format('DD.MM.YYYY | HH:mm:ss')}
                </Typography>
              </Box>
              <Box width={'100%'} bgcolor={'bg.10'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  {t('store')}
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  Pharma Cosmos
                </Typography>
              </Box>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'50%'} mt={'16px'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Клиент
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {get(saleDetailsList, 'data.data.customer.first_name', 'Unknown')} {get(saleDetailsList, 'data.data.customer.last_name', '')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ChangePaymentType refetch={refetch} open={openCreateBonusModal} setOpen={setopenCreateBonusModal} />

      <Box
        maxWidth='400px'
        sx={{
          display: 'none',
          width: '355px',
          overflowY: 'scroll',
          maxHeight: '75vh',
        }}
      >
        <Box
          mx={-2}
          mt={'-3px'}
          style={{
            padding: '20px',
          }}
          ref={printContainerEmpty}
        >
          <RippedPaperCheckReturn
            qrCodeUrl={qrCodeUrl}
            saleDetailsList={get(saleDetailsList, 'data.data')}
            id='cheque_of_orders'
            mode='lite'
            noFormControl
            printContainer={printContainerEmpty}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default SaleChildDrawer
