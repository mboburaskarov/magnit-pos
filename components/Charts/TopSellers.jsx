import { FormatLineSpacing } from '@mui/icons-material'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import thousandDivider from '../../utils/thousandDivider'

export default function TopSellers({ data }) {
  const { t } = useTranslation()
  const [isCollapse, setIsCollapse] = useState(false)
  const formattedData = isCollapse ? data : data?.slice(0, 5)
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '24px',
        padding: '32px 25px',
        backgroundColor: '#fff',
        width: '100%',
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={'8px'}>
        <Typography lineHeight={'30px'} fontWeight={'600'} fontSize={'20px'}>
          Топ продавцы
        </Typography>
        <Box onClick={() => navigate('/reports/top-vendors')}>
          <FormatLineSpacing sx={{ fontSize: '25px' }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', height: 'calc(100% - 25px)', justifyContent: 'space-between', flexDirection: 'column' }}>
        <TableContainer px={'20px'}>
          <Table size='small'>
            <TableHead sx={{ borderBottom: '1px solid', borderColor: 'gray.200', padding: '0' }}>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Продавец
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Заказ
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Продажи
              </TableCell>
            </TableHead>
            <TableBody>
              {formattedData?.map((item, index) => (
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
        <Button sx={{ width: '100%' }} color='secondary' onClick={() => setIsCollapse((a) => !a)}>
          {isCollapse ? 'Показать меньше' : `Показать больше`}
        </Button>
      </Box>
    </Box>
  )
}
