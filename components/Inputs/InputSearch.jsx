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
      // backgroundColor: '#fe9000 !important',
    },
    '& .MuiOutlinedInput-root': {
      border: `2px solid transparent`,
      '&:hover': {
        backgroundColor: `${theme.palette.gray[101]} !important`,
      },
    },

    '& .MuiInputBase-root:hover': {
      // backgroundColor: '#fe5000 !important',
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
  useHotkeys('F3', (event) => {
    myref.current.focus()
  })

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
                    <Typography mr={'10px'} color={'bunker.300'} fontWeight={'600'} fontSize={'16px'} display={'flex'}>
                      Нажмите
                      <Box
                        sx={{
                          color: '#bdbdbd',
                          border: '2px solid #cfcfcf',
                          height: '24px',
                          display: 'flex',
                          padding: '2px',
                          ml: '5px',
                          minWidth: '24px',
                          alignItems: 'center',
                          borderRadius: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        /
                      </Box>
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
