import ButtonWithPopup from '../../Buttons/ButtonWithPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { Box } from '@mui/material'
import DateFilterDrawerSingle from './DateFilterDrawerSingle'
import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'
import * as qs from 'qs'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { calculateDateDifference } from '../../../utils/calculateDateDifference'
import ArrowDown from '../../../src/assets/icons/ArrowDown'

const customDateRanges = () => [
  {
    id: 'yesterday',
    label: 'Это час',
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
    values: [dayjs().startOf('week').format('DD.MM.YYYY'), dayjs().format('DD.MM.YYYY')],
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

export default function DateRangeInput({ id, name, startDateQuery = 'start_date', endDateQuery = 'end_date', defaultFilterData }) {
  const defaultState = {
    from: dayjs(defaultFilterData?.start_date).isValid() ? dayjs(defaultFilterData?.start_date).toDate() : today,
    to: dayjs(defaultFilterData?.end_date).isValid() ? dayjs(defaultFilterData?.end_date).toDate() : today,
    enteredTo: today,
    month: tomorrow,
  }
  const location = useLocation()
  const navigate = useNavigate()
  const [customDateRangeSelected, setCustomDateRangeSelected] = useState(defaultFilterData?.label || 'Bugun')
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
    } else if (values?.start_date) {
      setDateState({
        from: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
        to: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
        enteredTo: dayjs(values?.start_date, 'YYYY-MM-DD').isValid() ? dayjs(values?.start_date, 'YYYY-MM-DD').toDate() : today,
      })
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

  return (
    <Box minWidth={163}>
      <ButtonWithPopup
        id={id || name}
        noArrow
        endIcon={<ArrowDown />}
        noMarginSvg
        placement='bottom-end'
        buttonLabel={
          <Box
            display='inline-flex'
            sx={{
              '&  > p': { fontWeight: 500, textAlign: 'left', color: 'dark.500', margin: '0 20px', lineHeight: '28px', fontSize: 20 },
              '& > span': { lineHeight: '19px', color: 'gray.600', fontWeight: 600, ml: 1, mr: '2px !important' },
            }}
          >
            <p>{customDateRangeSelected || 'Vaqt tanlang'}</p>
          </Box>
        }
        popperContentProps={{
          customDateRanges: customDateRanges(),
          onCustomRangeSelect: (name) => setCustomDateRangeSelected(name),
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
