import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import TickOutlinedIcon from '../../src/assets/icons/BigTickIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { numberToPrice } from '../../utils/numberToPrice'
import { getCurrentWeekDay } from '../../utils/getCurrentWeekDay'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import requests from './DashedRow'
import currency from '../../utils/currency'
import DashedRow from './DashedRow'
import useStyles from './useStyles'
import ChequeBarcode from './ChequeBarcode'
import { QRCodeSVG } from 'qrcode.react'
import { calculateNDS } from '../../utils/calculateNDS'
import palette from '../../src/assets/theme/mui.config'
import dayjs from 'dayjs'
import { getGiftCardTitle } from '../../utils/getGiftCardTitle'

function RippedPaperCheck({
  data,
  margin,
  checked,
  chequeData: cheque,
  logo,
  noSticky,
  orderItems,
  totalPrice,
  shop,
  user,
  sellers,
  returnItems,
  clientName,
  settings,
  orderNumber,
  discount,
  viewSample,
  customFields,
  totalPriceWithoutDiscount,
  eposTransaction,
  eposOn,
  webkassaOn,
  webkassaTransaction,
  debt,
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [customString, setCustomString] = useState('')
  const [salePercentage, setSalePercentage] = useState(0)
  const [payments, setPayments] = useState([])
  const { current_shop_id: id, company_id } = useSelector((state) => state.company)
  const { orderPayments } = useSelector((state) => state.cart)
  const { data: shopDetails } = useQuery(['shop', id], () => requests.shop.getSingle(shop?.id || id), { enabled: Boolean(shop?.id || id) })
  const { data: companyDetails } = useQuery(['company', company_id], () => requests.company.getSingle())

  useEffect(() => {
    const m = new Map()
    orderPayments?.forEach((item) => {
      const newItem = {
        company_payment_type_id: item?.company_payment_type_id,
        paid_amount: item?.paid_amount,
        name: item.name,
        returned_amount: 0,
      }
      if (m.get(item.company_payment_type_id)) {
        const oldItem = m.get(item.company_payment_type_id)
        oldItem.paid_amount += item?.paid_amount
        m.set(item?.company_payment_type_id, oldItem)
      } else {
        m.set(item?.company_payment_type_id, newItem)
      }
    })
    if (debt) {
      m.set('debt', {
        paid_amount: debt?.amount,
        name: t('menu.sales.all.debt'),
      })
    }

    setPayments([...m.values()])
  }, [orderPayments])

  useEffect(() => {
    const subTotalPercentage = totalPriceWithoutDiscount / 100
    setSalePercentage(Math.round((Math.abs(totalPriceWithoutDiscount) - Math.abs(totalPrice)) / subTotalPercentage))
  }, [totalPriceWithoutDiscount, totalPrice])

  useEffect(() => {
    if (customFields?.length && !!cheque?.has_additional_info) {
      let str = ''
      customFields?.forEach((field) => (str += ` / ${field?.name}`))
      setCustomString(str)
    } else setCustomString('')
  }, [customFields, cheque])

  const eposData = useMemo(
    () => [
      {
        title: t('components.numberFM'),
        desc: eposTransaction?.info?.terminalId,
      },
      {
        title: t('components.chequeNumber'),
        desc: t('components.chequesNumberDesc', {
          expr: eposTransaction?.info?.receiptSeq || 0,
        }),
      },
      {
        title: t('components.fiscalNumber'),
        desc: eposTransaction?.info?.fiscalSign,
      },
    ],
    [eposTransaction]
  )

  const webkassaData = useMemo(
    () => [
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.fiscal_priznak'),
        desc: webkassaTransaction?.CheckNumber || webkassaTransaction?.check_number,
      },
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.address'),
        desc: webkassaTransaction?.Cashbox?.Address || webkassaTransaction?.address,
      },
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.ofd'),
        desc: webkassaTransaction?.Cashbox?.Ofd?.Name || webkassaTransaction?.ofd_name,
      },
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.ofd_host'),
        desc: webkassaTransaction?.Cashbox?.Ofd?.Host || webkassaTransaction?.ofd_host,
      },
    ],
    [webkassaTransaction]
  )

  const webkassaDataBottom = useMemo(
    () => [
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.identity_number'),
        desc: webkassaTransaction?.Cashbox?.IdentityNumber || webkassaTransaction?.identity_number,
      },
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.registration_number'),
        desc: webkassaTransaction?.Cashbox?.RegistrationNumber || webkassaTransaction?.registration_number,
      },
      {
        title: t('menu.settings.shops.shop_create.ripped_paper_check_infos.unique_number'),
        desc: webkassaTransaction?.Cashbox?.UniqueNumber || webkassaTransaction?.cashbox_unique_number,
      },
      {
        title: t('WEBKASSA.KZ'),
        desc: '',
      },
    ],
    [webkassaTransaction]
  )

  const disableDiscountOnGoods = () => {
    const found = cheque?.information_block?.find((el) => el?.id === 'a9944ae2-1893-45ef-ab0c-c1445b5db917')

    return !!found ? found?.is_active === true : true
  }

  const disableSumsOnGoods = () => {
    const found = cheque?.information_block?.find((el) => el?.id === '30e14632-dc10-40a1-b97a-1be73a53054a')

    return !!found ? found?.is_active === true : true
  }

  const disableDiscountOnCheque = () => {
    const found = cheque?.information_block?.find((el) => el?.id === '8f610bdf-f875-4f14-aac7-2ffa0eb5f267')

    return !!found ? found?.is_active === true : true
  }

  const disableSumsOnCheque = () => {
    const found = cheque?.information_block?.find((el) => el?.id === 'bf55661b-b18c-4c15-a806-3bffb50b9001')

    return !!found ? found?.is_active === true : true
  }

  const showGoods = () => {
    const found = cheque?.information_block?.find((el) => el?.id === '1abb2244-b4f3-48a6-8e3a-aa85da72d775')

    return !!found ? found?.is_active === true : true
  }

  const discountValue = useMemo(() => Math.abs(totalPriceWithoutDiscount) - Math.abs(totalPrice), [totalPriceWithoutDiscount, totalPrice])

  const getGiftCardName = (type, code) => {
    return `${t(getGiftCardTitle(type))} ${code}`
  }

  const isExchangeTransaction = (orderItems?.length && returnItems?.length) || !!orderItems?.find((item) => item?.is_returned)

  return (
    <Box className={`${classes.root} ${noSticky ? classes.noSticky : ''}`}>
      <Box width='320px' display='flex' alignItems='center' flexDirection='column' mb={4}>
        {checked && (
          <>
            <Box my={1}>
              <TickOutlinedIcon />
            </Box>
            <Typography variant='h5'>{data?.name || t('menu.settings.shops.shop_create.cheque_type')}</Typography>
          </>
        )}
      </Box>

      <Box className={classes.inner} mx={margin && 4}>
        <Box px={2} py={4}>
          {cheque?.has_logo && (
            <div className={classes.canvasContainer}>
              <Box width={288} height={96} className={classes.canvas}>
                {logo?.value && (
                  <img
                    src={logo?.value}
                    alt=''
                    style={{
                      position: 'relative',
                      top: logo?.y,
                      left: logo?.x,
                      transformOrigin: 'left top',
                      transform: `rotate(${logo?.rotation}deg)`,
                      color: palette.black,
                      width: `${logo?.width}px`,
                      height: `${logo?.height}px`,
                      verticalAlign: 'middle',
                      lineHeight: `${logo?.height}px`,
                    }}
                  />
                )}
              </Box>
            </div>
          )}
          {cheque?.has_information_block && (
            <>
              <div className={classes.border} />
              <Box id='cheque-content' className={classes.content}>
                {webkassaOn && (
                  <p id='webkassa-order-number' className={classes.infoBlockItem}>
                    <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.check_order_number')}</b>
                    <span className={classes.value}>{webkassaTransaction?.CheckOrderNumber}</span>
                  </p>
                )}
                <p id='order-number' className={classes.infoBlockItem}>
                  <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.transaction')}</b>
                  <span className={classes.value}>#{orderNumber}</span>
                </p>
                {webkassaOn && (
                  <>
                    <p id='order-number' className={classes.infoBlockItem}>
                      <b className={classes.bold}>{companyDetails?.data?.legal_name}</b>
                    </p>
                    <p id='order-number' className={classes.infoBlockItem}>
                      <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.inn')}</b>
                      <span className={classes.value}>{shopDetails?.data?.inn}</span>
                    </p>
                  </>
                )}
                {cheque.information_block.map((item, index) => {
                  if (item.is_active) {
                    switch (item.id) {
                      case '07b41bb3-2aee-4d3e-b4c1-e145d48dd65c':
                        return (
                          <p id='inn' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>ИНН: </b>
                            <span className={classes.value}>{shopDetails?.data?.inn}</span>
                          </p>
                        )
                      case '7ab57cd3-eae8-4ef8-ac76-87306421f908':
                        return (
                          <p id='shop-name' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{shopDetails?.data?.name || shop?.name}</b>
                          </p>
                        )
                      case '4dbc9d80-45b7-4abe-8726-61f736bd55d2':
                        return (
                          <p id='date' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.date')}: </b>{' '}
                            <span className={classes.value}>
                              {webkassaTransaction?.DateTime || webkassaTransaction?.date_time
                                ? webkassaTransaction?.DateTime || webkassaTransaction?.date_time
                                : dayjs().tz().format('DD.MM.YYYY, HH:mm:ss')}
                            </span>
                          </p>
                        )
                      case 'fe9b1a27-f46f-4f04-8758-b2a47f952e69':
                        return (
                          <p id='working-hours' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.working_hours')}:</b>{' '}
                            <span className={classes.value}>
                              {`${
                                shopDetails?.data?.working_hours?.[getCurrentWeekDay()]?.start_time ||
                                shop?.data?.working_hours?.[getCurrentWeekDay()].start_time
                              }
                            -
                            ${shopDetails?.data?.working_hours?.[getCurrentWeekDay()]?.end_time || shop?.working_hours?.[getCurrentWeekDay()].end_time}`}
                            </span>
                          </p>
                        )
                      case 'cff3f41d-0661-4623-a97e-851a8dfef40d':
                        return (
                          <p id='seller' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.seller')}:</b>{' '}
                            <span className={classes.value}>
                              {sellers?.length ? sellers?.join(', ') : `${user?.first_name || ''} ${user?.last_name || ''}`}
                            </span>
                          </p>
                        )
                      case '10375cd3-73af-414f-92c8-4bff64503b9d':
                        return (
                          <p id='cashier' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.cashier')}:</b>{' '}
                            {user ? <span className={classes.value}>{`${user?.first_name} ${user?.last_name}`}</span> : ''}
                          </p>
                        )
                      case 'c4183629-4073-4f73-8f10-bddd45bbce82':
                        return (
                          <p id='client' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.client')}:</b>{' '}
                            <span className={classes.value}>{clientName}</span>
                          </p>
                        )
                      case 'c8a08dea-f4cc-45fa-81ef-b71f3968e11f':
                        return (
                          <p id='contacts' className={classes.infoBlockItem} key={index}>
                            <b className={classes.bold}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.contacts')}:</b>{' '}
                            {/* {shop?.phone_numbers?.[0]
                              ? shop?.phone_numbers?.[0]
                              : shopDetails?.data?.phone_numbers?.[0]} */}
                            <span className={classes.value}>{shopDetails?.data?.phone_numbers?.join(', ') || shop?.phone_numbers?.join(', ')}</span>
                          </p>
                        )
                      default:
                        break
                    }
                  }
                })}
              </Box>
            </>
          )}
          <div className={classes.border} />
          {showGoods() &&
            returnItems?.length > 0 &&
            returnItems?.map((item, index) => (
              <Fragment key={index}>
                <Box className={classes.content}>
                  <p id={`return-name-${index}`}>
                    <b className={classes.bold}>
                      {index + 1}. {item?.name}
                    </b>
                  </p>
                  {disableSumsOnGoods() && (
                    <DashedRow
                      id={`return-price-${index}`}
                      rowData={{
                        type: `-${item?.measurement_value} ${item?.product?.measurement_unit?.short_name || t('dashboard.pcs')}
                      x ${item?.price}`,
                        value: `-${numberToPrice(item?.total_price)}`,
                      }}
                    />
                  )}
                  {shopDetails?.data?.nds && +shopDetails?.data?.nds !== 99 ? (
                    <DashedRow
                      rowData={{
                        type: t('components.nds_text', {
                          nds: shopDetails?.data?.nds,
                        }),
                        value: `-${numberToPrice(calculateNDS(item.total_price, shopDetails?.data?.nds))}`,
                      }}
                    />
                  ) : null}
                </Box>
                {(disableSumsOnCheque() || disableDiscountOnCheque() || orderItems?.length > 0) && <div className={classes.border} />}
              </Fragment>
            ))}
          {showGoods()
            ? orderItems?.length > 0
              ? orderItems?.map((item, index) => (
                  <Fragment key={index}>
                    <Box className={classes.content}>
                      <p style={{ width: 300, wordWrap: 'break-word' }} id={`product-name-${index}`}>
                        <b className={classes.bold}>
                          {index + 1}.{' '}
                          {item?.type === 'CERTIFICATE' ||
                          item?.type === 'VOUCHER' ||
                          item?.product?.type === 'CERTIFICATE' ||
                          item?.product?.type === 'VOUCHER'
                            ? getGiftCardName(item?.type || item?.product?.type, item?.barcode || item?.product?.barcode)
                            : item?.name}{' '}
                          {item?.customString}
                        </b>
                      </p>
                      {disableSumsOnGoods() && (
                        <DashedRow
                          id={`product-price-${index}`}
                          crossed={(item?.discount_value || discount?.value) && disableDiscountOnGoods()}
                          rowData={{
                            type: `${item?.measurement_value} ${item?.measurement_unit?.short_name || t('dashboard.pcs')} x ${item?.price || item?.amount}`,
                            value: numberToPrice(item?.price * item?.measurement_value),
                          }}
                        />
                      )}
                      {item?.discount_value && disableDiscountOnGoods() ? (
                        <DashedRow
                          id='discount-value'
                          discount
                          rowData={{
                            type: (
                              <>
                                <FontAwesomeIcon icon={faTag} /> {t('menu.orders.new_order.cart_container.discount')}{' '}
                                {item?.discount_unit === 'PERCENTAGE'
                                  ? item?.discount_value
                                  : 100 - Math.round((item?.total_price / (item?.items_price || item?.price * item?.measurement_value)) * 100)}
                                %{' '}
                              </>
                            ),
                            value: numberToPrice(item?.total_price),
                          }}
                        />
                      ) : null}
                      {shopDetails?.data?.nds && +shopDetails?.data?.nds !== 99 ? (
                        <DashedRow
                          rowData={{
                            type: t('components.nds_text', {
                              nds: shopDetails?.data?.nds,
                            }),
                            value: `${numberToPrice(calculateNDS(item?.price * item.measurement_value, shopDetails?.data?.nds))}`,
                          }}
                        />
                      ) : null}
                    </Box>
                    {(disableSumsOnCheque() || disableDiscountOnCheque()) && <div className={classes.border} />}
                  </Fragment>
                ))
              : viewSample && (
                  <>
                    <Box className={classes.content}>
                      <p>
                        <b className={classes.bold}>1. {`${t('menu.settings.shops.shop_create.ripped_paper_check_infos.product_name') + customString}`}</b>
                      </p>
                      {disableSumsOnGoods() && (
                        <DashedRow
                          rowData={{
                            type: `1 x 100000`,
                            value: `100 000 ${currency()}`,
                          }}
                        />
                      )}
                      {disableDiscountOnGoods() ? (
                        <DashedRow
                          id='discount-value'
                          discount
                          rowData={{
                            type: (
                              <>
                                <FontAwesomeIcon icon={faTag} /> {t('menu.orders.new_order.cart_container.discount')} {50}%{' '}
                              </>
                            ),
                            value: numberToPrice(50000),
                          }}
                        />
                      ) : null}
                    </Box>
                    {(disableSumsOnCheque() || disableDiscountOnCheque()) && <div className={classes.border} />}
                  </>
                )
            : null}
          <Box className={classes.content}>
            {disableDiscountOnCheque() && (
              <DashedRow
                id='subtotal-price'
                rowData={{
                  type: t('menu.settings.shops.shop_create.ripped_paper_check_infos.subtotal'),
                  value: viewSample ? `100 000 ${currency()}` : numberToPrice(totalPriceWithoutDiscount),
                }}
              />
            )}
            {(!!discountValue || viewSample) && disableDiscountOnCheque() && (
              <DashedRow
                id='sale'
                rowData={{
                  type: t('menu.settings.shops.shop_create.ripped_paper_check_infos.sale'),
                  value: viewSample ? `50 000 ${currency()}` : numberToPrice(discountValue),
                }}
              />
            )}
            {(!!salePercentage || viewSample) && !isExchangeTransaction && disableDiscountOnCheque() && (
              <DashedRow
                id='sale-percentage'
                rowData={{
                  type: t('menu.settings.shops.shop_create.ripped_paper_check_infos.sale_percentage'),
                  value: viewSample ? `50 %` : `${salePercentage} %`,
                }}
              />
            )}
            {disableSumsOnCheque() && (
              <DashedRow
                id='total-price'
                main
                rowData={{
                  type: t('menu.settings.shops.shop_create.ripped_paper_check_infos.total'),
                  value: viewSample ? `50 000 ${currency()}` : numberToPrice(totalPrice),
                }}
              />
            )}
            {!viewSample && shopDetails?.data?.nds && +shopDetails?.data?.nds !== 99 ? (
              <DashedRow
                rowData={{
                  type: t('components.nds_text', {
                    nds: shopDetails?.data?.nds,
                  }),
                  value: numberToPrice(calculateNDS(totalPrice, shopDetails?.data?.nds)),
                }}
              />
            ) : null}
            {payments?.map((payment, index) => (
              <DashedRow
                id={`payment-${index}`}
                italic
                rowData={{
                  type: payment?.name,
                  value: numberToPrice(payment?.paid_amount),
                }}
              />
            ))}
            {eposOn && (
              <React.Fragment key={eposOn}>
                <p>
                  <b className={classes.bold}>{t('components.fiscalInfo')}</b>
                </p>
                {eposData.map((item, i) => (
                  <p className={classes.infoBlockItem} key={i}>
                    <span className={classes.value}>{item?.title}</span>
                    <b className={classes.bold}>{item?.desc}</b>
                  </p>
                ))}
                {eposTransaction?.info?.qrCodeURL && (
                  <Box className={classes.qrCode}>
                    <QRCodeSVG value={eposTransaction?.info?.qrCodeURL} />
                  </Box>
                )}
              </React.Fragment>
            )}
            {webkassaOn && (
              <>
                <div className={classes.border} />
                {webkassaData.map((item, i) => (
                  <p className={classes.infoBlockItem} key={i}>
                    <span className={classes.value}>{item?.title}</span>
                    <b className={classes.bold}>{item?.desc}</b>
                  </p>
                ))}
                {webkassaTransaction?.CashboxOfflineMode && (
                  <Box>
                    <span className={classes.italic}>{t(`menu.settings.shops.shop_create.ripped_paper_check_infos.webkassa_offline`)}</span>
                  </Box>
                )}
                <div className={classes.border} />
                <Box display='flex' alignItems='center' flexDirection='column'>
                  <span className={classes.fiscalTitle}>{t('menu.settings.shops.shop_create.ripped_paper_check_infos.fiscal_cheque')}</span>
                  {(webkassaTransaction?.TicketUrl || webkassaTransaction?.ticket_url) && (
                    <Box display='flex' justifyContent='center' mt={1} mb={2}>
                      <QRCodeSVG value={webkassaTransaction?.TicketUrl || webkassaTransaction?.ticket_url} />
                    </Box>
                  )}
                  {webkassaDataBottom.map((item, i) => (
                    <p className={classes.infoBlockItem} key={i}>
                      <span className={classes.value}>{item?.title}</span>
                      <b className={classes.bold}>{item?.desc}</b>
                    </p>
                  ))}
                </Box>
              </>
            )}
          </Box>
          {cheque?.has_lower_block && (
            <>
              <div className={classes.border} />
              <Box className={classes.content}>
                <Box className={classes.socialContainer}>
                  {settings
                    ? cheque?.lower_block?.map((item, index) => {
                        if (item?.is_active) {
                          switch (item?.id) {
                            case 'e28e3891-191f-4bfc-9d43-e7a15aad6a43':
                              return (
                                <p id='social-network-facebook' className={classes.lowerBlockItem} key={index}>
                                  <FontAwesomeIcon icon={faSquareFacebook} size='lg' />
                                  {shopDetails?.data?.facebook || shop?.facebook}
                                </p>
                              )
                            case '5236c6a1-91c6-4e01-872d-50259588532c':
                              return (
                                <p id='social-network-instagram' className={classes.lowerBlockItem} key={index}>
                                  <FontAwesomeIcon className={classes.socialIcon} icon={faInstagram} size='lg' />
                                  {shopDetails?.data?.instagram || shop?.instagram}
                                </p>
                              )
                            case 'f6c04db8-c20d-4c5f-a2cf-7ca35c9a5f25':
                              return (
                                <p id='social-network-telegram' className={classes.lowerBlockItem} key={index}>
                                  <FontAwesomeIcon icon={faTelegram} size='lg' />
                                  {shopDetails?.data?.telegram || shop?.telegram}
                                </p>
                              )
                            case '72407314-caa7-45bc-95d0-f197280d6955':
                              return (
                                <p id='website' className={classes.lowerBlockItem} key={index}>
                                  <FontAwesomeIcon icon={faGlobe} size='lg' />
                                  {shopDetails?.data?.website || shop?.website}
                                </p>
                              )
                            case 'd78d4444-d388-405a-b521-b6683a7fe087':
                              return <ChequeBarcode orderNumber={orderNumber} />
                            default:
                              break
                          }
                        }
                      })
                    : cheque?.lower_block?.map((item, index) => {
                        if (item?.is_active) {
                          switch (item?.id) {
                            case 'e28e3891-191f-4bfc-9d43-e7a15aad6a43':
                              return (
                                <p id='social-network-facebook' className={classes.lowerBlockItem} key={index}>
                                  {(shopDetails?.data?.facebook || shop?.facebook) && <FontAwesomeIcon icon={faSquareFacebook} size='lg' />}
                                  {shopDetails?.data?.facebook || shop?.facebook}
                                </p>
                              )
                            case '5236c6a1-91c6-4e01-872d-50259588532c':
                              return (
                                <p id='social-network-instagram' className={classes.lowerBlockItem} key={index}>
                                  {(shopDetails?.data?.instagram || shop?.instagram) && (
                                    <FontAwesomeIcon className={classes.socialIcon} icon={faInstagram} size='lg' />
                                  )}
                                  {shopDetails?.data?.instagram || shop?.instagram}
                                </p>
                              )
                            case 'f6c04db8-c20d-4c5f-a2cf-7ca35c9a5f25':
                              return (
                                <p id='social-network-telegram' className={classes.lowerBlockItem} key={index}>
                                  {(shopDetails?.data?.telegram || shop?.telegram) && <FontAwesomeIcon icon={faTelegram} size='lg' />}
                                  {shopDetails?.data?.telegram || shop?.telegram}
                                </p>
                              )
                            case '72407314-caa7-45bc-95d0-f197280d6955':
                              return (
                                <p id='website' className={classes.lowerBlockItem} key={index}>
                                  {(shopDetails?.data?.website || shop?.website) && <FontAwesomeIcon icon={faGlobe} size='lg' />}
                                  {shopDetails?.data?.website || shop?.website}
                                </p>
                              )
                            case 'd78d4444-d388-405a-b521-b6683a7fe087':
                              return <ChequeBarcode orderNumber={orderNumber} />
                            default:
                              break
                          }
                        }
                      })}
                </Box>
              </Box>
            </>
          )}
          {settings && <div className={classes.border} />}
          {(shop?.website || shop?.telegram || shop?.instagram || shop?.facebook) && <div className={classes.border} />}
          <p id='thank-text' className={classes.thank}>
            <b className={classes.bold}>{cheque?.display_text}</b>
          </p>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperCheck
