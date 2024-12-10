import React, { useState } from 'react'
import DateOrderAccordion from '../../../components/DateOrderAccordion/DateOrderAccordionContainer'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import ButtonWithPopup from '../../../components/Buttons/ButtonWithPopup'
import CalendarIcon from '../../assets/icons/CalendarIcon'
import InputSearch from '../../../components/Inputs/InputSearch'
import dayjs from 'dayjs'
import DateFilterDrawerSingle from '../../../components/Inputs/DateRangeInput.jsx/DateFilterDrawerSingle'
import { customDateRanges } from '../../../constants/customDateRanges'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
  },
  content: {
    flexGrow: '1',
    position: 'relative',
    width: 638,
  },
  cart_details: {
    width: 386,
    minHeight: '100vh',
    maxHeight: '100%',
    padding: '48px 32px',
    borderLeft: `2px solid ${theme.palette.gray[200]}`,
  },
  title: {
    display: 'flex',
    '& > div': {
      marginLeft: 16,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    '& > p': {
      fontSize: 36,
      lineHeight: '56px',
      color: theme.palette.black,
      whiteSpace: 'nowrap',
      fontFamily: `"Gilroy-Bold", sans-serif`,
      fontWeight: 600,
      margin: 0,
    },
    '& > div > div': {
      display: 'flex',
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '20px',
      alignItems: 'center',
      background: theme.palette.gray[100],
      borderRadius: 16,
    },
    '& > div > div > div': {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 10,
      alignItems: 'center',
      padding: '8px 32px 8px 0',
    },
    '& > div > div > svg': {
      width: 56,
    },
    '& > div > span': {
      width: 48,
      height: 48,
      borderRadius: '50%',
      fontFamily: `"Gilroy-Bold", sans-serif`,
      fontSize: 24,
      lineHeight: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.gray[100],
      color: theme.palette.blue[500],
    },
  },
  dateBtn: {
    '&  > p': {
      fontWeight: 600,
      textAlign: 'left',
      color: theme.palette.gray[400],
      lineHeight: '19px',
      fontSize: 16,
    },
    '& > span': {
      lineHeight: '19px',
      color: theme.palette.gray[600],
      fontWeight: 600,
    },
  },
}))

function AllSales() {
  const classes = useStyles()
  const { t } = useTranslation()
  const [filterDates, setFilterDates] = useState({
    start_date: new Date(),
  })
  const [customDateRangeSelected, setCustomDateRangeSelected] = useState(t('dates.today'))

  return (
    <Box position='relative'>
      <Box className={classes.root}>
        <Box className={classes.content} mx={4}>
          <Box mt={6}>
            <Typography className={classes.title} component='h2'>
              <p>{t('menu.orders.all.heading')}</p>
              <Box>
                <span id='orders-count'>{2}</span>
                <ButtonWithPopup
                  id='chooseDate'
                  noArrow
                  buttonProps={{
                    adornmentStart: <CalendarIcon />,
                    secondary: true,
                  }}
                  noMarginSvg
                  placement='bottom-end'
                  buttonLabel={
                    <Box className={classes.dateBtn}>
                      <p>{customDateRangeSelected} </p>
                      <span>
                        {filterDates?.start_date ? dayjs(filterDates?.start_date).format('DD.MM.YYYY') : ''}
                        {filterDates?.end_date ? ' - ' : ''}
                        {filterDates?.end_date ? dayjs(filterDates?.end_date).format('DD.MM.YYYY') : ''}
                      </span>
                    </Box>
                  }
                  popperContentProps={{
                    onChange: (val) => setFilterDates(val),
                    customDateRanges: customDateRanges(t),
                    onCustomRangeSelect: (name) => setCustomDateRangeSelected(name),
                    isFilter: true,
                    eventName: 'cashbox_operations_date_change_attempts',
                  }}
                  PopperContent={DateFilterDrawerSingle}
                />
              </Box>
            </Typography>
            <Box display='flex' width='100%' mt={3}>
              <Box flex='1 0 40%' mr={1}>
                <InputSearch
                  id='order-search'
                  name='search'
                  placeholder={t('menu.orders.all.id_placeholder')}
                  fullWidth
                  onFocus={() => event('all_sales_search_attempts')}
                  uncontrolled
                />
              </Box>
              <Box flex='0 0 10%' minWidth={194}>
                {/* <FilterButton id='order-filter' filterMenu={openFilter} setFilterMenu={setOpenFilter} /> */}
              </Box>
            </Box>
            {/* <FilterMenu
              open={openFilter}
              setOpen={setOpenFilter}
              shop_id={orderList?.data.count > 0 && orderList?.data?.orders_sorted_by_date_list[0]?.orders[0]?.order_detail.shop_id}
              eposOn={eposOn}
            /> */}
            {/* {orderList?.data.count > 0 || orderList?.data.orders_sorted_by_date_list?.length ? ( */}
            <DateOrderAccordion
              isLoading={false}
              setIsOpen={() => {}}
              list={[
                {
                  date: '2024-12-10',
                  orders: [
                    {
                      id: 'e731a4db-d818-4c9d-aef9-685037bdd013',
                      parent_id: '',
                      company_id: '',
                      order_number: '819943',
                      order_status: '',
                      order_detail: {
                        customer: {},
                        user: {
                          id: '2a0baea7-90c4-43ed-bfd9-cbad6b9d7d97',
                          name: 'Back Import',
                          first_name: '',
                          last_name: '',
                        },
                        cashbox_name: 'gtg',
                        cashbox_id: 'eb305989-6bbc-434c-8107-e820258e8947',
                        shift_id: 0,
                        shop_id: '1b61c733-8d38-4842-a52d-710f23031be6',
                        shop: {
                          id: '',
                          name: 'Store test-back-import',
                        },
                        total_price: 11200,
                        has_discount: false,
                        total_products_measurement_value: 1,
                        total_sets_measurement_value: 0,
                        total_services_measurement_value: 0,
                        total_returned_measurement_value: 0,
                        comment: '',
                        created_at: '2024-12-10 11:29:06',
                        created_at_utc: '',
                        with_cashback: 0,
                        returned_cashback: 0,
                        loyalty_balance_income: 0,
                        loyalty_balance_outcome: 0,
                        loyalty_payment: 0,
                        not_loyalty_payment: 0,
                        gift_card_payment: 0,
                        is_authorized: false,
                        has_certificate: false,
                        has_voucher: false,
                        promo_codes: null,
                        without_cashback: false,
                        user_has_auth_role: false,
                        offline_order_validation_status: 0,
                      },
                      order_type: 'SALE',
                      created_at: '',
                      deleted_at: 0,
                      created_at_utc: '',
                      future_time: '',
                      debt: null,
                      customer_id: '',
                      parent_order_debt: null,
                      deleted: false,
                      webkassa_log_qty: 0,
                      epos_log_qty: 0,
                      finished_at: '2024-12-10T06:29:16.610166Z',
                      display_finished_at: '2024-12-10 11:29:16',
                      sold_at: '2024-12-10T06:29:16Z',
                      display_sold_at: '2024-12-10 11:29:16',
                      order_debt_payments: null,
                      park_status: '',
                      exchange_disabled: false,
                      total_remaining_debt_in_chain: 0,
                      updated_at: '',
                      has_insurance: false,
                      insurance: null,
                    },
                  ],
                },
              ]}
              pageCount={1}
            />
            {/* ) : isFetching ? ( */}
            {/* <LoadingContainer /> */}
            {/* ) : ( */}
            {/* <EmptyList title='menu.orders.all.no_sales' /> */}
            {/* )} */}
          </Box>
        </Box>
        <Box className={classes.cart_details}>
          <Box width='100%' height='100%'>
            {/* <AllOrdersContainer data={stats?.data} /> */}
            {/* <AllOrderDrawer
              isOpen={isOpen}
              closeDrawer={closeDrawer}
              refetchAll={refetchAll}
              user={userDetails?.data}
              shop_id={orderList?.data.count > 0 && orderList?.data?.orders_sorted_by_date_list[0]?.orders[0]?.order_detail.shop_id}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              deleteItem={deleteItem}
              setDeleteItem={setDeleteItem}
            /> */}
          </Box>
        </Box>
      </Box>
      {/* <OnboardingBlock id='orders' videoId='dNdWWh3jbKQ' title='onboarding.title.all_orders' /> */}
    </Box>
  )
}

export default AllSales
