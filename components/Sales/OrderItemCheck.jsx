import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { numberToPrice } from '../../utils/numberToPrice'
import { colors } from '../../utils/getColors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTag } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '16px 24px',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.gray[100],
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all .2s',
    '& button': {
      border: 0,
      outline: 0,
      background: 'transparent',
      cursor: 'pointer',
      padding: 2,
    },
    '&:hover': {
      background: theme.palette.gray[101],
    },
  },
  content: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  details: {
    display: 'flex',
    alignItems: 'center',
  },
  quantity: {
    height: 40,
    width: 40,
    borderRadius: '50%',
    background: theme.palette.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    color: theme.palette.blue[500],
  },
  name: {
    margin: 0,
    marginBottom: 4,
    wordBreak: 'break-all',
  },
  articul: {
    margin: 0,
    color: theme.palette.gray[400],
    '& span': {
      color: theme.palette.gray[400],
    },
    '& span:nth-of-type(2)': {
      color: theme.palette.gray[400],
      margin: '0 4px',
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
    color: theme.palette.blue[500],
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    '& svg': {
      marginBottom: -3,
      marginLeft: 4,
    },
  },
  newPrice: {
    display: 'block',
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 600,
    color: theme.palette.red[500],
  },
  oldPrice: {
    display: 'block',
    marginTop: 4,
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 600,
    textDecoration: 'line-through',
    color: theme.palette.gray[400],
  },
  seller: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    '& span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
    },
  },
  text_xira: {
    color: theme.palette.gray[400],
  },
  discount_type: {
    marginTop: 4,
    color: theme.palette.red[500],
    '&::before': {
      content: '/f02b',
    },
  },
  checkbox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 22,
    minWidth: 22,
    marginRight: 24,
    border: `2px solid ${theme.palette.gray[400]}`,
    borderRadius: 4,
    color: theme.palette.gray[100],
    transition: 'all .2s',
    '&.checked': {
      backgroundColor: theme.palette.blue[600],
      borderColor: theme.palette.blue[600],
      color: '#fff',
    },
  },
}))

export default function OrderItemCheck({ data, items, setItems, selection = true, isPayme }) {
  const cls = useStyles()
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()

  const handleAddItems = () => {
    if (checked) {
      const newItems = items.filter((item) => item.id !== data.id)
      setItems(newItems)
    } else {
      setItems([
        ...items,
        {
          ...data,
          measurement_value: data.measurement_value,
        },
      ])
    }
  }

  useEffect(() => {
    const foundItem = items.find((item) => item.id === data.id)
    setChecked(!!foundItem)
  }, [data, items])

  const calculated_total_price = useMemo(
    () =>
      (data?.total_price / (data?.measurement_value < 0 ? data?.returned_measurement_value : data?.measurement_value + data?.returned_measurement_value)) *
      (data?.measurement_value <= 0 ? data?.returned_measurement_value : data?.measurement_value),
    [data]
  )

  return (
    <Box className={cls.root} onClick={selection && !isPayme && handleAddItems}>
      <Box className={cls.content}>
        <Box className={cls.details}>
          {selection && (
            <div className={`${cls.checkbox} ${checked ? 'checked' : ''}`}>
              <FontAwesomeIcon icon={faCheck} />
            </div>
          )}
          <Box className={cls.text} maxWidth={320}>
            <Typography className={cls.name}>
              {`${data.measurement_value} ${
                data?.product?.measurement_unit?.short_name ? data?.product?.measurement_unit?.short_name : data?.product?.measurement_unit?.name || ''
              }`}
              <span className={cls.text_xira}> x </span>
              {data.product.name}
            </Typography>
            <Typography className={cls.articul}>
              <span>{data.product.sku}</span>
              <span>/</span>
              <span>{data.product.barcode}</span>
            </Typography>
            {data.discount_value !== 0 && (
              <Typography className={cls.discount_type}>
                <FontAwesomeIcon icon={faTag} />
                <span style={{ marginLeft: 8 }}>{t('menu.orders.all.manual')}</span>
              </Typography>
            )}
          </Box>
        </Box>
        <Box className={cls.actions}>
          <Box className={cls.left}>
            <Box width='100%' textAlign='right'>
              {!!data.discount_value && <span className={cls.newPrice}>{numberToPrice(calculated_total_price)}</span>}

              <Typography component='span' className={data.discount_value ? cls.oldPrice : ''}>
                {numberToPrice(data.discount_value ? data.price * data?.measurement_value : calculated_total_price)}
              </Typography>
            </Box>
            {data.sellers?.length > 0 &&
              data.sellers.map((item, index) => (
                <Box className={cls.seller} key={index}>
                  <span style={{ background: colors[index] }} />
                  <Typography component='h5'>{item.seller.name}</Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
