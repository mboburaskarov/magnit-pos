import React, { useEffect, useState } from 'react'
import { Box, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { Controller } from 'react-hook-form'
import TickOutlinedIcon from '../src/assets/icons/BigTickIcon'
import RippedPaperCheck from './ChequePaper/RippedPaperCheck'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  inner: {
    display: 'flex',
    overflowX: 'scroll',
    overflowY: 'hidden',
    flexDirection: 'row',
    padding: '32px 0',
    width: '59vw',
    // transform: 'rotateX(180deg)',
    '&::-webkit-scrollbar': {
      background: theme.palette.gray[200],
      borderRadius: 16,
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.blue[600],
      borderRadius: 16,
      height: 8,
    },
  },
  radio_icon: {
    height: '16px',
    borderRadius: '50%',
    display: 'inline-block',
    width: '16px',
    border: `2px solid ${theme.palette.gray[400]}`,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
  },
  wrapper: {
    width: '100%',
    // transform: 'rotateX(180deg)',
  },
}))

export default function RippedPaperList({ defaultValue, data, name = 'cheque_id', control, shop }) {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || data?.cheques?.[0]?.id}
        render={({ onChange }) => (
          <RadioGroup defaultValue={defaultValue || data?.cheques?.[0]?.id} aria-label='cheque' onChange={(e) => onChange(e.target.value)}>
            <Box className={classes.inner}>
              {data?.cheques?.map((el, index) => (
                <RippedPaperItem shop={shop} data={el} key={index} />
              ))}
            </Box>
          </RadioGroup>
        )}
      />
    </Box>
  )
}

function StyledRadio(props) {
  const classes = useStyles()

  return <Radio disableRipple color='default' checkedIcon={<TickOutlinedIcon />} icon={<span className={classes.radio_icon} />} {...props} />
}

export function RippedPaperItem({
  data,
  checked,
  noFormControl,
  orderItems,
  totalPrice,
  totalPriceWithoutDiscount,
  refContainer,
  id,
  shop,
  user,
  sellers,
  returnItems,
  clientName,
  orderNumber,
  discount,
  eposTransaction,
  webkassaTransaction,
  eposOn,
  webkassaOn,
  debt,
}) {
  const classes = useStyles()
  const [chequeItems, setChequeItems] = useState([])
  const [informationBlock, setInformationBlock] = useState([])
  const [items, setItems] = useState([])
  const [lowerBlock, setLowerBlock] = useState([])
  const [cheque, setCheque] = useState({})
  useEffect(() => {
    if (data?.cheque_items) {
      const cheque_items = data?.cheque_items?.map((item) => ({
        block_type: item.cheque_option.block_type,
        id: item.cheque_option_id,
        product_characteristic_id: item?.product_characteristic_id,
        is_active: item.is_active,
        name: item.id,
        sequence_number: item.sequence_number,
      }))
      setChequeItems(cheque_items)
    }
  }, [data])

  useEffect(() => {
    const information_block = chequeItems?.filter((item) => item.block_type === 'information_block')
    const lower_block = chequeItems?.filter((item) => item.block_type === 'lower_block')
    const has_additional_info = chequeItems?.filter((item) => item.product_characteristic_id)
    const getValue = (item, field) => item?.custom_fields?.find((el) => el?.custom_field_id === field?.product_characteristic_id)?.custom_field_value

    if (has_additional_info?.length) {
      const products = orderItems?.map((item) => {
        let str = ''
        has_additional_info.forEach((field) => {
          if (getValue(item, field)) str += ` / ${getValue(item, field)}`
        })

        return {
          ...item,
          customString: str,
        }
      })
      setItems(products)
    }
    setInformationBlock(information_block)
    setLowerBlock(lower_block)
  }, [chequeItems, orderItems])
  useEffect(() => {
    const chequeData = {
      display_text: data?.display_text,
      has_additional_info: data?.has_additional_info,
      has_information_block: data?.has_information_block,
      has_logo: data?.has_logo,
      has_lower_block: data?.has_lower_block,
      information_block: informationBlock,
      lower_block: lowerBlock,
      name: data?.name,
    }
    setCheque(chequeData)
  }, [informationBlock, lowerBlock, data])

  return (
    <Box px={2} className={classes.wrapper} id={id} ref={refContainer}>
      {!noFormControl && <FormControlLabel value={data?.id} control={<StyledRadio />} label={data?.name} className={classes.label} checked={checked} />}
      <RippedPaperCheck
        data={data}
        chequeData={cheque}
        logo={{
          value: data?.logo_url,
          rotation: data?.rotation,
          width: data?.width,
          height: data?.length,
          x: data?.x_axis,
          y: data?.y_axis,
        }}
        noSticky
        orderItems={items?.length ? items : orderItems}
        totalPrice={totalPrice}
        totalPriceWithoutDiscount={totalPriceWithoutDiscount}
        shop={shop}
        user={user}
        debt={debt}
        sellers={sellers}
        returnItems={returnItems}
        clientName={clientName}
        orderNumber={orderNumber}
        discount={discount}
        eposTransaction={eposTransaction}
        webkassaTransaction={webkassaTransaction}
        eposOn={eposOn}
        webkassaOn={webkassaOn}
      />
    </Box>
  )
}
