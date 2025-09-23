import { useTheme } from '@emotion/react'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Block, Print, ReceiptLong } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { get, size } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { useParams } from 'react-router-dom'
import CheckAccess from '../../../../components/CheckAccess'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import OutLineTextFieldThousand from '../../../../components/Inputs/OutLineTextFieldThousand'
import SearchInput from '../../../../components/Inputs/SearchInput'
import Label from '../../../../components/Label'
import StyledTooltip from '../../../../components/StyledTooltip'
import thousandDivider from '../../../../utils/thousandDivider'
import ArrowDown from '../../../assets/icons/ArrowDown'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import ArrowUp from '../../../assets/icons/ArrowUp'
import FileIcon from '../../../assets/icons/FileIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import TimesSmallIcon from '../../../assets/icons/TimesSmallIcon'
import UserFilledIcon from '../../../assets/icons/UserFilledIcon'
import DmedPrescriptionsList from './dmedPrescriptionsList'
import OrderLite from './orderLite'

function CartDetailSide({
  setSendToEpos,
  sendToEpos,
  setDmedOrganizedList,
  cashBoxDetails,
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
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [maxAmount, setMaxAmount] = useState(0)
  const [collapseDiscount, setCollapseDiscount] = useState(false)
  const [collapsedSale, setCollapsedSale] = useState(false)
  const childRef = useRef()
  const { id } = useParams()
  const leftZreportCount = localStorage.getItem('leftZreportCount')
  const printNoProductCheque = () => {
    childRef.current.printChildCheque()
  }
  useEffect(() => {
    let send_to_epos = localStorage.getItem('send_to_epos')
    setSendToEpos(JSON.parse(send_to_epos) ?? true)
  }, [])
  useEffect(() => {
    if (typeof sendToEpos == 'boolean') localStorage.setItem('send_to_epos', sendToEpos)
    else localStorage.setItem('send_to_epos', true)
  }, [sendToEpos])

  return (
    <Box className={classes.card_detail}>
      <Box display={'flex'} flexDirection={'column'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box
            onClick={() => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })}
            className={classes.cart_detail_icon}
          >
            <StyledTooltip title={'Открыть новое окно продаж'}>
              <FileIcon color={theme.palette.black} />
            </StyledTooltip>
          </Box>
          <Box onClick={() => setIsOpenDraft(true)} className={classes.cart_detail_icon}>
            <StyledTooltip title={'Черновик / Отложки'}>
              <TimeAndDate color={theme.palette.black} />
            </StyledTooltip>
          </Box>
          <Box onClick={() => setIsOpenSendRejectedProduct(true)} className={classes.cart_detail_icon}>
            <StyledTooltip title={'Отказ'}>
              <Block sx={(theme) => ({ color: theme.palette.black, fontSize: '25px' })} />
            </StyledTooltip>
          </Box>

          <CheckAccess id={'can-return-product'}>
            <Box onClick={() => setIsOpenReturnExchange(true)} className={classes.cart_detail_icon}>
              <StyledTooltip title={'Возврат'}>
                <FontAwesomeIcon color={theme.palette.black} icon={faExchangeAlt} />
              </StyledTooltip>
            </Box>
          </CheckAccess>
          <CheckAccess id={'can-disable-epos-cheque'}>
            <Box
              onClick={() => {
                setSendToEpos((prev) => !prev)
              }}
              className={classes.cart_detail_icon}
            >
              <StyledTooltip title={'EPOS'}>
                <ReceiptLong sx={{ color: sendToEpos ? '#333' : '#fe5000' }} />
              </StyledTooltip>
            </Box>
          </CheckAccess>
          <Box
            onClick={() => size(get(cartItemsList, 'data.data.data')) !== 0 && printNoProductCheque()}
            className={classes.cart_detail_icon}
            sx={{
              path: {
                color: theme.palette.black,
              },
            }}
          >
            <StyledTooltip title={'Распечатать не товарный чек'}>
              <Print color={theme.palette.black} />
            </StyledTooltip>
          </Box>
        </Box>
        <Box className={classes.cart_detail_id}>
          <Typography fontWeight={'500'} fontSize={'18px'} color={'orange.500'} lineHeight={'26px'}>
            #{get(cashBoxDetails, 'data.data.sale_number')}
          </Typography>
        </Box>
      </Box>
      <Box mb={'24px'}>
        <Box sx={{ display: 'flex', mb: '4px', justifyContent: 'space-between' }}>
          <Label>{t('client')}</Label>
          <Typography sx={{ cursor: 'pointer' }} onClick={() => setOpenClientCreateMini(true)} color={'orange.500'} fontSize={'14px'} fontWeight={'600'}>
            {t('create')}
          </Typography>
        </Box>
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
      <DmedPrescriptionsList data={dmedPrescriptionsList} setDmedPrescriptionsList={setDmedPrescriptionsList} />

      <CheckAccess id={'new-sale-discount'}>
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
      </CheckAccess>
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

      <Box
        sx={(theme) => ({
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 'calc(100% - 40px)',
          left: 20,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          backgroundColor: theme.palette.white,
          borderRadius: '32px',
          borderColor: theme.palette.bunker[100],
          boxShadow: '0px 4px 12px 0px #00000014',
        })}
      >
        <Box
          sx={{ cursor: 'pointer', display: 'flex', my: '20px', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setCollapsedSale((a) => !a)}
        >
          <Typography>Лайт продажа</Typography>
          {!collapsedSale ? <ArrowUp color='#111217' /> : <ArrowDown />}
        </Box>
        <OrderLite
          collapsedSale={collapsedSale}
          setDmedOrganizedList={setDmedOrganizedList}
          liteOrder={liteOrder}
          setMaxAmount={setMaxAmount}
          sendToEpos={sendToEpos}
          dmedOrganizedList={dmedOrganizedList}
          childRef={childRef}
          maxAmount={maxAmount}
          setLiteOrder={setLiteOrder}
          dmedPrescriptionsList={dmedPrescriptionsList}
          setDmedPrescriptionsList={setDmedPrescriptionsList}
          setCustomerId={setCustomerId}
          setMarkingList={setMarkingList}
          setHasChange={setHasChange}
          cartItemsList={get(cartItemsList, 'data.data')}
          markingsList={markingsList}
          cashBoxDetails={cashBoxDetails}
          customerId={customerId}
          printContainer={printContainer}
        />
        <Box className={classes.priceDetails}>
          <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
            <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
              {t('total_amount')}:
            </Typography>
            <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
              {thousandDivider(get(cartItemsList, 'data.data.sum'), 'сум')}
            </Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
            <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
              {t('discount')}:
            </Typography>
            <Typography fontWeight={'500'} fontSize={'18px'} color={'red.500'} lineHeight={'28px'}>
              -{thousandDivider(get(cartItemsList, 'data.data.discount_amount'), 'сум')}
            </Typography>
          </Box>
          {collapsedSale && (
            <Button
              loading={hasChange}
              disabled={size(get(cartItemsList, 'data.data.data')) === 0 || maxAmount > 0 || hasChange}
              onClick={() => {
                if (dmedPrescriptionsList.length && dmedOrganizedList.length != size(get(cartItemsList, 'data.data.data'))) {
                  setIsOpenOrganizeDmedOrderDialog(true)
                  return
                }
                if (isAllMarkingFill() || !sendToEpos) {
                  setLiteOrder(true)
                } else {
                  setLiteOrder(false)
                  setIsOpenImplementMarkingDialog({ mode: 'lite' })
                }
              }}
              color='primary'
              sx={{ mb: '16px', height: '48px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography display={'flex'} alignItems={'center'} fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                {t('pay')}
                <Box
                  sx={{
                    color: '#fff',
                    border: '2px solid #fff',
                    height: '34px',
                    display: 'flex',
                    padding: '2px',
                    ml: '15px',
                    fontSize: '12px',
                    minWidth: '34px',
                    alignItems: 'center',
                    borderRadius: '8px',
                    justifyContent: 'center',
                  }}
                >
                  F10
                </Box>
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                {thousandDivider(get(cartItemsList, 'data.data.total_amount'), 'сум')}
              </Typography>
            </Button>
          )}
          <Box display={'flex'}>
            <Button
              sx={{
                borderRadius: '16px',
                mr: '4px',
                p: '12px',
                height: '48px',
                width: '140px',
                '& svg': {
                  flexShrink: 0,
                },
              }}
              disabled={size(get(cartItemsList, 'data.data.data')) == 0}
              color='secondary'
              onClick={() => setIsCreateOpenDraft(true)}
            >
              <TimeAndDate disabled={size(get(cartItemsList, 'data.data.data'))} />
              <Typography ml={'8px'} fontWeight={'500'} fontSize={'18px'} color={'black'} lineHeight={'26px'}>
                {t('draft')}
              </Typography>
            </Button>
            <Button
              disabled={size(get(cartItemsList, 'data.data.data')) === 0}
              sx={{
                borderRadius: '16px',
                ml: '4px',
                p: '12px',
                width: '140px',
                height: '48px',
                '& svg > path': {
                  stroke: '#fff',
                },
              }}
              onClick={() => {
                if (dmedPrescriptionsList.length && dmedOrganizedList.length != size(get(cartItemsList, 'data.data.data'))) {
                  setIsOpenOrganizeDmedOrderDialog(true)
                  return
                }
                if (isAllMarkingFill() || !sendToEpos) {
                  setIsOrderDrower(true)
                } else {
                  setIsOpenImplementMarkingDialog({ mode: 'full' })
                }
              }}
              color='primary'
            >
              <Typography mr={'20px'} fontWeight={'500'} fontSize={'18px'} color={'#fff'} lineHeight={'26px'}>
                {t('Полный')}
              </Typography>

              <ArrowRightIcon disabled={size(get(cartItemsList, 'data.data.data'))} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CartDetailSide
