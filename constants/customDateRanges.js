import dayjs from 'dayjs'

export const customDateRanges = (t) => [
  {
    id: 'yesterday',
    label: t('dates.yesterday'),
    values: [dayjs().tz().subtract(1, 'day').format('DD.MM.YYYY'), dayjs().tz().subtract(1, 'day').format('DD.MM.YYYY')],
  },
  {
    id: 'today',
    label: t('dates.today'),
    values: [dayjs().tz().format('DD.MM.YYYY'), dayjs().tz().format('DD.MM.YYYY')],
  },
  {
    id: 'week',
    label: t('dates.this_week'),
    values: [dayjs().tz().startOf('week').format('DD.MM.YYYY'), dayjs().tz().format('DD.MM.YYYY')],
  },
  {
    id: 'month',
    label: t('dates.this_month'),
    values: [dayjs().tz().startOf('month').format('DD.MM.YYYY'), dayjs().tz().format('DD.MM.YYYY')],
  },
  {
    id: 'year',
    label: t('dates.this_year'),
    values: [dayjs().tz().startOf('year').format('DD.MM.YYYY'), dayjs().tz().format('DD.MM.YYYY')],
  },
]
