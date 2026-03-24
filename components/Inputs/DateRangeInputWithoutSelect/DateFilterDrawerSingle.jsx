import { FormProvider, useForm } from 'react-hook-form';
import { DateUtils } from 'react-day-picker';
import { makeStyles } from '@mui/styles';
import { useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

import DateRangeInputsBox from './DateRangeInputsBox';
import { error } from '../../../utils/toast';


const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
    borderRadius: '16px',
    // backgroundColor: theme.palette.background.default,
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    height: '100%',
    marginBottom: '5px',
    '& > div:nth-last-of-type(1)': {
      display: 'flex',
    },
  },
  order_number: {
    fontSize: 36,
    lineHeight: '42px',
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.black,
  },
  dateRange: {
    '& .DayPicker-wrapper': {
      backgroundColor: theme.palette.background.default,
      paddingBottom: 0,
      width: '305px',
    },
    '& .DayPicker-Month': {
      margin: '12px 0 0 0',
      width: '100%',
      display: 'block',
    },
    '& .DayPicker-Caption': {
      display: 'block',
      marginBottom: 16,
      textAlign: 'center',
      '& > select': {
        textAlign: 'center',
        border: 'none',
        fontFamily: theme.fontFamily.inter,
        fontSize: 17,
        lineHeight: '19px',
        fontWeight: 600,
        color: theme.palette.gray[600],
        backgroundColor: theme.palette.background.default,

        '&:focus-visible': {
          outline: 'none !important',
        },

        '& > option': {
          fontWeight: 600,
          fontSize: 16,
          lineHeight: '19px',
          background: 'white !important',
          border: 'none',
        },
      },
    },
    '& .DayPicker-Weekdays': {
      background: theme.palette.gray[50],
      height: 40,
      borderRadius: 12,
      display: 'block',
      marginTop: 0,
      marginBottom: 4,
    },
    '& .DayPicker-WeekdaysRow': {
      display: 'flex',
    },
    '& .DayPicker-Weekday': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      padding: 0,
      marginRight: 4,
      color: theme.palette.bunker[800],
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      verticalAlign: 'middle',
      textTransform: 'capitalize',
      '& abbr': {
        textDecoration: 'none !important',

        cursor: 'default',
      },
      '&:last-child': {
        marginRight: 0,
      },
      '&:nth-child(6) ': {
        color: theme.palette.orange[500],
      },
      '&:nth-child(7) ': {
        color: theme.palette.orange[500],
      },
    },
    '& .DayPicker-Day': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 44,
      height: 44,
      borderRadius: '50%',
      padding: 0,
      marginRight: 0,
      color: theme.palette.gray[600],
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      transition: 'all 0s ease',
      cursor: 'pointer',
      '&:not(.DayPicker-Day--outside):hover': {
        backgroundColor: `${theme.palette.orange[600]} !important`,
        color: '#fff !important',
        borderRadius: '50% !important',
        zIndex: 1,
        boxShadow: 'none !important',
      },
      '&:last-child': {
        marginRight: 0,
        color: theme.palette.gray[600],
      },
      '&:nth-child(6)': {
        color: theme.palette.gray[600],
      },
    },
    '& .DayPicker-Day.DayPicker-Day--outside': {
      color: `${theme.palette.gray[400]} !important`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: `transparent !important`,
        color: theme.palette.gray[400],
      },
    },

    '& .DayPicker-Week': {
      display: 'flex',
      marginBottom: 3,
    },
    '& .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.orange[200] : theme.palette.orange[50],
      color: theme.palette.type === 'dark' ? theme.palette.gray[700] : theme.palette.gray[600],
      '&:last-child': {
        borderRadius: '50% !important',
      },
      '&:first-of-type': {
        borderRadius: '50% !important',
      },
      '&:hover, &.DayPicker-Day--end, &.DayPicker-Day--start': {
        color: '#fff',
      },
    },
    '& .DayPicker-Day--start.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
      backgroundColor: theme.palette.orange[600],
      color: '#fff',
      borderRadius: '50% !important',
      boxShadow: ({ isOneDayDifference }) =>
        !isOneDayDifference && `9px 0 0px 0px ${theme.palette.type === 'dark' ? theme.palette.orange[200] : theme.palette.orange[50]}`,
    },
    '& .DayPicker-Day--end.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
      backgroundColor: theme.palette.orange[600],
      borderRadius: '50% !important',
      margin: '0 2px',
      color: '#fff',
      // boxShadow: ({ isOneDayDifference }) =>
      //   !isOneDayDifference && `-9px 0 0px 0px ${theme.palette.type === 'dark' ? theme.palette.orange[200] : theme.palette.orange[50]}`,
    },
    '& .DayPicker-Day.DayPicker-Day--disabled': {
      color: `${theme.palette.gray[400]} !important`,
      cursor: 'not-allowed',
      '&:not(.DayPicker-Day--outside):hover': {
        backgroundColor: `#fff !important`,
        color: `${theme.palette.gray[400]} !important`,
        borderRadius: '50% !important',
        zIndex: 1,
        boxShadow: 'none !important',
      },
    },

    '& .DayPicker-NavButton': {
      width: 22,
      height: 19,
      top: 10,
      right: 'auto',
      left: 'auto',
      marginTop: 0,
      color: theme.palette.orange[500],
    },
    '& .DayPicker-NavButton--prev': {
      left: 15,
      marginRight: 0,
      backgroundImage:
        'url(data:image/svg+xml;base60,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuMDYyNSA2LjVDMC43ODEyNSA2Ljc4MTI1IDAuNzgxMjUgNy4yNSAxLjA2MjUgNy41MzEyNUw3LjEyNSAxMy42MjVDNy40Mzc1IDEzLjkwNjIgNy45MDYyNSAxMy45MDYyIDguMTg3NSAxMy42MjVMOC45MDYyNSAxMi45MDYyQzkuMTg3NSAxMi42MjUgOS4xODc1IDEyLjE1NjIgOC45MDYyNSAxMS44NDM4TDQuMDkzNzUgN0w4LjkwNjI1IDIuMTg3NUM5LjE4NzUgMS44NzUgOS4xODc1IDEuNDA2MjUgOC45MDYyNSAxLjEyNUw4LjE4NzUgMC40MDYyNUM3LjkwNjI1IDAuMTI1IDcuNDM3NSAwLjEyNSA3LjEyNSAwLjQwNjI1TDEuMDYyNSA2LjVaIiBmaWxsPSIjNDk5M0REIi8+Cjwvc3ZnPgo=)',
    },
    '& .DayPicker-NavButton--next': {
      right: 15,
      backgroundImage:
        'url(data:image/svg+xml;base60,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTA2MjUgNy41MzEyNUM5LjE4NzUgNy4yNSA5LjE4NzUgNi43ODEyNSA4LjkwNjI1IDYuNUwyLjg0Mzc1IDAuNDA2MjVDMi41MzEyNSAwLjEyNSAyLjA2MjUgMC4xMjUgMS43ODEyNSAwLjQwNjI1TDEuMDYyNSAxLjEyNUMwLjc4MTI1IDEuNDA2MjUgMC43ODEyNSAxLjg3NSAxLjA2MjUgMi4xODc1TDUuODc1IDdMMS4wNjI1IDExLjg0MzhDMC43ODEyNSAxMi4xNTYyIDAuNzgxMjUgMTIuNjI1IDEuMDYyNSAxMi45MDYyTDEuNzgxMjUgMTMuNjI1QzIuMDYyNSAxMy45MDYyIDIuNTMxMjUgMTMuOTA2MiAyLjg0Mzc1IDEzLjYyNUw4LjkwNjI1IDcuNTMxMjVaIiBmaWxsPSIjNDk5M0REIi8+Cjwvc3ZnPgo=)',
    },
  },
}))

const currentYear = new Date().getFullYear()
const fromMonth = new Date(currentYear - 10, 11)
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const defaultState = {
  from: today,
  to: today,
  enteredTo: today, // Keep track of the last day for mouseEnter.
  month: tomorrow,
}

export default function DateFilterDrawerSingle({
  close,
  customDateRanges,
  onCustomRangeSelect,
  dayDifference,
  handleChangeDate,
  selectedRange,
  setDateState,
  dateState,
  onClose,
}) {
  const methods = useForm()
  const { setError } = useForm()
  const localeData = useMemo(() => dayjs().localeData(), [])
  const label = useRef('')
  const weekDays = useMemo(() => localeData.weekdays().map((item) => item[0].toUpperCase() + item.slice(1)), [localeData])
  const weekdaysMin = useMemo(() => localeData.weekdaysMin().map((item) => item[0].toUpperCase() + item.slice(1)), [localeData])

  const classes = useStyles({ isOneDayDifference: dateState?.from - dateState?.to === -86400000 || dateState?.from - dateState?.to === 0 })

  function isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
    const isRangeSelected = from && to
    return !from || isBeforeFirstDay || isRangeSelected
  }
  function handleResetClick() {
    setDateState(defaultState)
  }
  function handleDayClick(day) {
    const { from, to } = dateState
    if (day < tomorrow) {
      if (from && to && day > from && day < to) {
        handleResetClick()
        return
      }
      if (isSelectingFirstDay(from, to, day)) {
        if (dayDifference) {
          const enteredTo = dayjs(day).add('days', dayDifference).format('YYYY-MM-DD')
          setDateState({
            from: day,
            to: new Date(enteredTo),
            enteredTo: new Date(enteredTo),
          })
          return
        }
        setDateState({
          from: day,
          to: null,
          enteredTo: null,
        })
      } else {
        setDateState({
          ...dateState,
          to: day,
          enteredTo: day,
        })
      }
    } else {
      error('toast.error.future_date_error')
    }
  }
  function handleDayMouseEnter(day) {
    const { from, to } = dateState
    if (!isSelectingFirstDay(from, to, day)) {
      setDateState({
        ...dateState,
        enteredTo: day,
      })
    }
  }
  const onSubmit = (data) => {
    if (Number(data.from_day) > 31) {
      setError('from_day', { message: 'pattern' })
      return
    }
    if (Number(data.from_month) > 12) {
      setError('from_month', { message: 'pattern' })
      return
    }
    if (Number(data.from_year) > 2099 || Number(data.from_year) < 1960) {
      setError('from_year', { message: 'pattern' })
      return
    }
    if (Number(data.to_day) > 31) {
      setError('to_day', { message: 'pattern' })
      return
    }
    if (Number(data.to_month) > 12) {
      setError('to_month', { message: 'pattern' })
      return
    }
    if (Number(data.to_year) > 2099 || Number(data.to_year) < 1960) {
      setError('to_year', { message: 'pattern' })
      return
    }

    const start_date = `${data.from_year}-${data.from_month}-${data.from_day}`
    const end_date = `${data.to_year}-${data.to_month}-${data.to_day}`

    if (onCustomRangeSelect) {
      onCustomRangeSelect(label.current)
    }

    setDateState({ from: new Date(start_date), to: new Date(end_date), enteredTo: new Date(end_date) })
    onClose({ from: new Date(start_date), to: new Date(end_date), enteredTo: new Date(end_date) })

    if (close) close()
  }
  const onError = (err) => {
    console.error(err)
  }

  return (
    <Box className={classes.wrapper}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)} noValidate>
          <DateRangeInputsBox dateState={dateState} />
        </form>
      </FormProvider>
    </Box>
  )
}
