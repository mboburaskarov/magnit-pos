import { useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Button, Select, MenuItem } from '@mui/material'
import { RadialBarChart, RadialBar, Tooltip, PolarAngleAxis } from 'recharts'
import SelectSimple from '../Select/SelectSimple'

const data = [
  { name: 'Toronto', orders: 30, revenue: 5690, fill: '#FE5000' },
  { name: 'New York', orders: 45, revenue: 8300, fill: '#FEC400' },
  { name: 'Phoenix', orders: 60, revenue: 10200, fill: '#00C49F' },
  { name: 'San Francisco', orders: 25, revenue: 3500, fill: '#0088FE' },
  { name: 'London', orders: 80, revenue: 15870, fill: '#FF8042' },
]

const radialChartData = data.map((item) => ({
  name: item.name,
  value: item.revenue,
  fill: item.fill,
}))

export default function TotalOrdersByCity() {
  const [period, setPeriod] = useState('This Month')

  const handlePeriodChange = (event) => setPeriod(event.target.value)

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const detailingOptions = [
    { name: 'By 30min', value: '30min' },
    { name: 'By hour', value: 'hour' },
    { name: 'By day', value: 'day' },
    { name: 'By week', value: 'week' },
    { name: 'By month', value: 'month' },
    { name: 'By year', value: 'year' },
  ]

  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '12px',
        padding: 2,
        maxWidth: 400,
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' sx={{ fontWeight: 600, fontSize: 22, lineHeight: '30px' }}>
          Total Order by City
        </Typography>
        <SelectSimple
          id={'detailing'}
          name={'detailing'}
          placeholder='Детализация'
          uncontrolled
          // onChange={setDetalization}
          minWidth={130}
          // value={detalization}
          fullWidth
          boxStyle={{ width: 120 }}
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

      {/* RadialBarChart */}
      <Box display='flex' padding={'37px'} width={'100%'} justifyContent='center' alignItems='center' position='relative'>
        <RadialBarChart width={340} height={340} innerRadius='40%' outerRadius='100%' barSize={15} data={radialChartData} startAngle={90} endAngle={450}>
          {/* <PolarAngleAxis type='number' domain={[0, 20000]} angleAxisId={0} tick={false} /> */}
          <RadialBar minAngle={15} background clockWise dataKey='value' />
          <Tooltip />
        </RadialBarChart>

        {/* Total Revenue Display */}
        <Box
          position='absolute'
          top='50%'
          left='50%'
          sx={{
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: 25, lineHeight: '40px' }}>
            ${totalRevenue.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Top Cities Table */}
      <Box mt={3}>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1, lineHeight: '30px', fontSize: 22 }}>
          Top Cities
        </Typography>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.name}>
                  <TableCell sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px', border: 'none' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px', border: 'none' }} align='center'>
                    {item.orders}
                  </TableCell>
                  <TableCell sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px', border: 'none' }} align='right'>
                    ${item.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View All Button */}
      <Box display='flex' justifyContent='center' mt={2}>
        <Button
          variant='outlined'
          sx={{
            borderColor: '#FE5000',
            width: 374,
            height: 40,
            color: '#FE5000',
            backgroundColor: '#fff',
            borderRadius: '50px',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  )
}
