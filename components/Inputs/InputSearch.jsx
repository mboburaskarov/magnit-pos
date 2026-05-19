/* eslint-disable react-hooks/exhaustive-deps */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import * as qs from 'qs'
import { useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '../../src/assets/icons/SearchIcon'
import useDebouncedValue from '../../src/hooks/useDebouncedValue'
import { useQueryParams } from '../../src/hooks/useQueryParams'

const useStyles = makeStyles((theme) => ({
  input: {
    position: 'relative',
    margin: 0,
    borderRadius: '8px !important',
    width: ({ maxWidth }) => maxWidth,
    backgroundColor: '#ffffff !important',
    color: '#111111 !important',
    border: '1px solid #E5E7EB !important',

    '& svg > path': {
      fill: theme.palette.bunker[400],
    },
    '&:hover': {
      // backgroundColor: '#fe9000 !important',
    },
    '& .MuiOutlinedInput-root': {
      border: 'none !important',
      backgroundColor: '#ffffff !important',
      height: '38px !important',
      borderRadius: '8px !important',

      '&:hover': {
        backgroundColor: `#ffffff !important`,
      },
    },

    '& .MuiInputBase-root': {
      height: '38px !important',
      backgroundColor: '#ffffff !important',
      borderRadius: '8px !important',
      fontSize: '14px !important',
      fontWeight: '500 !important',
      color: '#111111 !important',
      boxSizing: 'border-box !important',
    },

    '& .MuiInputBase-input::placeholder': {
      color: '#bdbdbd !important',
      fontSize: '14px !important',
      fontWeight: '400 !important',
      opacity: 1,
      lineHeight: '24px',
    },
    '& .Mui-error:not(.Mui-focused)': {
      border: `2px solid ${theme.palette.red[500]}`,
    },
    '& input': {
      fontSize: '14px !important',
      fontWeight: '500 !important',
      color: '#111111 !important',
      // height: '40px !important',
      padding: '0 14px !important',
      boxSizing: 'border-box !important',
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
    backgroundColor: '#ffffff !important',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff !important',
      boxShadow: 'none !important',
    },
  },
  gray: {
    backgroundColor: '#ffffff !important',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff !important',
      boxShadow: 'none !important',
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
  hasShortCut = false,
  error,
  ...rest
}) => {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const classes = useStyles({ maxWidth, handleClickGiftCards })
  const myref = inputRef || useRef(null)
  const [value, setValue, debouncedValue] = useDebouncedValue(values?.search || '', timeout)

  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      // Skip the first render
      hasMounted.current = true
      return
    }

    const searchParams = qs.stringify({ ...values, search: debouncedValue || undefined }, { addQueryPrefix: true })
    navigate(`${location.pathname}${searchParams}`)
  }, [debouncedValue])
  useHotkeys(
    ['F3', 'alt'],
    (event) => {
      myref.current.focus()
    },
    {
      preventDefault: true,
    },
  )

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
              <InputAdornment position='start'>
                {value || searchTerm ? (
                  <div className={classes.resetIcon}>
                    {adornmentText ? <span>{adornmentText}</span> : ''}
                    <button type='button' onClick={() => (uncontrolled ? setValue('') : setSearchTerm(''))}>
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                ) : (
                  hasShortCut && (
                    <Typography
                      sx={{
                        backgroundColor: '#fff',
                        color: '#bdbdbd',
                        border: '1px solid #cfcfcf',
                        height: '20px',
                        mr: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        lineHeight: '16px',
                        display: 'flex',
                        ml: '5px',
                        width: '20px',
                        alignItems: 'center',
                        borderRadius: '4px',
                        justifyContent: 'center',
                      }}
                    >
                      /
                    </Typography>
                  )
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
        inputRef={myref}
        {...rest}
      />
    </Box>
  )
}

export default InputSearch
