import React, { useCallback, useState, useEffect } from 'react'
import { InputAdornment, Button, TextField, Box } from '@mui/material'
import * as qs from 'qs'
import SearchIcon from '../../src/assets/icons/SearchIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import UserFilledIcon from '../../src/assets/icons/UserFilledIcon'
import ShortcutWrapper from './ShortcutWrapper'
import { useTranslation } from 'react-i18next'
import useDebouncedValue from '../../src/hooks/useDebouncedValue'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import GiftCardIcon from '../../src/assets/icons/BigTickIcon'

const useStyles = makeStyles((theme) => ({
  input: {
    position: 'relative',
    height: 56,
    margin: 0,
    borderRadius: 16,
    width: ({ maxWidth }) => maxWidth,
    // backgroundColor: theme.palette.gray[100],
    color: theme.palette.gray[400],
    '&:hover': {
      // backgroundColor: theme.palette.gray[101],
    },
    '& .MuiOutlinedInput-input': {
      padding: '15.5px 14px',
    },
    '& .Mui-error:not(.Mui-focused)': {
      border: `3px solid ${theme.palette.red[500]}`,
    },
  },
  resetIcon: {
    position: 'absolute',
    right: '1rem',
    color: theme.palette.gray[400],
    '& button:hover': {
      cursor: 'pointer',
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
  giftCardButton: {
    position: 'absolute',
    zIndex: 20,
    right: `-2px`,
    borderRadius: '0px 16px 16px 0px',
    borderLeft: `2px solid ${theme.palette.gray[200]}`,
  },
  focused: {
    borderLeft: `3px solid #4993DD`,
  },
}))

const SearchInput = ({
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
  client,
  maxWidth,
  adornmentTextHotKey,
  noIcon,
  disabled,
  uncontrolled,
  timeout = 200,
  handleClickGiftCards,
  onFocus,
  error,
  ...rest
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const classes = useStyles({ maxWidth, handleClickGiftCards })
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue, debouncedValue] = useDebouncedValue(values?.search || '', timeout)

  useEffect(() => {
    const searchParams = qs.stringify(
      {
        ...values,
        page: 1,
        search: debouncedValue || undefined,
      },
      { addQueryPrefix: true }
    )
    navigate(`${location.pathname}${searchParams}`)
  }, [debouncedValue])

  const handleFocusChange = useCallback(() => {
    setIsFocused((prev) => !prev)
  }, [])

  return (
    <Box position='relative' display='flex' width='100%'>
      <TextField
        id={name}
        variant='outlined'
        placeholder={t(placeholder)}
        fullWidth={fullWidth || false}
        className={`${classes.input} ${white ? classes.white : ''}`}
        onChange={(e) => (uncontrolled ? setValue(e.target.value) : onChange(e))}
        onFocus={() => {
          handleFocusChange()
          if (onFocus) {
            onFocus()
          }
        }}
        error={error}
        onBlur={handleFocusChange}
        disabled={disabled}
        {...(!noIcon && {
          InputProps: {
            startAdornment: <InputAdornment position='start'>{client ? <UserFilledIcon /> : icon || <SearchIcon />}</InputAdornment>,
            endAdornment: (
              <InputAdornment position='end'>
                {value || searchTerm ? (
                  <div className={classes.resetIcon}>
                    {adornmentText ? <span>{adornmentText}</span> : ''}
                    <button type='button' onClick={() => (uncontrolled ? setValue('') : setSearchTerm(''))}>
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                ) : (
                  adornmentTextHotKey && (
                    <div className={classes.inputEndText}>
                      <span className={classes.lastText}>{adornmentTextHotKey}</span>
                      <span>
                        <ShortcutWrapper shortcut='/' />
                      </span>
                    </div>
                  )
                )}
              </InputAdornment>
            ),
          },
        })}
        onKeyDown={(e) => {
          if (e.keyCode === 27) e.target.blur()
          if (onKeyDown) {
            onKeyDown(e)
          }
        }}
        value={uncontrolled ? value : searchTerm}
        inputRef={inputRef}
        {...rest}
      />
      {handleClickGiftCards && (
        <Button
          id='gift-card-button'
          onClick={handleClickGiftCards}
          height={56}
          secondary
          icon
          className={`${classes.giftCardButton} ${isFocused && classes.focused}`}
        >
          <Box py={2} px='21px'>
            <GiftCardIcon />
          </Box>
        </Button>
      )}
    </Box>
  )
}

export default SearchInput
