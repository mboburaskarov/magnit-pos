import dayjs from 'dayjs'
import { getDateFromDateTime, getTimeFromDateTime } from '../../utils/parseDateTime'
import paletteLight from '../../src/assets/theme/paletteLight'

export default function ChartAxisTick({ x, y, payload, detalization, index, visibleTicksCount }) {
  // While filtering by month, words mix with each other.
  // To prevent, hide even months options
  const hideEvenTicksMonthOption = detalization.value === 'month' && (visibleTicksCount > 8 ? index % 2 !== 0 : false)
  return (
    <g transform={`translate(${x},${y})`}>
      {detalization.value === 'day' && (
        <text x={0} y={0} dy={11} textAnchor='middle' fill={paletteLight.grey[400]} style={{ textTransform: 'capitalize' }}>
          {dayjs(payload.value, 'DD.MM.YYYY | HH:mm').format('dd')}
        </text>
      )}
      {detalization.value === 'month' && !hideEvenTicksMonthOption && (
        <text x={0} y={0} dy={11} textAnchor='middle' fill={paletteLight.grey[600]} style={{ textTransform: 'capitalize' }}>
          {dayjs(payload.value, 'DD.MM.YYYY | HH:mm').format('MMMM')}
        </text>
      )}
      <text
        x={0}
        y={0}
        dy={detalization.value === 'day' || detalization.value === 'month' ? 26 : detalization.value === 'week' ? 11 : 20}
        textAnchor='middle'
        fill={paletteLight.grey[600]}
      >
        {detalization.value === 'hour' || detalization.value === '30min'
          ? getTimeFromDateTime(payload.value)
          : detalization.value === 'month' || detalization.value === 'year'
          ? hideEvenTicksMonthOption
            ? ''
            : dayjs(payload.value, 'DD.MM.YYYY | HH:mm').format('YYYY')
          : getDateFromDateTime(payload.value)}
      </text>
      {detalization.value === 'week' && (
        <text x={0} y={0} dy={26} textAnchor='middle' fill={paletteLight.grey[600]}>
          {dayjs(payload.value, 'DD.MM.YYYY | HH:mm').day(7).format('DD.MM')}
        </text>
      )}
    </g>
  )
}
