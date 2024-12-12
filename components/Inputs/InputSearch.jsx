/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { InputAdornment, Box, TextField } from '@mui/material'
import * as qs from 'qs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import useDebouncedValue from '../../src/hooks/useDebouncedValue'
import SearchIcon from '../../src/assets/icons/SearchIcon'

const useStyles = makeStyles((theme) => ({
  input: {
    position: 'relative',
    height: 48,
    margin: 0,
    borderRadius: '50px',
    width: ({ maxWidth }) => maxWidth,
    backgroundColor: theme.palette.gray[100],
    color: theme.palette.gray[400],
    '& svg > path': {
      fill: theme.palette.bunker[400],
    },
    '&:hover': {
      backgroundColor: theme.palette.gray[101],
    },
    '& .MuiOutlinedInput-root': {
      // padding: '15.5px 5px',
      border: `2px solid transparent`,
    },
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.bunker[400], // Change placeholder color
      fontSize: '18px', // Adjust font size
      opacity: 1,
      lineHeight: '24px',
    },
    '& .Mui-error:not(.Mui-focused)': {
      border: `2px solid ${theme.palette.red[500]}`,
    },
  },
  resetIcon: {
    position: 'absolute',
    right: '1rem',
    color: theme.palette.gray[400],
    '& button:hover': {
      cursor: 'pointer',
      color: theme.palette.red[500],
    },
    '& button': {
      backgroundColor: 'transparent',
      border: 0,
      color: theme.palette.gray[400],
    },
    '& span': {
      marginRight: 10,
    },
  },
  white: {
    backgroundColor: theme.palette.background.default,
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.default,
      boxShadow: `inset 0 0 0 1px ${theme.palette.gray[300]}`,
    },
  },
  gray: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.gray,
    },
  },
  inputEndText: {
    position: 'absolute',
    right: ({ handleClickGiftCards }) => (handleClickGiftCards ? '5rem' : '1rem'),
    color: theme.palette.gray[400],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'spaceBetween',
    flexDirection: 'row',
  },
  lastText: {
    marginRight: '8px',
  },
}))

const InputSearch = ({
  name,
  placeholder,
  fullWidth,
  onChange,
  onKeyDown,
  value: searchTerm,
  setSearchTerm,
  icon,
  white,
  inputRef,
  adornmentText,
  maxWidth,
  noIcon,
  disabled,
  uncontrolled,
  timeout = 200,
  handleClickGiftCards,
  onFocus,
  error,
  ...rest
}) => {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const classes = useStyles({ maxWidth, handleClickGiftCards })
  const [value, setValue, debouncedValue] = useDebouncedValue(values?.search || '', timeout)

  useEffect(() => {
    const searchParams = qs.stringify({ ...values, offset: 0, search: debouncedValue || undefined }, { addQueryPrefix: true })
    navigate(`${location.pathname}${searchParams}`)
  }, [debouncedValue])

  return (
    <Box position='relative' display='flex' width='100%'>
      <TextField
        id={name}
        variant='outlined'
        placeholder={placeholder}
        fullWidth={fullWidth || false}
        className={`${classes.input} ${white ? classes.white : classes.gray}`}
        onChange={(e) => (uncontrolled ? setValue(e.target.value) : onChange(e))}
        onFocus={() => {
          if (onFocus) onFocus()
        }}
        error={error}
        disabled={disabled}
        {...(!noIcon && {
          InputProps: {
            startAdornment: <InputAdornment position='start'>{icon || <SearchIcon />}</InputAdornment>,
            endAdornment: (
              <InputAdornment position='absolute'>
                {(value || searchTerm) && (
                  <div className={classes.resetIcon}>
                    {adornmentText ? <span>{adornmentText}</span> : ''}
                    <button type='button' onClick={() => (uncontrolled ? setValue('') : setSearchTerm(''))}>
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                )}
              </InputAdornment>
            ),
          },
        })}
        onKeyDown={(e) => {
          if (e.keyCode === 27) e.target.blur()
          if (onKeyDown) onKeyDown(e)
        }}
        value={uncontrolled ? value : searchTerm}
        inputRef={inputRef}
        {...rest}
      />
    </Box>
  )
}

export default InputSearch
