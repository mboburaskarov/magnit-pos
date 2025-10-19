import { FormatLineSpacing } from '@mui/icons-material'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import FallIcon from '../../src/assets/icons/FallIcon'
import GrowIcon from '../../src/assets/icons/GrowIcon'
import thousandDivider from '../../utils/thousandDivider'
import { useNavigateWithParams } from '../../src/hooks/useNavigateWithParams'

export default function TotalOrdersByCity({ data }) {
  const { t } = useTranslation()
  const [isCollapse, setIsCollapse] = useState(false)
  const formattedData = isCollapse ? data : data?.slice(0, 5)
  const navigate = useNavigate()
  const { navigateWithParams } = useNavigateWithParams()

  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '24px',
        padding: '32px 25px',
        backgroundColor: 'bg.10',
        width: '100%',
        position: 'relative',
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={'8px'}>
        <Typography lineHeight={'30px'} fontWeight={'600'} fontSize={'20px'}>
          Топ филиалам
        </Typography>
        <Box
          onClick={() => navigateWithParams('/reports/top-branchs?backHref=/dashboard', { keep: true })}
          sx={{
            padding: '10px',
            position: 'absolute',
            right: '20px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              background: '#ebebeb',
            },
          }}
        >
          <FormatLineSpacing sx={{ fontSize: '25px' }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', height: 'calc(100% - 25px)', justifyContent: 'space-between', flexDirection: 'column' }}>
        <TableContainer px={'20px'}>
          <Table size='small'>
            <TableHead sx={{ borderBottom: '1px solid', borderColor: 'gray.200', padding: '0' }}>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Филиал
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Кол-во чеков
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Сумма продажи
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Прирост
              </TableCell>
            </TableHead>
            <TableBody>
              {formattedData?.map((item, index) => {
                const isFall = item?.percent > 0
                const percent = item?.percent
                return (
                  <TableRow key={item.name}>
                    <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}>
                      {index + 1}. {item.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}>
                      {item.count}
                    </TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 0px 16px 0', color: 'dark.500' }}>
                      {thousandDivider(item.total_amount, 'сум')}
                    </TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', border: 'none', p: '16px 0px 16px 0', color: 'dark.500' }}>
                      <Box
                        display='inline-flex'
                        sx={{
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 5px',
                          margin: '5px',

                          backgroundColor: !isFall ? '#30BE821A' : '#F45B691A',
                        }}
                        alignItems='center'
                      >
                        {!isFall ? <GrowIcon /> : <FallIcon />}{' '}
                        <Typography color={isFall ? '#F45B69' : '#30BE82'} fontWeight='500' mr={0.5} fontSize={14} lineHeight={'18px'}>
                          {percent}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
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
