import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Skeleton } from '@mui/material'
import { XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'
import CustomizedAxisTick from './ChartAxisTick'
import ChartPlaceholder from './ChartPlaceholder'
import ChartSlider from './ChartSlider'
import DashboardTooltip from './DashboardTooltip'
import SelectSimple from '../Select/SelectSimple'
import paletteLight from '../../src/assets/theme/paletteLight'
import getShorterNumber from '../../utils/getShorterNumber'
import { getDateFromDateTime, getTimeFromDateTime } from '../../utils/parseDateTime'
import LoadingBlurry from '../LoadingBlurry'
import thousandDivider from '../../utils/thousandDivider'

const detailingOptions = [
  { name: 'по 30 минут', value: '30min' },
  { name: 'по часам', value: 'hour' },
  { name: 'по дням', value: 'day' },
  { name: 'по неделям', value: 'week' },
  { name: 'по месяцам', value: 'month' },
  { name: 'по годам', value: 'year' },
]

const purpleColor = '#a811d6'
const blueColor = '#0F6FD7'

const Body = ({ children, isLoading, isEmpty }) => (
  <Box
    position='relative'
    sx={(theme) => ({
      width: '100%',
      height: '100%',
      fontFamily: theme.fontFamily.LeagueSpartan,
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '17px',
      color: theme.palette.grey[600],
    })}
  >
    {isEmpty ? (
      <ChartPlaceholder textstyle={{ fontSize: 24, width: 330, lineHeight: '28px' }} text='Данные не найдены для диаграммы' height={395} noMargin />
    ) : (
      children
    )}
    {isLoading && <LoadingBlurry isLoading={isLoading} outside />}
  </Box>
)

export default function SingleLineChart({
  title = 'Продажи',
  measurmentUnit = '',
  colorCode,
  data,
  detalization,
  setDetalization,
  period,
  isLoading,
  width: boxWidth = '100%',
  dataKey,
  sortBy,
  id,
}) {
  const [chartData, setChartData] = useState([])
  const [sliderValue, setSliderValue] = useState([0, 100])

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue)
  }

  useEffect(() => {
    if (data?.values?.length) {
      setChartData(data?.values)
      setSliderValue([0, data?.values?.length])
    }
  }, [data, detalization])
  const maxValue = Math.max(...chartData.slice(sliderValue[0], sliderValue[1]).map((item) => item?.count))
  return (
    <Box
      sx={(theme) => ({
        border: 0.5,
        borderRadius: 4,
        borderColor: '#A4A5AB33',
        width: boxWidth,
        minHeight: 432,
        borderRadius: 6,
        backgroundColor: theme.palette.background.default,
        // boxShadow: theme.boxShadow['16-8'],
      })}
    >
      <Box p={3} pb={2}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          {isLoading ? (
            <Skeleton
              variant='text'
              sx={{
                width: '250px',
                borderRadius: 5,
                height: '48px',
              }}
            />
          ) : (
            <Box display='flex' alignItems='center'>
              <Typography sx={(theme) => ({ fontSize: 24, lineHeight: '28px', fontFamily: theme.fontFamily.LeagueSpartan, color: theme.palette.black })}>
                {title}
              </Typography>
              {!!data?.total && (
                <Typography
                  sx={(theme) => ({
                    fontSize: 24,
                    lineHeight: '28px',
                    fontFamily: theme.fontFamily.LeagueSpartan,
                    color: 'green.500',
                    marginLeft: 2,
                  })}
                >
                  {thousandDivider(data?.total || 0)} {measurmentUnit}
                </Typography>
              )}
            </Box>
          )}
          <SelectSimple
            id={id + 'detailing'}
            name={id + 'detailing'}
            placeholder='Детализация'
            uncontrolled
            onChange={setDetalization}
            value={detalization}
            fullWidth
            boxStyle={{ width: 320 }}
            isClearable={false}
            options={
              period === 'today' || period === 'yesterday'
                ? detailingOptions.slice(0, 2)
                : period === 'week'
                ? detailingOptions.slice(0, 4)
                : period === 'month'
                ? detailingOptions.slice(1, 5)
                : period === 'days'
                ? detailingOptions.slice(0, 3)
                : detailingOptions.slice(5)
            }
            getOptionLabel={(option) => option.name}
            beforeContent='Детализация:'
          />
        </Box>
        <Body id={id + 'body'} isLoading={isLoading} isEmpty={data?.values < 1}>
          <ResponsiveContainer id={id} width='100%' height={350}>
            <AreaChart height={300} data={chartData.slice(sliderValue[0], sliderValue[1])}>
              <defs>
                <linearGradient id='gradient-area' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={'#109576'} stopOpacity={0.29} />
                  <stop offset='99.99%' stopColor={'#16BB63'} stopOpacity={0.1} />
                  <stop offset='100%' stopColor={'#16BB63'} stopOpacity={0.19} />
                </linearGradient>
                <linearGradient id='gradient-line' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={'#16BB63'} stopOpacity={1} />
                  <stop offset='100%' stopColor={'#109576'} stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id='gradient-area-1' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={purpleColor} stopOpacity={0.29} />
                  <stop offset='99.99%' stopColor={purpleColor} stopOpacity={0.1} />
                  <stop offset='100%' stopColor={purpleColor} stopOpacity={0.19} />
                </linearGradient>
                <linearGradient id='gradient-line-1' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={purpleColor} stopOpacity={1} />
                  <stop offset='100%' stopColor={purpleColor} stopOpacity={1} />
                </linearGradient>
              </defs>{' '}
              <defs>
                <linearGradient id='gradient-area-2' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={blueColor} stopOpacity={0.29} />
                  <stop offset='99.99%' stopColor={blueColor} stopOpacity={0.1} />
                  <stop offset='100%' stopColor={blueColor} stopOpacity={0.19} />
                </linearGradient>
                <linearGradient id='gradient-line-2' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={blueColor} stopOpacity={1} />
                  <stop offset='100%' stopColor={blueColor} stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='0' vertical={false} strokeWidth={2} stroke={paletteLight.grey[100]} strokeLinecap='round' />
              <XAxis
                dataKey='start_date'
                tickLine={false}
                axisLine={false}
                tick={<CustomizedAxisTick detalization={detalization} />}
                tickFormatter={(value) =>
                  detalization?.value === 'hour' || detalization?.value === '30min' ? getTimeFromDateTime(value) : getDateFromDateTime(value)
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickCount={sortBy === 'COUNT' ? maxValue + 1 : 5}
                tickFormatter={(value) => getShorterNumber(value, 0)}
              />
              <Tooltip
                content={<DashboardTooltip measurmentUnit={measurmentUnit} detalization={detalization} />}
                position={{ x: 100, y: -150 }}
                wrapperStyle={{ zIndex: 11 }}
              />
              <Area
                type='monotone'
                id={id + 'line'}
                dataKey={dataKey || 'value'}
                stroke={colorCode ? `url(#gradient-line-${colorCode})` : 'url(#gradient-line)'}
                fillOpacity={1}
                fill={colorCode ? `url(#gradient-area-${colorCode})` : 'url(#gradient-area)'}
                strokeWidth={4}
                activeDot={{
                  stroke: colorCode ? `url(#gradient-line-${colorCode})` : 'url(#gradient-line)',
                  strokeWidth: 4,
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <ChartSlider value={sliderValue} onChange={handleSliderChange} min={0} max={chartData?.length} />
        </Body>
      </Box>
    </Box>
  )
}
