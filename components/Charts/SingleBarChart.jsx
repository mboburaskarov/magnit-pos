import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import thousandDivider from '../../utils/thousandDivider'

const data = [
  { name: 'OQTEPA', orders: 30, revenue: 5690, fill: '#FE5000' },
  { name: 'SERGELI 8', orders: 45, revenue: 8300, fill: '#FEC400' },
  { name: 'QUSHBEGI', orders: 60, revenue: 10200, fill: '#00C49F' },
  { name: 'SEBZOR', orders: 25, revenue: 3500, fill: '#0088FE' },
  { name: 'UCHTEPA', orders: 80, revenue: 15870, fill: '#FF8042' },
]

export default function TotalOrdersByCity({ data }) {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '24px',
        padding: '20px 8px',
        backgroundColor: '#fff',
        height: '100%',
        minWidth: '500px',
      }}
    >
      <Box mx={'16px'} borderBottom='1px solid' borderColor='gray.200' display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography mt={'8px'} pb={2.5} fontSize={24}>
          По филиалам
        </Typography>
        {/* <SelectSimple
          id={'detailing'}
          name={'detailing'}
          placeholder='Tanlang'
          uncontrolled
          onChange={setDetalization}
          minWidth={120}
          value={detalization}
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
        /> */}
      </Box>

      <Box>
        {/* <Typography px={'16px'} variant='subtitle1' sx={{ fontWeight: 700, fontSize: 26, lineHeight: '32px' }}>
          Верхние ветки
        </Typography> */}
        <TableContainer px={'20px'}>
          <Table size='small'>
            <TableHead sx={{ mb: '25px', padding: '0' }}>
              <TableCell sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Филиал</TableCell>
              <TableCell sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Заказ</TableCell>
              <TableCell sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '28px', border: 'none', color: 'dark.500' }}>Продажи</TableCell>
            </TableHead>
            <TableBody>
              {data?.map((item) => (
                <TableRow key={item.name}>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>{item.count}</TableCell>
                  <TableCell sx={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px', border: 'none', color: 'dark.500' }}>
                    {/* ${item.revenue.toLocaleString()} */}
                    {thousandDivider(item.total_amount, 'сум')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View All Button */}
      {/* <Box display='flex' justifyContent='center' mt={2}>
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
          {t('all')}
        </Button>
      </Box> */}
    </Box>
  )
}
