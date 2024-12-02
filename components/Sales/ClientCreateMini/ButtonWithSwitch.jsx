import React from 'react'
import { Controller } from 'react-hook-form'
import { Box, Typography } from '@mui/material'
import StyledSwitch from '../../Inputs/InputSwitch'

const ButtonWithSwitch = ({ title, control, defaultValue, name }) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.gray[100],
        width: '182px',
        height: '56px',
        borderRadius: '16px',
        marginRight: '16px',
        padding: '0px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      <Typography
        sx={{
          fontSize: '16px',
        }}
      >
        {title}
      </Typography>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ onChange, value }) => (
          <StyledSwitch
            checked={value}
            defaultValue
            id={name}
            onChange={(e) => onChange(e.target.checked)}
            sx={() => ({
              width: 36,
              height: 24,
              '& .MuiButtonBase-root': {
                transform: 'translateX(3px)',
              },
              '& .Mui-checked': {
                transform: 'translateX(15px)',
              },

              '& .MuiSwitch-thumb': {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                marginTop: '3px',
              },
            })}
          />
        )}
      />
    </Box>
  )
}

export default ButtonWithSwitch
