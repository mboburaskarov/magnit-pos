import ButtonWithPopup from '@components/Buttons/ButtonWithPopup'
import CheckAccess from '@components/CheckAccess'
import * as qs from 'qs'
import RippedPaperProductPriceCheck from '@components/ChequePaper/RippedPaperProductPriceCheck'
import CustomImg from '@components/CustomImg'
import DrawerInfoBox from '@components/Drawers/DrawerInfoBox'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import SectionTitle from '@components/SectionTitle'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryParams } from '@hooks/useQueryParams'
import DefaultImgIcon from '@icons/defaultImgIcon'
import CloseIcon from '@icons/CloseIcon'
import { Box, Button, Drawer, Typography, IconButton } from '@mui/material'
import getImageUrl from '@utils/getImageUrl'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import ProductHistory from './ProductHistory'
import ProductMovementDashboard from './ProductMovementDashboard'
import ProductRemainsHistory from './ProductRemainsHistory'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { useHotkeys } from 'react-hotkeys-hook'

const Image = ({ data, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        border: '1px solid #ECEDF2',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        '& svg': {
          width: '40px',
          height: '40px',
          color: '#A0A5BA',
        },
      }}
    >
      {data?.photos?.[0] ? (
        <CustomImg
          onClick={() => setImages({ data: data?.photos })}
          src={getImageUrl(data?.photos?.[0])}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <DefaultImgIcon />
      )}
      {data?.files?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => setImages({ data: data?.files })}
        />
      )}
    </Box>
  )
}

export default function ProductDrawer({
  open: id,
  onClose,
  ids,
  setImages,
  setOpenConfirmDialog,
  setRejectComment,
  currentIndex,
  currentSaleId,
  setCurrentIndex,
  setCurrentSaleId,
}) {
  const userData = useSelector((state) => state.user)
  const [unitPerPack, setUnitPerPack] = useState(1)
  const { values } = useQueryParams()

  const drawerFilter = useMemo(() => {
    return {
      id: currentSaleId,
      store_id: values?.store_id || userData?.store?.id,
    }
  }, [values?.from_time, currentSaleId, values?.to_time, values?.store_id, id, values?.start_date, values?.end_date])

  const {
    data: productData,
    isLoading: productDataLoading,
    isFetching: isFetchingproductData,
  } = useQuery(['productData', drawerFilter], () => requests.getSingleProduct(drawerFilter), {
    enabled: !!currentSaleId,
  })
  const {
    data: productReaminsDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductReaminsDataHistory,
    refetch,
  } = useQuery(['productReaminsDataHistory', drawerFilter], () => requests.getSingleProductRemainsHistory(drawerFilter), {
    enabled: !!currentSaleId,
  })

  const {
    data: singleProductDashboard,
    isLoading: singleProductDashboardLoading,
    isFetching: isFetchingsingleProductDashboard,
  } = useQuery(
    ['singleProductDashboard', { ...drawerFilter, start_date: getFilterStartDate(values, true), end_date: getFilterEndDate(values) }],
    () => requests.getSingleProductDashboard({ ...drawerFilter, start_date: getFilterStartDate(values, true), end_date: getFilterEndDate(values) }),
    {
      enabled: !!currentSaleId,
    },
  )

  useEffect(() => {
    if (!productData || productDataLoading || id == null) return
    setUnitPerPack(get(productData, 'data.data.unit_per_pack'))
  }, [productData])

  const printContainer = useRef()
  const documentName = useRef('Pharma CHEQUE')
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {},
  })
  const printUnitContainer = useRef()

  const reactToPrintUnitContent = useCallback(() => printUnitContainer.current, [])
  const handleUnitPrint = useReactToPrint({
    content: reactToPrintUnitContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {},
  })

  function getRetailPriceRange(productReaminsDataHistory) {
    const data = get(productReaminsDataHistory, 'data.data.data', [])

    if (!Array.isArray(data) || data.length === 0) {
      return { min: null, max: null }
    }

    const prices = data.map((item) => Number(item?.retail_price)).filter((price) => !isNaN(price))

    if (prices.length === 0) return { min: null, max: null }

    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return { min, max }
  }

  useEffect(() => {
    if (id && typeof setCurrentSaleId === 'function') setCurrentSaleId(id)
    if (currentIndex && typeof setCurrentIndex === 'function') setCurrentIndex(currentIndex)
  }, [id, setCurrentSaleId, currentIndex, setCurrentIndex])
  useHotkeys(['ArrowRight', 'ArrowLeft'], (key) => {
    if (!ids || typeof setCurrentIndex !== 'function' || typeof setCurrentSaleId !== 'function') return
    if (key.key == 'ArrowRight') {
      if (ids.length - 1 >= currentIndex) {
        setCurrentIndex((a) => a + 1)
        setCurrentSaleId(ids[currentIndex])
      }
    }
    if (currentIndex == 1) return
    if (key.key == 'ArrowLeft') {
      if (currentIndex >= 1) {
        setCurrentIndex((a) => a - 1)
        setCurrentSaleId(ids[currentIndex - 2])
      }
    }
  })

  const navigate = useNavigate()

  const handleClose = () => {
    onClose(false)
    const newParams = { ...values }
    delete newParams.start_date
    delete newParams.end_date
    delete newParams.from_time
    delete newParams.to_time
    const dateParams = qs.stringify(newParams, { addQueryPrefix: true })
    navigate(`${location.pathname}${dateParams}`)
  }

  return (
    <Drawer
      anchor='right'
      sx={{
        '& .MuiDrawer-paper': {
          width: '1000px',
          // borderRadius: '24px 0 0 24px',
          backgroundColor: '#FFF',
        },
      }}
      onClose={handleClose}
      open={!!id}
      isLoading={productDataLoading && isFetchingproductData}
    >
      {/* Header Container */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          pt: '32px',
          pb: '24px',
          px: '40px',
          backgroundColor: '#FFF',
          borderBottom: '1px solid #ECEDF2',
        }}
      >
        <Image setImages={setImages} data={productData?.data?.data} />
        <Box sx={{ flex: 1, pr: '48px' }}>
          <Typography fontSize={'22px'} color={'#111217'} lineHeight={'30px'} fontWeight={'700'}>
            {productData?.data?.data?.name}
          </Typography>
          <Box display='inline-flex' alignItems='center' bgcolor='rgba(254, 80, 0, 0.08)' px='12px' py='4px' borderRadius='8px' mt='6px'>
            <Typography fontSize='13px' fontWeight='600' color='#FE5000'>
              {thousandDivider(getRetailPriceRange(productReaminsDataHistory)?.min, 'сум')} -{' '}
              {thousandDivider(getRetailPriceRange(productReaminsDataHistory)?.max, 'сум')}
            </Typography>
          </Box>
        </Box>

        {/* Sleek Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            backgroundColor: '#ECEDF2',
            '&:hover': { backgroundColor: '#E1E3EA' },
            color: '#111217',
            width: '36px',
            height: '36px',
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Date Filter Strip */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #ECEDF2',
          padding: '12px 40px',
          backgroundColor: '#FAFAFB',
          gap: 2,
        }}
      >
        <Typography fontSize='13px' fontWeight='700' color='#787D93' textTransform='uppercase' letterSpacing='0.5px'>
          Период:
        </Typography>
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: null, end_date: null }} initialNull id='accounting-report-date-range' />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: '32px', overflowY: 'auto', flex: 1 }}>
        {/* Movements Dashboard */}
        {/* <Box>
          <ProductMovementDashboard
            productData={productData}
            singleProductDashboard={{ ...get(singleProductDashboard, 'data.data'), product_amount: get(productData, 'data.data.retail_price') }}
            isLoading={singleProductDashboardLoading}
            unit_per_pack={unitPerPack}
          />
        </Box> */}

        {/* <Box sx={{ height: '1px', bgcolor: '#ECEDF2', my: '32px' }} /> */}

        {/* History Table */}
        <Box>
          <Typography fontSize={'18px'} fontWeight={'700'} color={'#111217'} mb={1.5}>
            История продукта
          </Typography>
          <ProductHistory id={currentSaleId} unit_per_pack={unitPerPack} />
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#ECEDF2', my: 3 }} />

        {/* Remains Table */}
        <Box>
          <Typography fontSize={'18px'} fontWeight={'700'} color={'#111217'} mb={1.5}>
            Остатки
          </Typography>
          <ProductRemainsHistory id={currentSaleId} />
        </Box>

        {/* Rejected Reason (Conditional) */}
        {productData?.data?.data?.status === 'REJECTED' && (
          <>
            <Box sx={{ height: '1px', bgcolor: '#ECEDF2', my: '32px' }} />
            <Box>
              <Typography fontSize={'18px'} fontWeight={'700'} color={'#D32F2F'} mb={1.5}>
                Причина отклонения
              </Typography>
              <Box sx={{ bgcolor: '#FFF5F5', borderRadius: '16px', p: '16px', border: '1px dashed #FFE3E3' }}>
                <Typography sx={{ width: '100%', wordBreak: 'break-word', color: '#D32F2F', fontWeight: 500 }}>
                  {productData?.data?.data?.rejectedComment || 'Нет'}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Box sx={{ height: '1px', bgcolor: '#ECEDF2', my: '32px' }} />

        {/* Additional Info Table */}
        <Box sx={{ mb: '120px' }}>
          <Typography fontSize={'18px'} fontWeight={'700'} color={'#111217'} mb={1.5}>
            Доп. информация
          </Typography>
          <DrawerInfoBox
            mt={1}
            mb={1}
            columnGap={2}
            infoData={[
              { title: 'Код продукта', info: productData?.data?.data?.material_code },
              { title: 'Баркод', info: thousandDivider(productData?.data?.data?.barcode, '') },
              { title: 'Цена', info: thousandDivider(productData?.data?.data?.retail_price, 'сум') },
              { title: 'Производитель', info: productData?.data?.data?.producer?.name },
              { title: 'Сумма бонуса', info: thousandDivider(productData?.data?.data?.bonus_amount, 'сум') },
              { title: 'Бонусный процент', info: thousandDivider(productData?.data?.data?.bonus_percent, '%') },
              { title: 'Время подготовки', info: dayjs(productData?.data?.data?.created_at).format('DD.MM.YYYY') },
              { title: 'Единицы измерения', info: productData?.data?.data?.unit_type?.unit_name },
              { title: 'Наименование товара', info: productData?.data?.data?.name },
              { title: 'Тип', info: productData?.data?.data?.type === 'BUCHET' ? 'Buchet' : 'Market' },
              { title: 'Описание', info: productData?.data?.data?.description, fullWidth: true },
              { title: 'Категории', info: productData?.data?.data?.categories?.map((item) => item.name).join('<br>'), fullWidth: true },
            ]}
          />

          <CheckAccess id={'can-view-markinglist'}>
            <Box mt={2}>
              {productData?.data?.data?.markings?.map((el) => (
                <Box
                  key={el}
                  sx={{
                    backgroundColor: '#F8F9FC',
                    borderRadius: '12px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '18px',
                    color: '#111217',
                    border: '1px solid #ECEDF2',
                    mb: '12px',
                  }}
                >
                  {el}
                </Box>
              ))}
            </Box>
          </CheckAccess>
        </Box>
      </Box>

      {/* Fixed Footer Actions */}
      <Box
        sx={{
          borderTop: '1px solid #ECEDF2',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '1000px',
          bgcolor: '#FFF',
          p: '20px 40px',
          columnGap: 2,
          display: 'inline-flex',
          zIndex: 9999,
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        <ButtonWithPopup
          boxStyles={{ width: '100%' }}
          id={'ff'}
          noArrow
          sx={{
            height: '48px',
            padding: '0px 16px !important',
            width: '100%',
          }}
          popperStyle={{
            '& .pop-up-options': {
              minWidth: '200px !important',
            },
          }}
          noMarginSvg
          placement='bottom-end'
          onClick={() => refetch()}
          buttonLabel={
            <Box
              sx={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                fontWeight: 600,
              }}
              className='cash_register_icon_wrapper'
            >
              Печать ценников
            </Box>
          }
          popperData={[
            { title: 'Пачка', soon: false, clickHandler: () => handlePrint('pack') },
            { title: 'Штук', soon: false, clickHandler: () => handleUnitPrint('unit') },
          ]}
        />

        <Button
          sx={{
            height: '48px',
            fontWeight: 600,
          }}
          color='secondary'
          onClick={() => navigate(`/products/edit/${productData?.data?.data.id}`)}
          startIcon={<FontAwesomeIcon width={15} icon={faPen} />}
          fullWidth
        >
          Редактировать
        </Button>
      </Box>

      {/* Print Templates */}
      <RippedPaperProductPriceCheck
        printContainer={printContainer}
        data={{
          name: get(productData, 'data.data.name'),
          price: get(productData, 'data.data.retail_price'),
          barcode: get(productData, 'data.data.barcode'),
        }}
      />
      <RippedPaperProductPriceCheck
        printContainer={printUnitContainer}
        data={{
          name: get(productData, 'data.data.name'),
          price: get(productData, 'data.data.retail_unit_price'),
          barcode: get(productData, 'data.data.barcode'),
        }}
      />
    </Drawer>
  )
}
