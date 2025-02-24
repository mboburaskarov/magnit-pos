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
  },
}))

export default function RippedPaperList({
  cashBoxDetails,
  printContainer,
  customerId,
  paymentsList,
  cartItemsList,
  defaultValue,
  data,
  name = 'cheque_id',
  control,
  shop,
}) {
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
                <RippedPaperItem
                  customerId={customerId}
                  cashBoxDetails={cashBoxDetails}
                  paymentsList={paymentsList}
                  shop={shop}
                  data={el}
                  key={index}
                  cartItemsList={cartItemsList}
                />
              ))}
            </Box>
          </RadioGroup>
        )}
      />
    </Box>
  )
}

export function RippedPaperItem({ qrcodeUrl, printContainer, cashBoxDetails, customerId, paymentsList, cartItemsList }) {
  const classes = useStyles()

  return (
    <Box px={2} className={classes.wrapper}>
      <RippedPaperCheck
        qrcodeUrl={qrcodeUrl}
        customerId={customerId}
        cashBoxDetails={cashBoxDetails}
        cartItemsList={cartItemsList}
        paymentsList={paymentsList}
      />
    </Box>
  )
}
