import { Box } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/ru' // Russian locale for correct week start
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localeData from 'dayjs/plugin/localeData'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import * as qs from 'qs'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowDown from '../../../src/assets/icons/ArrowDown'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { calculateDateDifference } from '../../../utils/calculateDateDifference'
import ButtonWithPopup from '../../Buttons/ButtonWithPopup'
import DateFilterDrawerSingle from './DateFilterDrawerSingle'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)
dayjs.extend(localeData)
dayjs.locale('ru')
const customDateRanges = () => [
  {
    id: 'yesterday',
    label: 'Вчера',
    values: [dayjs().subtract(1, 'day').format('DD.MM.YYYY'), dayjs().subtract(1, 'day').format('DD.MM.YYYY')],
  },
  {
    id: 'today',
    label: 'Сегодня',
    values: [dayjs().format('DD.MM.YYYY'), dayjs().format('DD.MM.YYYY')],
  },
  {
    id: 'week',
    label: 'На этой неделе',
    values: [dayjs().startOf('week').format('DD.MM.YYYY'), dayjs().endOf('week').format('DD.MM.YYYY')],
  },
  {
    id: 'month',
    label: 'Это месяц',
    values: [dayjs().startOf('month').format('DD.MM.YYYY'), dayjs().format('DD.MM.YYYY')],
  },
  {
    id: 'year',
    label: 'В этом году',
    values: [dayjs().startOf('year').format('DD.MM.YYYY'), dayjs().format('DD.MM.YYYY')],
  },
]

const today = dayjs().toDate()
const tomorrow = dayjs().add(1, 'day').toDate()

export default function DateRangeInput({ id, name, minHeight = '48px', startDateQuery = 'start_date', endDateQuery = 'end_date', defaultFilterData }) {
  const defaultState = {
    from: dayjs(defaultFilterData?.start_date).isValid() ? dayjs(defaultFilterData?.start_date).toDate() : today,
    to: dayjs(defaultFilterData?.end_date).isValid() ? dayjs(defaultFilterData?.end_date).toDate() : today,
    enteredTo: today,
    month: tomorrow,
  }
  const location = useLocation()
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const [dateState, setDateState] = useState(defaultState)

  const dateDifference = calculateDateDifference(dateState?.from, dateState?.to)

  useEffect(() => {
    if (values?.start_date && values?.end_date) {
      setDateState({
        from: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
        to: dayjs(values?.end_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.end_date, 'YYYY-MM-DD').toDate() : today,
        enteredTo: dayjs(values?.end_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.end_date, 'YYYY-MM-DD').toDate() : today,
      })
      setCustomDateRangeSelected(getLabelForDateRange(values?.start_date, values?.end_date) || 'Сегодня')
      setselectedId(customDateRanges().find((el) => el.label == getLabelForDateRange(values?.start_date, values?.end_date))?.id || 'today')
    } else if (values?.start_date) {
      setDateState({
        from: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
        to: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
        enteredTo: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
      })
      setCustomDateRangeSelected(getLabelForDateRange(values?.start_date, values?.end_date) || 'Сегодня')
      setselectedId(customDateRanges().find((el) => el.label == getLabelForDateRange(values?.start_date, values?.end_date))?.id || 'today')
    }
  }, [values?.start_date, values?.end_date])

  const onClose = useCallback(
    (data) => {
      const baseUrl = location.pathname

      const dateParams = qs.stringify(
        {
          ...values,
          [startDateQuery]: data.from.toISOString().split('T')[0] || dateState.from.toISOString().split('T')[0],
          [endDateQuery]: data.to.toISOString().split('T')[0] || dateState.to.toISOString().split('T')[0],
        },
        { addQueryPrefix: true }
      )
      navigate(`${baseUrl}${dateParams}`)
    },
    [dateState, location.pathname, navigate, startDateQuery, endDateQuery, values]
  )
  const getLabelForDateRange = (startDate, endDate) => {
    const today = dayjs()
    const yesterday = today.subtract(1, 'day')
    const start = dayjs(startDate)
    const end = dayjs(endDate)

    // **Today**
    if (start.isSame(today, 'day') && end.isSame(today, 'day')) return 'Сегодня'

    // **Yesterday**
    if (start.isSame(yesterday, 'day') && end.isSame(yesterday, 'day')) return 'Вчера'

    // **This week (Monday - Sunday)**
    const startOfWeek = today.startOf('week') // Monday start
    const endOfWeek = today.endOf('week') // Sunday end
    if (start.isSameOrAfter(startOfWeek, 'day')) {
      return 'На этой неделе'
    }

    // **This month**
    const startOfMonth = today.startOf('month')
    if (start.isSameOrAfter(startOfMonth, 'day') && end.isSameOrBefore(today, 'day')) {
      return 'Это месяц'
    }

    // **This year**
    const startOfYear = today.startOf('year')
    if (start.isSameOrAfter(startOfYear, 'day') && end.isSameOrBefore(today, 'day')) {
      return 'В этом году'
    }

    return `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`
  }

  const [customDateRangeSelected, setCustomDateRangeSelected] = useState(getLabelForDateRange(values?.start_date, values?.end_date) || 'Сегодня')
  const [selectedId, setselectedId] = useState(
    customDateRanges().find((el) => el.label == getLabelForDateRange(values?.start_date, values?.end_date))?.id || 'today'
  )
  return (
    <Box minWidth={163}>
      <ButtonWithPopup
        id={id || name}
        noArrow
        endIcon={<ArrowDown />}
        noMarginSvg
        sx={{
          height: minHeight,
          border: '1px solid #ECEDF2 !important',
        }}
        placement='bottom-end'
        buttonLabel={
          <Box
            display='inline-flex'
            whiteSpace={'pre'}
            sx={{
              '&  > p': { fontWeight: 600, textAlign: 'left', color: 'dark.500', margin: '0 20px', lineHeight: '25px', fontSize: 16 },
              '& > span': { lineHeight: '19px', color: 'gray.600', fontWeight: 600, ml: 1, mr: '2px !important' },
            }}
          >
            <p>{customDateRangeSelected || 'Выберите дату'}</p>
          </Box>
        }
        popperContentProps={{
          customDateRanges: customDateRanges(),
          onCustomRangeSelect: (name) => {
            setselectedId(name)
          },
          selectedRange: selectedId, // ✅ Pass selected range
          isFilter: true,
          dateState: {
            from: dateState.from,
            to: dateState.to,
            month: dateState.month,
          },
          setDateState: (val) => setDateState(val),
          onClose: (data) => onClose(data),
        }}
        PopperContent={DateFilterDrawerSingle}
      />
    </Box>
  )
}
