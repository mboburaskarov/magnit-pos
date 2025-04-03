import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import thousandDivider from '../../utils/thousandDivider'
import Money from '../../src/assets/icons/Money'

export default function Transactions({ data, title, subTitle }) {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '24px',
        padding: '32px 25px',
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={'8px'}>
        <Box>
          <Typography lineHeight={'30px'} fontWeight={'600'} fontSize={'20px'}>
            {title}
          </Typography>
          <Typography color='orange.500' lineHeight={'30px'} fontWeight={'600'} fontSize={'20px'}>
            {subTitle}
          </Typography>
        </Box>
        <Box
          bgcolor={'orange.100'}
          sx={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}
        >
          <Money />
        </Box>
      </Box>
      <Box>
        <TableContainer px={'20px'}>
          <Table size='small'>
            {/* <TableHead sx={{ borderBottom: '1px solid', borderColor: 'gray.200', padding: '0' }}>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Продавец
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Заказ
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Продажи
              </TableCell>
            </TableHead> */}
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={item.name}>
                  <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}>
                    {index + 1}. {item.full_name}
                  </TableCell>
                  <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}>
                    {item.count}
                  </TableCell>
                  <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 0px 16px 0', color: 'dark.500' }}>
                    {thousandDivider(item.total_amount, 'сум')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
