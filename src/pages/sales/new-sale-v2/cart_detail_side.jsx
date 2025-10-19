import { useTheme } from '@emotion/react'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Block, Print, ReceiptLong } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { get, size } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { useParams } from 'react-router-dom'
import CheckAccess from '../../../../components/CheckAccess'
import { default as InputSwitch, default as InputSwitchNew } from '../../../../components/Inputs/InputSwitch'
import OutLineTextFieldThousand from '../../../../components/Inputs/OutLineTextFieldThousand'
import SearchInput from '../../../../components/Inputs/SearchInput'
import Label from '../../../../components/Label'
import StyledTooltip from '../../../../components/StyledTooltip'
import thousandDivider from '../../../../utils/thousandDivider'
import ArrowDown from '../../../assets/icons/ArrowDown'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import ArrowUp from '../../../assets/icons/ArrowUp'
import FileIcon from '../../../assets/icons/FileIcon'
import PrizeBoxIcon from '../../../assets/icons/PrizeBoxIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import TimesSmallIcon from '../../../assets/icons/TimesSmallIcon'
import UserFilledIcon from '../../../assets/icons/UserFilledIcon'
import DmedPrescriptionsList from './dmedPrescriptionsList'
import OrderLite from './orderLite'
import MaximizeIcon from '../../../assets/icons/MaximizeIcon'
import RightArrow from '../../../assets/icons/RightArrow'
import CustomSwitch from '../../../../components/IOSSwitch'
import TimeFast from '../../../assets/icons/TimeFast'
import ClearIcon from '../../../assets/icons/ClearIcon'
import ReturnExchangeIcon from '../../../assets/icons/ReturnExchangeIcon'
import ChequeIcon from '../../../assets/icons/ChequeIcon'
import OnlineSaleNoorIcon from '../../../assets/icons/OnlineSaleNoorIcon'
function CartDetailSide({
  setServiceType,
  setIsOpenBonusProductDrawer,
  serviceType,
  setSendToEpos,
  sendToEpos,
  setDmedOrganizedList,
  cashBoxDetails,
  setIsOpenNoorDrawer,
  dmedOrganizedList,
  setIsOpenOrganizeDmedOrderDialog,
  setDmedPrescriptionsList,
  setIsOpenSendRejectedProduct,
  dmedPrescriptionsList,
  saleCreate,
  userData,
  classes,
  hasChange,
  setOpenClientCreateMini,
  customerId,
  removeDiscountCard,
  setMarkingList,
  setCustomerId,
  setSearchTerm,
  searchTerm,
  customers,
  setQuickCreateClientName,
  changeDiscountDebounce,
  inputDiscount,
  isAllMarkingFill,
  setIsOrderDrower,
  setIsOpenImplementMarkingDialog,
  setDiscountType,
  cartItemsList,
  setHasChange,
  discount,
  setIsOpenReturnExchange,
  setIsCreateOpenDraft,
  setInputDiscount,
  setIsOpenDraft,
  printContainer,
  markingsList,
  liteOrder,
  setLiteOrder,
  childRef,
  maxAmount,
  setMaxAmount,
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [collapseDiscount, setCollapseDiscount] = useState(false)
  const [collapsedSale, setCollapsedSale] = useState(false)
  const { id } = useParams()
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)

  const leftZreportCount = localStorage.getItem('leftZreportCount')
  useEffect(() => {
    let send_to_epos = localStorage.getItem('send_to_epos')
    setSendToEpos(JSON.parse(send_to_epos) ?? true)
  }, [])
  useEffect(() => {
    if (typeof sendToEpos == 'boolean') localStorage.setItem('send_to_epos', sendToEpos)
    else localStorage.setItem('send_to_epos', true)
  }, [sendToEpos])
  const methods = useForm()

  const { control } = methods
  const CustomButtonRow = ({ onClick, leftIcon, title }) => (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingY: '12px',
        borderBottom: '1px solid',
        borderColor: 'bunker.100',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {leftIcon}
        <Typography sx={{ ml: '10px', fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}>{title}</Typography>
      </Box>
      <RightArrow />
    </Box>
  )
  return (
    <Box
      className={classes.card_detail}
      sx={{
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
          leftIcon={<MaximizeIcon />}
          title={'Открыть новое окно продаж'}
          onClick={() => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })}
        />
        <CustomButtonRow leftIcon={<TimeFast />} title={'Черновик / Отложки'} onClick={() => setIsOpenDraft(true)} />
        <CustomButtonRow leftIcon={<ClearIcon />} title={'Отказ'} onClick={() => setIsOpenSendRejectedProduct(true)} />
        <CustomButtonRow leftIcon={<ReturnExchangeIcon />} title={'Возврат / Обмен'} onClick={() => setIsOpenReturnExchange(true)} />

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
            <Typography sx={{ ml: '10px', fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}>EPOS</Typography>
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
        <CustomButtonRow leftIcon={<OnlineSaleNoorIcon />} title={'Онлайн-продажи (Noor)'} onClick={() => setIsOpenNoorDrawer(true)} />
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
              setSearchTerm={setSearchTerm}
              client
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
                      setOpenClientCreateMini(true), setQuickCreateClientName(searchTerm)
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
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && fakeIndexForCheckClient === index + 1) {
                        setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.first_name, balance: item?.balance, barcode: item?.discount_card })
                      }
                    }}
                    onClick={() => {
                      setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.last_name, balance: item?.balance, barcode: item?.discount_card })

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
      </Box>
      <Box className={classes.cart_detail_id}>
        <Typography fontWeight={'600'} fontSize={'16px'} color={'bunker.300'} lineHeight={'24px'}>
          Новый клиент
        </Typography>
      </Box>

      <Box sx={{ padding: '10px 20px' }}>
        <InputSwitchNew
          id='service-type-id'
          noMarginTop
          name='service-type'
          control={control}
          uncontrolled
          defaultValue={serviceType || 'other'}
          onChange={(value) => setServiceType(value)} // Add this line
          options={[
            {
              title: t('Другой'),
              value: 'other',
            },
            {
              title: t('Arzon Apteka'),
              value: 'arzon-apteka',
            },
            {
              title: t('Oson Apteka'),
              value: 'oson-apteka',
            },
          ]}
        />
      </Box>
      <DmedPrescriptionsList data={dmedPrescriptionsList} setDmedPrescriptionsList={setDmedPrescriptionsList} />
      {/* <CheckAccess id={'new-sale-discount'}>
        <Box onClick={() => setCollapseDiscount((p) => !p)} width={'100%'} display={'flex'} justifyContent={'space-between'}>
          <Label>{t('discount')}</Label>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'bg.10',
            }}
          >
            {collapseDiscount ? <ArrowDown color='#111217' /> : <ArrowUp color='#111217' />}{' '}
          </Box>
        </Box>
        {collapseDiscount && (
          <Box display={'flex'} alignItems={'center'}>
            <OutLineTextFieldThousand
              setValue={(e) => changeDiscountDebounce(e)}
              value={inputDiscount}
              type={'number'}
              fullWidth
              name='discount'
              label={''}
              uncontrolled
              placeholder='Введите скидку'
            />
            <Box ml={'8px'}>
              <InputSwitch
                uncontrolled
                id='app-type'
                noMarginTop
                name='app-type'
                style={{ width: 'auto' }}
                defaultValue={discount}
                onChange={setDiscountType}
                options={[
                  { title: '%', value: 'percent' },
                  { title: 'UZS', value: 'cash' },
                ]}
              />
            </Box>
          </Box>
        )}
        {collapseDiscount && (
          <Box mt='8px' display={'flex'}>
            {discount === 'percent' &&
              [15, 30, 50, 75].map((el, index) => (
                <Box
                  sx={{ cursor: 'pointer', color: el === inputDiscount ? 'orange.500' : '#000' }}
                  onClick={() => setInputDiscount(el)}
                  className={classes.percent}
                >
                  {el}%
                </Box>
              ))}
            {discount === 'cash' &&
              [5, 10, 50, 100].map((el, index) => (
                <Box
                  sx={{ cursor: 'pointer', color: el === inputDiscount / 1000 ? 'orange.500' : '#000' }}
                  onClick={() => setInputDiscount(`${el}000`)}
                  className={classes.percent}
                >
                  {el}k
                </Box>
              ))}
          </Box>
        )}
      </CheckAccess> */}
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
