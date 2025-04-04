import { Box, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import getShorterNumber from '../../utils/getShorterNumber'
import { getDateFromDateTime } from '../../utils/parseDateTime'
import LoadingBlurry from '../LoadingBlurry'
import SelectSimple from '../Select/SelectSimple'
import CustomizedAxisTick from './ChartAxisTick'
import ChartPlaceholder from './ChartPlaceholder'
import ChartSlider from './ChartSlider'
import DashboardTooltip from './DashboardTooltip'

const detailingOptions = [
  { name: 'Это 30 минут', value: '30min' },
  { name: 'Это час', value: 'hour' },
  { name: 'Сегодня', value: 'day' },
  { name: 'На этой неделе', value: 'week' },
  { name: 'Это месяц', value: 'month' },
  { name: 'В этом году', value: 'year' },
]

const purpleColor = '#a811d6'
const blueColor = '#0F6FD7'
const newColor = '#FE5000' // The color you want to use
const orangeColor = '#ffb18e'
const Body = ({ children, isLoading, isEmpty }) => (
  <Box
    position='relative'
    sx={(theme) => ({
      width: '100%',
      height: '100%',
      fontFamily: theme.fontFamily.Gilroy,
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '17px',
      color: theme.palette.gray[600],
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

export default function SingleBarChart({
  title,
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
    }
  }, [data, detalization])
  const maxValue = Math.max(...chartData.slice(sliderValue[0], sliderValue[1]).map((item) => item?.count))

  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: '#A4A5AB33',
        width: boxWidth,
        minHeight: 432,
        borderRadius: 6,
        backgroundColor: theme.palette.background.default,
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
              <Typography
                sx={(theme) => ({
                  fontSize: 22,
                  lineHeight: '30px',
                  fontWeight: 600,
                  fontFamily: theme.fontFamily.Gilroy,
                  color: theme.palette.dark[500],
                })}
              >
                {t('all_sales')}
              </Typography>
            </Box>
          )}
          <SelectSimple
            id={id + 'detailing'}
            name={id + 'detailing'}
            placeholder='Детализация'
            uncontrolled
            isSearchable={false}
            onChange={setDetalization}
            minWidth={130}
            value={detalization}
            fullWidth
            boxStyle={{ width: 157 }}
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
            beforeContent=''
          />
        </Box>
        <Body isLoading={isLoading} isEmpty={!chartData.length}>
          <ResponsiveContainer width='100%' height={350}>
            <AreaChart data={chartData.slice(sliderValue[0], sliderValue[1])}>
              <defs>
                <linearGradient id='gradient-fill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={orangeColor} stopOpacity={0.3} />
                  <stop offset='100%' stopColor={orangeColor} stopOpacity={0.1} />
                </linearGradient>
                {/* <linearGradient id='ikki' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={orangeColor} stopOpacity={0.3} />
                  <stop offset='100%' stopColor={orangeColor} stopOpacity={0.1} />
                </linearGradient> */}
              </defs>

              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='start_date'
                tickLine={false}
                axisLine={false}
                tick={<CustomizedAxisTick detalization={detalization} />}
                tickFormatter={(value) => getDateFromDateTime(value)}
              />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => getShorterNumber(value, 0)} />
              <Tooltip
                content={<DashboardTooltip measurmentUnit={measurmentUnit} detalization={detalization} />}
                // position={{ x: 100, y: -150 }}
                wrapperStyle={{ zIndex: 11 }}
              />
              <Area
                type='monotone'
                dataKey={dataKey || 'value'}
                stroke={'#fe5000'}
                fill='url(#gradient-fill)'
                strokeWidth={3}
                activeDot={{
                  r: 6,
                  stroke: orangeColor,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
              />
              {/* <Area
                type='monotone'
                dataKey={'all_orders2' || 'value'}
                stroke={'#fe5000'}
                fill='url(#ikki)'
                strokeWidth={3}
                activeDot={{
                  r: 6,
                  stroke: orangeColor,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
              /> */}
            </AreaChart>
          </ResponsiveContainer>
          <ChartSlider value={sliderValue} onChange={handleSliderChange} min={0} max={chartData?.length} />
        </Body>
      </Box>
    </Box>
  )
}
