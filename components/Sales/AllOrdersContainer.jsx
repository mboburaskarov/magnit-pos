import React, { useRef, useCallback } from 'react'
import { Box, Button } from '@mui/material'
import HamburgerMenuIcon from '../../src/assets/icons/BackArrow'
import ArrowNextIcon from '../../src/assets/icons/BackArrow'
import CashCircledIcon from '../../src/assets/icons/BackArrow'
import thousandDivider from '../../utils/thousandDivider'
import { numberToPrice } from '../../utils/numberToPrice'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import { useReactToPrint } from 'react-to-print'
import dayjs from 'dayjs'
import { makeStyles } from '@mui/styles'
import { requests } from '../../utils/requests'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  action_area: {
    display: 'flex',
    marginBottom: 16,
  },
  cart_id: {
    borderRadius: 16,
    border: `1px dashed ${theme.palette.gray[300]}`,
    padding: 13,
    color: theme.palette.blue[500],
    fontFamily: `'Gilroy-Bold', sans-serif`,
    fontSize: '24px',
    lineHeight: '28px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  percent: {
    flex: '1 0 10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 33,
    marginBottom: 8,
    marginRight: 8,
    padding: '0 16px',
    borderRadius: 16,
    background: theme.palette.gray[100],
    fontWeight: 600,
    color: theme.palette.gray[600],
    cursor: 'pointer',
  },
  summary: {
    color: theme.palette.gray[600],
    fontFamily: `'Gilroy-Bold', sans-serif`,
    '&  button': {
      width: '100% !important',
    },
  },
  summaryWrapper: {
    padding: '24px 16px',
    marginBottom: 8,
    borderRadius: 16,
    background: theme.palette.gray[100],
    '& span': {
      color: theme.palette.gray[600],
      fontFamily: `'Gilroy-Bold', sans-serif`,
      fontWeight: 600,
      fontSize: 18,
      lineHeight: '21px',
    },
  },
  btnText: {
    fontWeight: 600,
    fontSize: 18,
    fontFamily: `'Gilroy-Bold', sans-serif`,
  },
  card: {
    color: theme.palette.gray[600],
    boxShadow: theme.boxShadow['16-8'],
    borderRadius: 24,
    fontWeight: 600,
    marginBottom: 32,
  },
  header: {
    padding: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: '19px',
    marginBottom: 7,
  },
  price: {
    fontSize: 18,
    lineHeight: '28px',
    fontFamily: `"Gilroy-Bold", sans-serif`,
    '& span': {
      fontSize: 24,
      color: theme.palette.blue[500],
    },
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: theme.palette.blue[50],
    color: theme.palette.blue[500],
    fontSize: 18,
  },
  content: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 24,
    borderTop: `2px dashed ${theme.palette.gray[200]}`,
  },
  item: {
    flex: '0 0 50%',
    fontSize: 14,
    lineHeight: '17px',
    marginTop: 24,
    '&:first-child, &:nth-child(2)': {
      marginTop: 0,
    },
  },
  child_price: { color: theme.palette.blue[500], marginTop: 4 },
}))

function AllOrdersContainer({ data }) {
  const cls = useStyles()
  const printContainer = useRef()
  const documentName = useRef('Report')
  const { t } = useTranslation()
  const { values: queryParams } = useQueryParams()

  const user_id = useSelector((state) => state.company)

  const { data: userDetails } = useQuery(['user', user_id], () => requests.admin.getSingle(user_id))

  const reportData = {
    end_date: queryParams?.end_date || '',
    start_date: queryParams?.start_date || dayjs().tz().$d,
    user: `${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`,
    total_products_measurement_value: data?.total_products_measurement_value,
    total_returnals_count: data?.total_returnals_count,
    payment_types_stats: data?.payment_types_stats,
    total_returnals_sum: data?.total_returnals_sum,
    total_returned_measurement_value: data?.total_returned_measurement_value,
    total_exchanges_sum: data?.total_exchanges_sum,
    total_transactions_sum: data?.total_transactions_sum,
    count: data?.count,
    total_exchanges_count: data?.total_exchanges_count,
    total_debt_amount: data?.total_debt_amount,
    debt_payment_stats: data?.debt_payment_stats,
    total_paid_debt_amount: data?.total_paid_debt_amount,
  }

  const reactToPrintContent = useCallback(() => printContainer.current, [printContainer.current])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
  })

  return (
    <>
      <Box className={cls.root}>
        <Box>
          {!true && (
            <Box className={cls.action_area}>
              <Button id='print-report' checkSlug='/order/all/print' primary adornmentEnd={<ArrowNextIcon />} fullWidth onClick={handlePrint} isLoading={false}>
                {t('menu.orders.all.all_orders_container.print_report_btn')}
              </Button>
            </Box>
          )}
          <Box>
            <Box className={cls.card}>
              <Box className={cls.header}>
                <Box className={cls.text}>
                  <Box className={cls.title}>{t('menu.orders.all.all_orders_container.transactions')}</Box>
                  <Box className={cls.price}>
                    <span id='orders-count'>{thousandDivider(data?.count)}</span> {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box>
                  <HamburgerMenuIcon />
                </Box>
              </Box>
              <Box className={cls.content}>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.products')}</Box>
                  <Box className={cls.child_price}>
                    <span id='products-count'>{thousandDivider(data?.total_products_measurement_value)}</span>{' '}
                    {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.services')}</Box>
                  <Box className={cls.child_price}>
                    <span id='services-count'>{thousandDivider(data?.total_services_measurement_value)}</span>{' '}
                    {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('dashboard.report_details.sets')}</Box>
                  <Box className={cls.child_price}>
                    <span id='sets-count'>{thousandDivider(data?.total_sets_measurement_value)}</span> {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('navbar.certificates')}</Box>
                  <Box id='exchanges-sum' className={cls.child_price}>
                    <span>{thousandDivider(data?.total_certificate_count)}</span>
                    &nbsp;
                    {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.returns')}</Box>
                  <Box className={cls.child_price}>
                    <span id='returnals-count'>{thousandDivider(data?.total_returned_measurement_value)}</span>{' '}
                    {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.refund')}</Box>
                  <Box className={cls.child_price}>
                    <span id='returnals-sum'>{numberToPrice(data?.total_returnals_sum)}</span>
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.exchanges')}</Box>
                  <Box className={cls.child_price}>
                    <span id='exchanges-count'>{thousandDivider(data?.total_exchanges_count)}</span> {t('menu.orders.all.all_orders_container.unit_abbr')}
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('menu.orders.all.all_orders_container.amount')}</Box>
                  <Box id='exchanges-sum' className={cls.child_price}>
                    <span>{numberToPrice(data?.total_exchanges_sum)}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mt={2}>
            <Box className={cls.card}>
              <Box className={cls.header}>
                <Box className={cls.text}>
                  <Box className={cls.title}>{t('menu.orders.all.all_orders_container.transactions_amount')}</Box>
                  <Box className={cls.price}>
                    <span id='transactions-sum'>{numberToPrice(data?.total_transactions_sum)}</span>
                  </Box>
                </Box>
                <Box>
                  <CashCircledIcon />
                </Box>
              </Box>
              {data?.payment_types_stats.length > 0 && (
                <Box className={cls.content}>
                  {data?.payment_types_stats.map((item, index) => (
                    <Box id='payment-item' className={cls.item} key={index}>
                      <Box className={cls.child_title}>
                        {item.company_payment_type.name === 'Certificate' || item.company_payment_type.name === 'Voucher'
                          ? t(`menu.marketing.certificates.${item.company_payment_type.name?.toLowerCase()}`)
                          : item.company_payment_type.name}
                      </Box>
                      <Box className={cls.child_price}>
                        <span>{numberToPrice(item.sum)}</span>
                      </Box>
                    </Box>
                  ))}
                  {data?.total_with_cashback ? (
                    <Box className={cls.item}>
                      <Box className={cls.child_title}>{t('loyalty_program.cashback')}</Box>
                      <Box className={cls.child_price}>
                        <span id='total-cashback'>{numberToPrice(data?.total_with_cashback)}</span>
                      </Box>
                    </Box>
                  ) : null}
                  {!!data?.total_debt_amount && (
                    <Box id='total-debt-amount' className={cls.item}>
                      <Box className={cls.child_title}>{t('menu.sales.all.debt')}</Box>
                      <Box className={cls.child_price}>
                        <span>{numberToPrice(data?.total_debt_amount)}</span>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <Box mt={2}>
            <Box className={cls.card}>
              <Box className={cls.header}>
                <Box className={cls.text}>
                  <Box className={cls.title}>{t('titles.client_balance')}</Box>
                  <Box className={cls.price}>
                    <span id='clients-balance'>
                      {data?.total_loyalty_balance_income > data?.total_with_cashback
                        ? '+'
                        : data?.total_loyalty_balance_income === data?.total_with_cashback
                        ? ''
                        : '-'}
                      {numberToPrice(Math.abs(data?.total_loyalty_balance_income - data?.total_with_cashback))}
                    </span>
                  </Box>
                </Box>
                <Box>
                  <CashCircledIcon />
                </Box>
              </Box>
              <Box className={cls.content}>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('titles.accrued')}</Box>
                  <Box className={cls.child_price}>
                    <span id='assessed-amount'>{numberToPrice(data?.total_loyalty_balance_income)}</span>
                  </Box>
                </Box>
                <Box className={cls.item}>
                  <Box className={cls.child_title}>{t('titles.spent')}</Box>
                  <Box className={cls.child_price}>
                    <span id='spent-amount'>{numberToPrice(data?.total_with_cashback)}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Box className={cls.card}>
              <Box className={cls.header}>
                <Box className={cls.text}>
                  <Box className={cls.title}>{t('titles.debt_repayment')}</Box>
                  <Box className={cls.price}>
                    <span id='clients-balance'>{numberToPrice(data?.total_paid_debt_amount)}</span>
                  </Box>
                </Box>
                <Box className={cls.icon}>
                  <FontAwesomeIcon icon={faHandHoldingUsd} />
                </Box>
              </Box>
              <Box className={cls.content}>
                {data?.debt_payment_stats?.map((item) => (
                  <Box className={cls.item} key={item.payment_type_id}>
                    <Box className={cls.child_title}>{t(item.name)}</Box>
                    <Box className={cls.child_price}>
                      <span id='assessed-amount'>{numberToPrice(item.amount)}</span>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AllOrdersContainer
