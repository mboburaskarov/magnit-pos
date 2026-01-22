import CheckAccess from '@components/CheckAccess'
import InputSwitchRadio from '@components/Inputs/InputSwitchRadio'
import SearchInput from '@components/Inputs/SearchInput'
import CustomSwitch from '@components/IOSSwitch'
import ShortcutBox from '@components/ShortcutBox'
import StyledTooltip from '@components/StyledTooltip'
import BrandPlaceholderIcon from '@icons/BrandPlaceholderIcon'
import ChequeIcon from '@icons/ChequeIcon'
import ClearIcon from '@icons/ClearIcon'
import MaximizeIcon from '@icons/MaximizeIcon'
import OnlineSaleNoorIcon from '@icons/OnlineSaleNoorIcon'
import PrizeBoxIcon from '@icons/PrizeBoxIcon'
import QrScanIcon from '@icons/QrScanIcon'
import ReturnExchangeIcon from '@icons/ReturnExchangeIcon'
import RightArrow from '@icons/RightArrow'
import TimeFast from '@icons/TimeFast'
import TimesSmallIcon from '@icons/TimesSmallIcon'
import UserFilledIcon from '@icons/UserFilledIcon'
import { Box, Typography } from '@mui/material'
import { getDynamicBonusTableHeight } from '@utils/calcDynamicBonusTableHeight.js'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import { get, size } from 'lodash'
import { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import BonusProductTable from './bonusProductTable'
import DmedPrescriptionsList from './dmedPrescriptionsList'

function CartDetailSide({
  setServiceType,
  noorOrderCount,
  setIsOpenBonusProductDrawer,
  serviceType,
  setSendToEpos,
  sendToEpos,
  cashBoxDetails,
  setIsOpenNoorDrawer,
  dmedOrganizedList,
  setDmedPrescriptionsList,
  setIsOpenSendRejectedProduct,
  dmedPrescriptionsList,
  saleCreate,
  userData,
  classes,
  setOpenClientCreateMini,
  customerId,
  removeDiscountCard,
  setCustomerId,
  setSearchTerm,
  searchTerm,
  customers,
  setQuickCreateClientName,
  setIsOpenReturnExchange,
  setIsOpenDraft,
}) {
  const methods = useForm()
  const { control } = methods
  const { t } = useTranslation()
  const { id } = useParams()
  const [bonusTableHeight, setBonusTableHeight] = useState(0)

  useEffect(() => {
    setBonusTableHeight(getDynamicBonusTableHeight(userData, get(customerId, 'name', false), dmedPrescriptionsList))
  }, [customerId, dmedOrganizedList])

  // const { data: sellerBonus } = useQuery(['sellerBonus'], () => requests.getSellerBonusData())
  const { data: sellerBonusInOneSale } = useQuery(
    ['sellerBonusInOneSale'],
    () => requests.getSellerBonusInOneSale({ operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), employee_id: get(userData, 'id') }),
    { enabled: get(cashBoxDetails, 'data.data.cash_box_operation_id', '')?.length > 0 },
  )
  const leftZreportCount = localStorage.getItem('leftZreportCount')

  useEffect(() => {
    let send_to_epos = localStorage.getItem('send_to_epos')
    setSendToEpos(JSON.parse(send_to_epos) ?? true)
  }, [])

  useEffect(() => {
    if (typeof sendToEpos == 'boolean') localStorage.setItem('send_to_epos', sendToEpos)
    else localStorage.setItem('send_to_epos', true)
  }, [sendToEpos])

  const CustomButtonRow = ({ onClick, notify = false, leftIcon, title, isLast = false, accessId = 'no-access' }) => (
    <CheckAccess id={accessId}>
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: '12px',
          borderBottom: isLast ? '1px solid' : 'none',
          borderColor: 'bunker.100',
          '&:hover': {
            backgroundColor: 'bg.10',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {leftIcon}
          <Typography sx={{ ml: '10px', fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}>{title}</Typography>
          {notify ? (
            <Typography
              sx={{
                ml: '10px',
                width: '20px',
                bgcolor: 'orange.500',
                borderRadius: '50%',
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '20px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {notify}
            </Typography>
          ) : null}
        </Box>
        <RightArrow />
      </Box>
    </CheckAccess>
  )
  return (
    <Box
      className={classes.card_detail}
      sx={{
        backgroundColor: 'white',
        pt: '20px',
        '& .slider_box_wrapper': {
          width: '100%',
        },
        '& .slider_box': {
          width: '100%',
        },
      }}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Box className={classes.cart_detail_id}>
          <Typography fontWeight={'600'} fontSize={'16px'} color={'bunker.300'} lineHeight={'24px'}>
            ID: #{get(cashBoxDetails, 'data.data.sale_number')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: '8px 20px' }}>
        <CustomButtonRow
          accessId='can-open-new-window'
          isLast={true}
          leftIcon={<MaximizeIcon />}
          title={t('open_new_window_sale')}
          onClick={() => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })}
        />
        <CustomButtonRow
          accessId='draft-and-pending-sales'
          isLast={true}
          leftIcon={<TimeFast />}
          title={t('draft_and_pending_sales')}
          onClick={() => setIsOpenDraft(true)}
        />
        <CustomButtonRow
          accessId='product-reject'
          isLast={true}
          leftIcon={<ClearIcon />}
          title={t('navbar.rejected_products')}
          onClick={() => setIsOpenSendRejectedProduct(true)}
        />
        <CustomButtonRow
          accessId='can-return-product'
          isLast={true}
          leftIcon={<ReturnExchangeIcon />}
          title={t('navbar.return')}
          onClick={() => setIsOpenReturnExchange(true)}
        />
        <CheckAccess id={'can-disable-epos-cheque'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingY: '12px',
              borderBottom: '1px solid',
              borderColor: 'bunker.100',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChequeIcon />
              <Typography sx={{ ml: '10px', fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}>{t('epos')}</Typography>
            </Box>
            <CustomSwitch
              onChange={() => {
                setSendToEpos((prev) => !prev)
              }}
              value={sendToEpos}
              name='isActive'
              defaultValue={true}
              uncontrolled
            />
          </Box>
        </CheckAccess>

        <CustomButtonRow
          notify={noorOrderCount}
          accessId='noor-order'
          leftIcon={<OnlineSaleNoorIcon />}
          title={t('online_sales_noor')}
          onClick={() => setIsOpenNoorDrawer(true)}
        />
      </Box>

      <Box>
        <Box className={classes.cart_detail_id}>
          <Typography fontWeight={'600'} fontSize={'16px'} color={'bunker.300'} lineHeight={'24px'}>
            {t('client')}
          </Typography>
          <Typography sx={{ cursor: 'pointer' }} onClick={() => setOpenClientCreateMini(true)} color={'orange.500'} fontSize={'14px'} fontWeight={'600'}>
            {t('create')}
          </Typography>
        </Box>
        <Box sx={{ padding: '20px' }}>
          {customerId ? (
            <Box className={classes.clientInfo}>
              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <UserFilledIcon />
                <Box ml={2}>
                  <Typography sx={{ fontSize: '18px', lineHeight: '28px', fontWeight: '500', color: 'bunker.950' }} style={{ cursor: 'pointer' }}>
                    {get(customerId, 'name')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', lineHeight: '16px', fontWeight: '500', color: 'bunker.400' }} color='textSecondary'>
                    {t('balans')}: {get(customerId, 'balance')}
                  </Typography>
                </Box>
              </Box>
              <Box height={'24px'} onClick={() => removeDiscountCard({ data: { sale_id: id, customer_id: customerId.id } })} sx={{ cursor: 'pointer' }}>
                <TimesSmallIcon />
              </Box>
            </Box>
          ) : (
            <SearchInput
              id='client-search-bar'
              name='search'
              placeholder={t('client.placeholder')}
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              adornment={
                <Box
                  sx={{
                    bgcolor: 'orange.500',
                    display: 'flex',
                    height: '32px',
                    borderRadius: '16px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 6px',
                    '& .shortcutbox': {
                      ml: '8px',
                    },
                  }}
                >
                  <QrScanIcon color='#fff' />
                  <ShortcutBox height='20px' shortcut='F3' />
                  <Box
                    sx={{
                      position: 'absolute',
                      bgcolor: '#0125FF',
                      padding: '0 8px',
                      height: '20px',
                      textAlign: 'center',
                      borderRadius: '12px',
                      mr: '8px',
                      top: '-10px',
                      right: '-24px',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600', color: '#fff !important', textAlign: 'center', m: '0 !important' }}
                    >
                      soon
                    </Typography>
                  </Box>
                </Box>
              }
              setSearchTerm={setSearchTerm}
              error={!!searchTerm && searchTerm?.length < 3}
            />
          )}
          {!!searchTerm && searchTerm?.length < 3 && (
            <Box display='flex' alignItems='center'>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.red[500],
                  fontSize: '14px',
                  fontFamily: 'Inter',
                  lineHeight: '16.94px',
                  marginLeft: '4px',
                })}
              >
                {t('min_length_for_search_employee')}
              </Typography>
            </Box>
          )}

          {searchTerm?.length > 2 && (
            <OutsideClickHandler
              onOutsideClick={() => {
                setSearchTerm('')
              }}
            >
              <Box className={classes.searchItemList}>
                {size(customers) == 0 && (
                  <Box
                    id='searchResult0'
                    tabIndex={0}
                    onClick={() => {
                      ;(setOpenClientCreateMini(true), setQuickCreateClientName(searchTerm))
                    }}
                    className={classes.noSuchClientAdd}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && fakeIndexForCheckClient === 0) {
                        setOpenClientCreateMini(true)
                      }
                    }}
                  >
                    <Typography style={{ marginLeft: '7px' }}>
                      {t('add')} “{searchTerm}”
                    </Typography>
                  </Box>
                )}

                {customers?.map((item, index) => (
                  <Box
                    key={index}
                    tabIndex={index + 1}
                    id={`searchResult${index + 1}`}
                    className={classes.searchItem}
                    onClick={() => {
                      setCustomerId({
                        id: item?.id,
                        name: item?.first_name + ' ' + item?.last_name,
                        balance: item?.balance,
                        barcode: item?.discount_card,
                        discount_card_barcode: searchTerm == item?.discount_card ? item?.discount_card : null,
                        loyalty_card_barcode: searchTerm == item?.loyalty_card_barcode ? item?.loyalty_card_barcode : null,
                      })
                      setSearchTerm()
                    }}
                  >
                    <Typography>
                      <Highlighter
                        highlightClassName='highlighter'
                        searchWords={searchTerm ? searchTerm?.split(' ') : []}
                        autoEscape
                        textToHighlight={`${item.first_name} ${item.last_name}`}
                      />
                    </Typography>
                    <Typography style={{ color: 'gray.400', whiteSpace: 'pre' }}>
                      <Highlighter
                        highlightClassName='highlighter'
                        searchWords={searchTerm ? searchTerm?.split(' ') : []}
                        autoEscape
                        textToHighlight={item.phone_numbers?.join('\r\n') || ''}
                      />
                    </Typography>
                  </Box>
                ))}
              </Box>
            </OutsideClickHandler>
          )}
        </Box>
        {customerId && (
          <Box
            sx={{
              background: customerId?.loyalty_card_barcode
                ? 'linear-gradient(147.13deg, #2558FF 3.88%, #0028FF 73.63%)'
                : 'linear-gradient(147.13deg, #FFAC70 3.88%, #FF7D37 73.63%)',
              border: '1px solid',
              borderColor: 'purple.200',
              borderRadius: '16px',
              padding: '12px 16px',
              m: '20px',
              mt: 0,
              position: 'relative',
            }}
          >
            <Typography fontWeight={'500'} fontSize={'14px'} color={customerId?.loyalty_card_barcode ? 'purple.200' : 'bunker.100'} lineHeight={'20px'}>
              {customerId?.loyalty_card_barcode ? t('balance') : t('Дисконтная карта')}
            </Typography>
            <Typography fontWeight={'700'} fontSize={'28px'} color={'white'} lineHeight={'40px'}>
              {thousandDivider(get(customerId, 'balance', 0), 'сум')}
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                bottom: '-5px',
              }}
            >
              <BrandPlaceholderIcon color={customerId?.loyalty_card_barcode ? '#4D87FF' : '#fff'} />
            </Box>
          </Box>
        )}
      </Box>
      <Box className={classes.cart_detail_id}>
        <Typography fontWeight={'600'} fontSize={'16px'} color={'bunker.300'} lineHeight={'24px'}>
          {t('new_client')}
        </Typography>
      </Box>

      <Box sx={{ padding: '10px 20px' }}>
        <InputSwitchRadio
          id='service-type-id'
          noMarginTop
          name='service-type'
          control={control}
          uncontrolled
          defaultValue={serviceType || 'other'}
          onChange={(value) => setServiceType(value)}
          options={[
            {
              title: t('other'),
              value: 'other',
            },
            {
              title: t('arzon_apt'),
              value: 'arzon-apteka',
            },
            {
              title: t('oson_apt'),
              value: 'oson-apteka',
            },
          ]}
        />
      </Box>
      <DmedPrescriptionsList data={dmedPrescriptionsList} setDmedPrescriptionsList={setDmedPrescriptionsList} />
      <Box
        onClick={() => setIsOpenBonusProductDrawer({ owner: 'my' })}
        sx={{ backgroundColor: '#FFC120', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              backgroundColor: 'white',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              mr: '12px',
              '& svg': {
                width: '24px',
                height: '24px',
              },
            }}
          >
            <PrizeBoxIcon color='#FFC120' />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: '700', fontSize: '24px', lineHeight: '32px', color: '#fff' }}>
              +{thousandDivider(get(sellerBonusInOneSale, 'data.data.bonus', 0), 'сум')}
            </Typography>
            <Typography sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '14px', color: '#fff' }}>{t('my_bonus')}</Typography>
          </Box>
        </Box>
        <RightArrow color='#fff' />
      </Box>
      <Box className={classes.cart_detail_id} mt={'12px'}>
        <Typography fontWeight={'600'} fontSize={'16px'} color={'bunker.300'} lineHeight={'24px'}>
          {t('bonus_products')}
        </Typography>
        <Typography sx={{ cursor: 'pointer' }} onClick={() => setIsOpenBonusProductDrawer(true)} color={'orange.500'} fontSize={'14px'} fontWeight={'600'}>
          {t('show')}
        </Typography>
      </Box>
      <BonusProductTable customerId={customerId} bonusTableHeight={bonusTableHeight} />
      {leftZreportCount <= 7 && leftZreportCount != null ? (
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#f00',
            padding: '10px 5px',
            borderRadius: '10px',
            mt: '20px',
          }}
        >
          <StyledTooltip
            title={`Вам осталось открыть еще ${leftZreportCount} отчета z. После еще ${leftZreportCount} отчетов z вы не сможете открыть кассовый аппарат. Вам необходимо получить новую сим-карту epos в течение ${leftZreportCount} дней.`}
          >
            <Box
              component='span'
              sx={{
                display: 'inline-block',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                px: 2,
              }}
            >
              У вас есть еще {leftZreportCount} возможности открыть z-отчеты.
            </Box>
          </StyledTooltip>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  )
}

export default CartDetailSide
