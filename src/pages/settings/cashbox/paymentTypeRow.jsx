import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import StyledSwitch from '../../../../components/Switch/StyledSwitch'
import { get } from 'lodash'

function PaymentTypeRow({ type, setPaymentTypes }) {
  const [disabled, setDisabled] = useState(get(type, 'is_active'))

  return (
    <Box key={type?.id} sx={{ pt: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: '16px', fontWeight: '600', color: 'bunker.500' }}>{get(type, 'name')}</Typography>
      <StyledSwitch
        checked={disabled}
        onChange={() => {
          setDisabled((old) => !old)
          setPaymentTypes((old) => old.map((i) => (i?.id == type?.id ? { ...i, is_active: !old.is_active } : { ...i })))
        }}
        name={'f'}
      />
    </Box>
  )
}

export default PaymentTypeRow
