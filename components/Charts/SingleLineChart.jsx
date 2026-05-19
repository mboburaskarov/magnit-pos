import { Box, Skeleton, Typography } from '@mui/material'
import getShorterNumber from '@utils/getShorterNumber'
import { getDateFromDateTime } from '@utils/parseDateTime'
import thousandDivider from '@utils/thousandDivider'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts'
import LoadingBlurry from '../LoadingBlurry'
import SelectSimple from '../Select/SelectSimple'
import CustomizedAxisTick from './ChartAxisTick'
import ChartPlaceholder from './ChartPlaceholder'
import ChartSlider from './ChartSlider'
import DashboardTooltip from './DashboardTooltip'
import '../../src/pages/dashboard/magnit-dashboard.css'

const detailingOptions = [
  { name: 'по час', value: 'hour' },
  { name: 'по дням', value: 'day' },
  { name: 'по неделям', value: 'week' },
  { name: 'по месяцам', value: 'month' },
]
const chartOptions = [
  { name: 'Продажи', value: 'sale' },
  { name: 'Обмены', value: 'swap', soon: true, isDisabled: true },
  { name: 'Возвраты', value: 'return', soon: true, isDisabled: true },
]

const Body = ({ children, isLoading, isEmpty }) => (
  <Box position='relative' sx={{ width: '100%', height: '100%' }}>
    {isEmpty ? (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderRadius: 16,
          background: '#F9FAFB',
          border: '1.5px dashed #E2E8F0',
        }}
      >
        <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <rect x='4' y='28' width='8' height='14' rx='2' fill='#D1D5DB' />
          <rect x='16' y='18' width='8' height='24' rx='2' fill='#D1D5DB' />
          <rect x='28' y='22' width='8' height='20' rx='2' fill='#D1D5DB' />
          <rect x='40' y='12' width='8' height='30' rx='2' fill='#D1D5DB' />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>Данные не найдены</div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>Выберите другой период для отображения графика</div>
        </div>
      </div>
    ) : (
      children
    )}
    {isLoading && <LoadingBlurry isLoading={isLoading} outside />}
  </Box>
)

export default function SingleBarChart({
  measurmentUnit = '',
  data,
  detalization,
  setDetalization,
  setchartType,
  chartType,
  period,
  isLoading,
  width: boxWidth = '100%',
  dataKey,
  id,
  sortBy,
  setSortBy,
}) {
  const { t } = useTranslation()
  const [chartData, setChartData] = useState([])
  const [sliderValue, setSliderValue] = useState([0, 100])

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue)
  }

  useEffect(() => {
    if (data?.values?.length) {
      setChartData(data?.values)
      setSliderValue([0, data?.values?.length])
    } else {
      setChartData([])
      setSliderValue([0, 0])
    }
  }, [data, detalization])
  const maxValue = Math.max(...(chartData.slice(sliderValue[0], sliderValue[1]).map((item) => item?.count) || [0]))
  const maxValue2 =
    chartData
      .slice(sliderValue[0], sliderValue[1])
      .map((item) => item?.all_orders)
      ?.reduce((sum, num) => sum + num, 0) || 0

  const [viewType, setViewType] = useState('bar')
  const periods = [
    { label: '1d', value: 'hour' },
    { label: '7d', value: 'day' },
    { label: '30d', value: 'week' },
    { label: '6m', value: 'month' },
  ]

  return (
    <div className='mdash-kpi-card' style={{ width: boxWidth, minHeight: 'auto', padding: '20px' }}>
      <div className='mdash-chart-header' style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {isLoading ? (
            <Skeleton variant='text' width={250} height={32} />
          ) : (
            <>
              <h3 className='mdash-chart-title'>Отчет по продажам</h3>
              <p className='mdash-chart-subtitle'>Динамика выручки и заказов</p>
            </>
          )}
        </div>
        <div className='mdash-chart-actions'>
          <div className='mdash-toggle-group periods-group'>
            {periods.map((p) => {
              const isActive = (typeof detalization === 'string' ? detalization : detalization?.value) === p.value;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    const option = detailingOptions.find((o) => o.value === p.value);
                    if (option) setDetalization?.(option);
                  }}
                  className={`mdash-toggle-btn ${isActive ? 'active-black' : ''}`}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                const option = detailingOptions.find((o) => o.value === 'month');
                if (option) setDetalization?.(option);
              }}
              className={`mdash-toggle-btn ${(typeof detalization === 'string' ? detalization : detalization?.value) === 'month' ? 'active-black' : ''}`}
            >
              Max
            </button>
          </div>

          <div className='mdash-toggle-group sort-group'>
            <button
              onClick={() => setSortBy?.('SUM')}
              className={`mdash-toggle-btn ${sortBy === 'SUM' ? 'active-white' : ''}`}
            >
              Sum
            </button>
            <button
              onClick={() => setSortBy?.('QTY')}
              className={`mdash-toggle-btn ${sortBy === 'QTY' ? 'active-white' : ''}`}
            >
              Qty
            </button>
          </div>

          <div className='mdash-toggle-group view-group'>
            <button
              onClick={() => setViewType('bar')}
              className={`mdash-toggle-btn ${viewType === 'bar' ? 'active-white' : ''}`}
            >
              Bar
            </button>
            <button
              onClick={() => setViewType('line')}
              className={`mdash-toggle-btn ${viewType === 'line' ? 'active-white' : ''}`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      <Body isLoading={isLoading} isEmpty={!chartData.length}>
        <ResponsiveContainer width='100%' height={300}>
          {viewType === 'bar' ? (
            <BarChart data={chartData.slice(sliderValue[0], sliderValue[1])} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#E6E8EC' vertical={false} />
              <XAxis
                dataKey='start_date'
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#A1A1AA' }}
                tickFormatter={(value) => getDateFromDateTime(value)}
                dy={10}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(value) => getShorterNumber(value, 0)} />
              <Tooltip
                content={<DashboardTooltip measurmentUnit={measurmentUnit} detalization={detalization} />}
                wrapperStyle={{ zIndex: 11 }}
                cursor={{ fill: '#F4F4F5' }}
              />
              <Bar dataKey={dataKey || 'value'} fill='#111111' radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          ) : (
            <LineChart data={chartData.slice(sliderValue[0], sliderValue[1])} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#E6E8EC' vertical={false} />
              <XAxis
                dataKey='start_date'
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#A1A1AA' }}
                tickFormatter={(value) => getDateFromDateTime(value)}
                dy={10}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(value) => getShorterNumber(value, 0)} />
              <Tooltip content={<DashboardTooltip measurmentUnit={measurmentUnit} detalization={detalization} />} wrapperStyle={{ zIndex: 11 }} />
              <Line
                type='monotone'
                dataKey={dataKey || 'value'}
                stroke='#111111'
                strokeWidth={3}
                dot={{ r: 4, fill: '#111111', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#111111', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        <div style={{ marginTop: '20px' }}>
          <ChartSlider value={sliderValue} onChange={handleSliderChange} min={0} max={chartData?.length || 1} />
        </div>
      </Body>
    </div>
  )
}
