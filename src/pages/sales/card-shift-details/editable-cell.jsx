import React, { memo, useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import PriceFormattedInput from '../../../../components/Inputs/PhoneNumber'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  textfield: {
    zIndex: 2,
    '& .MuiTextField-root': {
      margin: 0,
      height: 40,
      width: ({ width }) => (width ? '100%' : 158),
    },

    '& .MuiOutlinedInput-root': {
      margin: 0,
      height: 40,
      background: theme.palette.background.default,
      border: `1px solid ${theme.palette.gray[300]}`,
      borderRadius: 16,
      '&:focus-within': {
        border: `1px solid ${theme.palette.blue[500]}`,
        boxShadow: `0 0 0 2px ${theme.palette.blue[500]} !important`,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 0px 12px 14px',
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: ({ adornmentClassName }) => (adornmentClassName ? '4px' : '14px'),
    },
  },
  error: {
    '& .MuiOutlinedInput-root': {
      border: `1px solid ${theme.palette.red[500]}`,
      boxShadow: `0 0 0 2px ${theme.palette.red[500]} !important`,
    },
  },
  active: {
    '& .MuiOutlinedInput-root': {
      border: `1px solid ${theme.palette.blue[500]} !important`,
      boxShadow: `0 0 0 2px ${theme.palette.blue[500]} !important`,
    },
  },
  dashed: {
    '& .MuiInputBase-root.Mui-disabled': {
      color: ({ info }) => info && '#6F6F6F !important',
    },
    '& .MuiInputBase-root': {
      '& > input': {
        '&::placeholder': {
          color: ({ info }) => info && '#6F6F6F !important',
          opacity: ({ info }) => info && 1,
        },
      },
    },

    // Dashed

    '& .MuiInputBase-input': {
      color: ({ overall }) => overall && '#fff !important',
    },

    '& .MuiTypography-root': {
      color: ({ overall }) => overall && '#fff !important',
    },
    '& .MuiOutlinedInput-root': {
      background: 'transparent',
      border: ({ gray }) => (gray ? `1px dashed ${theme.palette.gray[300]}` : `1px dashed ${theme.palette.blue[400]}`),
    },
  },
  fakeplace: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,

    zIndex: 1,
  },
}))

const EditableCell = ({
  adornment,
  marginRight,
  dashed,
  gray,
  width,
  adornmentClassName = '',
  name,
  row,
  column,
  updateMyData,
  valuecustom,
  overall,
  info,
  isError,
}) => {
  const id = column?.id
  const index = row?.index
  const classes = useStyles({ gray, width, adornmentClassName, overall, info })
  const [value, setValue] = useState(document.getElementById(`${id}-${index}-${name}`)?.value)

  const onBlur = (e) => {
    const inputValue = e.target.value
    setValue(inputValue)

    const formatted = typeof inputValue !== 'number' ? Number(inputValue?.replace(/\s/g, '')) : 0

    if (updateMyData) {
      setTimeout(() => updateMyData(index, id, formatted), 10)
    }
  }

  const onKeyDown = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault()
      setTimeout(() => {
        document.getElementById(`${id}-${index + 1}-${name}`).focus()
      }, 10)
    }
  }

  const onFocus = () => {
    setTimeout(() => {
      document.getElementById(`${id}-${index}-${name}`).focus()
    }, 10)
  }

  return (
    <>
      <Box
        className={`${classes.textfield} ${isError && document.getElementById(`${id}-${index}-${name}`)?.value === '' && classes.error} ${
          dashed && classes.dashed
        }`}
        mr={marginRight ? 1 : 0}
        width={width}
      >
        <TextField
          id={`${id}-${index}-${name}`}
          name={`${id}-${index}-${name}`}
          type='tel'
          disabled={!!dashed}
          variant='outlined'
          fullWidth
          placeholder='0'
          value={valuecustom ?? value}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          InputProps={{
            endAdornment: (
              <InputAdornment sx={{ pr: 1 }} className={adornmentClassName} position='end'>
                {adornment}
              </InputAdornment>
            ),
            inputComponent: PriceFormattedInput,
          }}
        />
      </Box>
    </>
  )
}

export default memo(EditableCell)
