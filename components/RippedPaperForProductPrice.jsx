import { Box, RadioGroup } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import RippedPaperProductPriceCheck from './ChequePaper/RippedPaperProductPriceCheck'
export default function RippedPaperForProductPrice({ data, name = 'cheque_id', control }) {
  return (
    <Box>
      <Controller
        control={control}
        name={name}
        defaultValue={data?.cheques?.[0]?.id}
        render={({ onChange }) => (
          <RadioGroup defaultValue={data?.cheques?.[0]?.id} aria-label='cheque' onChange={(e) => onChange(e.target.value)}>
            <Box>
              <RippedPaperItem data={data} />
            </Box>
          </RadioGroup>
        )}
      />
    </Box>
  )
}

export function RippedPaperItem({ data }) {
  return (
    <Box>
      <RippedPaperProductPriceCheck data={data} />
    </Box>
  )
}
