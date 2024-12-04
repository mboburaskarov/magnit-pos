import { Box, Button, TextField, Typography } from '@mui/material'
import React, { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  textButton: {
    height: '100%',
    padding: '0 16px',
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '600',
    paddingRight: '20px',
    color: theme.palette.orange[500] + ' !important',
    whiteSpace: 'nowrap',
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  white: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))

function InputWithButton({
  name,
  placeholder,
  text,
  handleClick,
  defaultValue,
  required = false,
  type,
  label,
  error,
  disabled,
  fullWidth,
  boxStyle,
  asteriks,
  control,
  buttonId,
  uncontrolled,
  white,
  paddingRight = 0,
  onBlur,
}) {
  const classes = useStyles({ paddingRight })
  const methods = useFormContext()

  return (
    <Box width={fullWidth ? '100%' : 320} className={classes.root} mt={!label && '21px'} {...boxStyle}>
      <Typography className={`${required && label && asteriks ? classes.required : ''}`} variant='h5' mb={!!label ? '4px' : 0}>
        {label}
      </Typography>
      {uncontrolled ? (
        <TextField
          id={name}
          name={name}
          type={type || 'text'}
          variant='outlined'
          placeholder={placeholder}
          fullWidth
          autoComplete='off'
          className={`${classes.input} ${!label && classes.noMargin} ${white ? classes.white : ''} `}
          error={!!error}
          disabled={disabled}
          onBlur={onBlur}
          InputProps={{
            endAdornment: (
              <Button id={buttonId} variant='text' className={classes.textButton} onClick={handleClick}>
                {text}
              </Button>
            ),
          }}
        />
      ) : (
        <Controller
          name={name}
          as={
            <TextField
              id={name}
              name={name}
              type={type || 'text'}
              variant='outlined'
              placeholder={placeholder}
              fullWidth
              autoComplete='off'
              className={white ? classes.white : ''}
              error={!!error}
              disabled={disabled}
              onBlur={onBlur}
              InputProps={{
                endAdornment: (
                  <Button id={buttonId} variant='text' className={classes.textButton} onClick={handleClick}>
                    {text}
                  </Button>
                ),
              }}
            />
          }
          rules={{
            required,
          }}
          control={methods.control}
          defaultValue={defaultValue ?? ''}
        />
      )}
    </Box>
  )
}

export default memo(InputWithButton)
