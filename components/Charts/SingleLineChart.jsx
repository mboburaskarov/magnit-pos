import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Skeleton } from '@mui/material'
import { XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart, ResponsiveContainer } from 'recharts'
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
  { name: 'By 30min', value: '30min' },
  { name: 'By hour', value: 'hour' },
  { name: 'By day', value: 'day' },
  { name: 'By week', value: 'week' },
  { name: 'By month', value: 'month' },
  { name: 'By year', value: 'year' },
]

const purpleColor = '#a811d6'
const blueColor = '#0F6FD7'
const newColor = '#FE5000' // The color you want to use

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
  title = 'Barcha sotuvlar',
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
        border: 1,
        borderRadius: 4,
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
                {title}
              </Typography>
              {/* {!!data?.total && (
                <Typography
                  sx={(theme) => ({
                    fontSize: 24,
                    lineHeight: '28px',
                    color: 'green.500',
                    marginLeft: 2,
                  })}
                >
                  {thousandDivider(data?.total || 0)} {measurmentUnit}
                </Typography>
              )} */}
            </Box>
          )}
          <SelectSimple
            id={id + 'detailing'}
            name={id + 'detailing'}
            placeholder='Детализация'
            uncontrolled
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
        <Body id={id + 'body'} isLoading={isLoading} isEmpty={data?.values < 1}>
          <ResponsiveContainer id={id} width='100%' height={350}>
            <BarChart height={300} data={chartData.slice(sliderValue[0], sliderValue[1])}>
              <CartesianGrid strokeDasharray='0' vertical={false} strokeWidth={2} stroke={paletteLight.gray[100]} strokeLinecap='round' />
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
              <Bar
                dataKey={dataKey || 'value'}
                fill={newColor} // Set the color of the bars to #FE5000
                radius={[30, 30, 30, 30]} // Rounded bars
                maxBarSize={30} // Max bar width
              />
            </BarChart>
          </ResponsiveContainer>
          <ChartSlider value={sliderValue} onChange={handleSliderChange} min={0} max={chartData?.length} />
        </Body>
      </Box>
    </Box>
  )
}
