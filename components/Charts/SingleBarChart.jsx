import { useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Button, Select, MenuItem, TableHead } from '@mui/material'
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
    { name: 'Shu 30min', value: '30min' },
    { name: 'Shu soat', value: 'hour' },
    { name: 'Bu oy', value: 'day' },
    { name: 'Bu hafta', value: 'week' },
    { name: 'Bu Oy', value: 'month' },
    { name: 'Bu yil', value: 'year' },
  ]

  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '32px',
        padding: '16px 4px',
        // maxWidth: 414,
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' px={'16px'} mb={2}>
        <Typography variant='h6' sx={{ fontWeight: 700, fontSize: 26, lineHeight: '32px' }}>
          Filiallar bo’yicha
        </Typography>
        <SelectSimple
          id={'detailing'}
          name={'detailing'}
          placeholder='Tanlang'
          uncontrolled
          // onChange={setDetalization}
          minWidth={120}
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
      <Box display='flex' px={'37px'} width={'100%'} justifyContent='center' alignItems='center' position='relative'>
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
        <Typography variant='subtitle1' sx={{ fontWeight: 700, padding: '6px 16px', fontSize: 26, lineHeight: '32px' }}>
          Top Cities
        </Typography>
        <TableContainer>
          <Table size='small'>
            <TableHead sx={{ mb: '25px' }}>
              <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Filial</TableCell>
              <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Buyurtma</TableCell>
              <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Sotuvlar</TableCell>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.name}>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>{item.orders}</TableCell>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>
                    ${item.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View All Button */}
      <Box display='flex' justifyContent='center' mt={2} px={'16px'}>
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
          Barchasi
        </Button>
      </Box>
    </Box>
  )
}
