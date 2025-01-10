import { Box, Typography, TextField, InputAdornment } from '@mui/material'
import DatePicker, { registerLocale } from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import paletteLight from '../../src/assets/theme/paletteLight'
import ru from 'date-fns/locale/ru'
import { YearMonthFormNew } from './InputDatePicker'
import { makeStyles } from '@mui/styles'

registerLocale('ru', ru)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    color: theme.palette.gray[600],
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
}))

function InputDateRangePicker({
  id,
  label,
  placeholder,
  fullWidth,
  boxStyle,
  asteriks,
  maxWidth,
  error,
  required = false,
  disabled,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  onDateChange,
  noMarginTop,
}) {
  const classes = useStyles()
  const onChange = (dates) => {
    if (onDateChange) {
      onDateChange(dates, id)
    } else {
      const [start, end] = dates
      setStartDate(start)
      setEndDate(end)
    }
  }
  return (
    <Box width={fullWidth ? '100%' : 320} maxWidth={maxWidth} className={classes.root} mt={!label && !noMarginTop && '21px'} {...boxStyle}>
      <Typography className={`${required && label && asteriks ? classes.required : ''}`} mb={2} variant='h5'>
        {label}
      </Typography>
      <DatePicker
        id={id}
        dateFormat='dd.MM.yyyy'
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        placeholderText={placeholder}
        popperClassName='datepicker'
        // locale={i18n.language}
        calendarStartDay={1}
        disabled={disabled}
        selectsRange
        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
          <YearMonthFormNew date={date} changeYear={changeYear} changeMonth={changeMonth} decreaseMonth={decreaseMonth} increaseMonth={increaseMonth} />
        )}
        customInput={
          <TextField
            variant='outlined'
            fullWidth
            error={!!error}
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ paddingRight: 1 }} position='start'>
                  <FontAwesomeIcon icon={faCalendarAlt} color={paletteLight.blue[500]} />
                </InputAdornment>
              ),
            }}
          />
        }
      />
    </Box>
  )
}

export default InputDateRangePicker
