import { Box, Typography, Button } from '@mui/material'
import { get, size } from 'lodash'
import React from 'react'
import FileIcon from '../../../assets/icons/FileIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import Label from '../../../../components/Label'
import UserFilledIcon from '../../../assets/icons/UserFilledIcon'
import TimesSmallIcon from '../../../assets/icons/TimesSmallIcon'
import SearchInput from '../../../../components/Inputs/SearchInput'
import OutsideClickHandler from 'react-outside-click-handler'
import Highlighter from 'react-highlight-words'
import thousandDivider from '../../../../utils/thousandDivider'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import { useTranslation } from 'react-i18next'
import CheckAccess from '../../../../components/CheckAccess'
import OutLineTextFieldThousand from '../../../../components/Inputs/OutLineTextFieldThousand'

function CartDetailSide({
  cashBoxDetails,
  saleCreate,
  userData,
  classes,
  setOpenClientCreateMini,
  customerId,
  setCustomerId,
  setSearchTerm,
  searchTerm,
  customers,
  setQuickCreateClientName,
  //   fakeIndexForCheckClient,
  changeDiscountDebounce,
  inputDiscount,
  isAllMarkingFill,
  setIsOrderDrower,
  setIsOpenImplementMarkingDialog,
  setDiscountType,
  cartItemsList,
  discount,
  setIsCreateOpenDraft,
  setInputDiscount,
}) {
  const { t } = useTranslation()
  return (
    <Box className={classes.card_detail}>
      <Box display={'flex'}>
        <Box className={classes.cart_detail_id}>
          <Typography fontWeight={'500'} fontSize={'18px'} color={'orange.500'} lineHeight={'26px'}>
            #{get(cashBoxDetails, 'data.data.sale_number')}
          </Typography>
        </Box>
        <Box
          onClick={() => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })}
          className={classes.cart_detail_icon}
        >
          <FileIcon color='#000' />
        </Box>

        <Box onClick={() => setIsOpenDraft(true)} className={classes.cart_detail_icon}>
          <TimeAndDate />
        </Box>
        <Box onClick={() => {}} className={classes.cart_detail_icon}>
          {/* <Box onClick={() => setIsOpenReturnExchange(true)} className={classes.cart_detail_icon}> */}
          <FontAwesomeIcon icon={faExchangeAlt} />
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
            <Box height={'24px'} onClick={() => setCustomerId('')}>
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
            // onKeyDown={(e) => {
            //   if (e.keyCode === 13) onEnter()
            // }}
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
                      setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.first_name, balance: item?.balance })
                    }
                  }}
                  onClick={() => {
                    setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.last_name, balance: item?.balance })

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
      <CheckAccess id={'new-sale-discount'}>
        <Box display={'flex'} alignItems={'center'}>
          <OutLineTextFieldThousand
            setValue={(e) => changeDiscountDebounce(e)}
            value={inputDiscount}
            type={'number'}
            fullWidth
            name='discount'
            label={'Скидка'}
            uncontrolled
            placeholder='Введите скидку'
          />
          <Box ml={'8px'}>
            <InputSwitch
              uncontrolled
              id='app-type'
              name='app-type'
              style={{ marginTop: '32px', width: 'auto' }}
              defaultValue={discount}
              onChange={setDiscountType}
              options={[
                { title: '%', value: 'percent' },
                { title: 'UZS', value: 'cash' },
              ]}
            />
          </Box>
        </Box>
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
      </CheckAccess>
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
          <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
            {thousandDivider(get(cartItemsList, 'data.data.discount_amount'), 'сум')}
          </Typography>
        </Box>
        <Button
          disabled={size(get(cartItemsList, 'data.data.data')) === 0}
          // onClick={() => setIsOrderDrower(true)}
          onClick={() => {
            if (isAllMarkingFill()) {
              setIsOrderDrower(true)
            } else {
              setIsOpenImplementMarkingDialog(true)
            }
          }}
          color='primary'
          sx={{ mb: '16px', display: 'flex', justifyContent: 'space-between' }}
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
        <Button disabled={size(get(cartItemsList, 'data.data.data')) == 0} color='secondary' onClick={() => setIsCreateOpenDraft(true)}>
          <TimeAndDate disabled={size(get(cartItemsList, 'data.data.data'))} />
          <Typography ml={'12px'} fontWeight={'500'} fontSize={'18px'} color={'black'} lineHeight={'26px'}>
            {t('draft')}
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default CartDetailSide
