import { useState } from 'react'
import { Box, Typography, TextField, InputAdornment, ClickAwayListener, useTheme } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import { faCalendarAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { makeStyles } from '@mui/styles'
import DeleteSmallIcon from '../../src/assets/icons/DeleteSmallIcon'
import Label from '../Label'
import CalendarIcon from '../../src/assets/icons/CalendarIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    color: theme.palette.gray[600],

    '& .MuiOutlinedInput-root': {
      backgroundColor: ({ disabled }) => disabled && theme.palette.background.default,
      border: ({ disabled, dashed }) => disabled && `2px ${dashed ? 'dashed' : 'solid'} ${theme.palette.gray[200]}`,
      borderRadius: ({ customRadius }) => (customRadius ? customRadius : null),
      '& > input': {
        '-webkit-text-fill-color': theme.palette.gray[600] + ' !important',
      },
    },
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  noMargin: {
    margin: 0,
  },
  clearButton: {
    cursor: 'pointer',
    background: 'transparent',
    border: 0,
  },
  dropdownButton: {
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 600,
    color: theme.palette.gray[600],
    top: '-32px',
    right: '45px',
    '& svg': {
      color: theme.palette.gray[400],
      marginLeft: 8,
    },
  },
  dropdownPopper: {
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 600,
    color: theme.palette.gray[600],
    top: '-32px',
    right: '0px',
    '& svg': {
      color: theme.palette.gray[400],
      marginLeft: 8,
    },
    '& h5': {
      color: theme.palette.gray[400],
      marginBottom: 0,
    },
  },
  dropdown: {
    overflowY: 'auto',
    zIndex: 999,
    left: '2px',
    backgroundColor: theme.palette.background.default,
  },
  month: {
    fontFamily: 'Inter',
    fontWeight: 600,
    padding: 14,
    cursor: 'pointer',
    color: theme.palette.black,
    '&:hover': {
      backgroundColor: theme.palette.gray[100],
    },
  },
  time_block: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      width: 114,
      height: 56,
    },
    '& > span': {
      width: 4,
      color: theme.palette.gray[400],
      margin: '0 8px',
    },
  },
  line: {
    height: 3,
    backgroundColor: theme.palette.gray[200],
    width: 320,
    position: 'absolute',
    left: -32,
    top: -24,
  },
  popper: {
    overflowY: 'auto',
    zIndex: 999,
    backgroundColor: theme.palette.background.default,
    paddingTop: '8px !important',
  },
  typeItem: {
    height: 56,
    padding: '8px 32px 8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.gray[100],
    },
  },
}))

const currentYear = new Date().getFullYear()
const fromMonth = new Date(currentYear - 3, 11)
const toMonth = new Date(currentYear + 5, 0)

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

export const YearMonthFormNew = ({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
  const classes = useStyles()
  const { palette } = useTheme()
  const [open, setOpen] = useState(false)
  const newMonths = dayjs.months().map((item) => item[0].toUpperCase() + item.slice(1))

  const years = []

  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i)
  }

  const dateName = newMonths[date?.getMonth()] + ' ' + date?.getFullYear()

  return (
    <>
      <button type='button' onClick={decreaseMonth} className='react-datepicker__navigation react-datepicker__navigation--previous'>
        <span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--previous' />
      </button>
      <button type='button' onClick={increaseMonth} className='react-datepicker__navigation react-datepicker__navigation--next'>
        <span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--next' />
      </button>
      <div className='react-datepicker__current-month'>{dateName}</div>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box position='relative'>
          <Box
            className={classes.dropdownButton}
            position='absolute'
            zIndex={10}
            display='flex'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            fontFamily='Gilroy-SemiBold'
            onClick={() => setOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          </Box>
          <Box
            display={open ? 'block' : 'none'}
            position='absolute'
            className={classes.dropdown}
            width='100%'
            height={240}
            boxShadow={palette.boxShadow['16-8']}
            borderRadius={8}
            py={1.5}
          >
            {years.map((year) =>
              newMonths.map((month) => {
                const date = month + ' ' + year
                return (
                  <Box
                    key={date}
                    display='flex'
                    alignItems='center'
                    width='100%'
                    p={3}
                    color='#6F6F6F'
                    fontSize={16}
                    lineHeight='19px'
                    className={classes.month}
                    onClick={() => {
                      changeMonth(newMonths.indexOf(month))
                      changeYear(year)
                      setOpen((prev) => !prev)
                    }}
                  >
                    {date}
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      </ClickAwayListener>
    </>
  )
}

const CustomTimeInput = ({ date, onChange }) => {
  const classes = useStyles()
  const diff = (+dayjs().format('HH') - +dayjs().tz().format('HH')) * 3600000
  const isFuture = dayjs(date).startOf('minute').diff(dayjs().tz().startOf('minute')) + diff > 0
  const value =
    date instanceof Date && !isNaN(date)
      ? // Getting time from Date because `value` comes here without seconds
        date.toLocaleTimeString('it-IT')
      : ''

  // useEffect(() => {
  //   if (isFuture) {
  //     error('toast.error.future_time')
  //     onChange(`${dayjs().tz().hour()}:${dayjs().tz().minute()}`)
  //   }
  // }, [isFuture])

  const [hh, mm, ss] = value.split(':')

  return (
    <>
      <Box className={classes.line} />
      <Box className={classes.time_block}>
        <Box>
          <TextField
            name={`hour`}
            value={hh}
            placeholder={'menu.clients.new.HH'}
            fullWidth
            uncontrolled
            noMarginTop
            type='number'
            centered
            onChange={(e) => {
              if (Number(e.target.value) <= 23) onChange(`${e.target.value}:${mm}`)
            }}
          />
        </Box>
        <Typography component='span'>:</Typography>
        <Box>
          <TextField
            centered
            value={mm}
            name={`minute`}
            placeholder={'menu.clients.new.MM'}
            fullWidth
            noMarginTop
            uncontrolled
            type='number'
            onChange={(e) => {
              if (Number(e.target.value) <= 59) onChange(`${hh}:${e.target.value}`)
            }}
          />
        </Box>
      </Box>
    </>
  )
}

function InputDatePicker({
  id,
  label,
  placeholder,
  name,
  fullWidth,
  boxStyle,
  defaultValue,
  maxWidth,
  error,
  required = false,
  uncontrolled,
  value,
  onChange,
  noValidation,
  disabled,
  noMarginTop,
  isClearable,
  maxDate,
  minDate,
  customRadius,
  withTime,
  dashed,
}) {
  const classes = useStyles({ disabled, customRadius, dashed })
  const methods = useFormContext()
  const { palette } = useTheme()

  return (
    <Box width={fullWidth ? '100%' : 320} maxWidth={maxWidth} className={classes.root} mt={!label && !noMarginTop && '21px'} {...boxStyle}>
      {label && (
        <Label required={required} mb={'4px'}>
          {label}
        </Label>
      )}
      {uncontrolled ? (
        <DatePicker
          id={id}
          dateFormat={withTime ? 'dd.MM.yyyy | HH:mm' : 'dd.MM.yyyy'}
          selected={value}
          showTimeInput={withTime}
          onChange={onChange}
          placeholderText={placeholder}
          popperClassName='datepicker'
          maxDate={maxDate}
          calendarStartDay={1}
          minDate={minDate}
          disabled={disabled}
          customTimeInput={<CustomTimeInput />}
          renderCustomHeader={({ monthDate, changeYear, changeMonth, decreaseMonth, increaseMonth, ...props }) => {
            return (
              <YearMonthFormNew
                date={monthDate}
                changeYear={changeYear}
                changeMonth={changeMonth}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
              />
            )
          }}
          customInput={
            <TextField
              sx={(theme) => ({
                background: theme.palette.background.default,
              })}
              variant='outlined'
              fullWidth
              error={!!error}
              className={noMarginTop && classes.noMargin}
              InputProps={{
                endAdornment: (
                  <InputAdornment sx={{ paddingRight: 1 }} position='start'>
                    {/* <FontAwesomeIcon icon={faCalendarAlt} color={palette.orange[500]} /> */}
                    <CalendarIcon />
                  </InputAdornment>
                ),
              }}
            />
          }
        />
      ) : (
        <Controller
          name={name}
          disabled={disabled}
          render={({ field: { onChange: onFieldChange, value: fieldValue } }) => (
            <DatePicker
              id={id}
              dateFormat={withTime ? 'dd.MM.yyyy | HH:mm' : 'dd.MM.yyyy'}
              selected={fieldValue}
              showTimeInput={withTime}
              onChange={onFieldChange}
              placeholderText={placeholder}
              popperClassName='datepicker'
              popperPlacement={withTime && 'right-end'}
              calendarStartDay={1}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
              customTimeInput={<CustomTimeInput />}
              renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
                return (
                  <YearMonthFormNew date={date} changeYear={changeYear} changeMonth={changeMonth} decreaseMonth={decreaseMonth} increaseMonth={increaseMonth} />
                )
              }}
              customInput={
                <TextField
                  variant='outlined'
                  fullWidth
                  error={!!error}
                  className={noMarginTop && classes.noMargin}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment sx={{ paddingRight: 1 }} position='start'>
                        {fieldValue && isClearable ? (
                          <button
                            className={classes.clearButton}
                            onClick={() => {
                              onFieldChange(null)
                            }}
                            type='button'
                          >
                            <DeleteSmallIcon />
                          </button>
                        ) : (
                          <CalendarIcon />

                          // <FontAwesomeIcon icon={faCalendarAlt} color={disabled ? palette.gray[400] : palette.orange[500]} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          )}
          rules={{
            required,
            ...(!noValidation && {
              validYear: (val) => {
                const year = new Date(val).getFullYear()
                return year < 2100
              },
            }),
          }}
          control={methods.control}
          defaultValue={defaultValue ?? ''}
        />
      )}
    </Box>
  )
}

export default InputDatePicker
