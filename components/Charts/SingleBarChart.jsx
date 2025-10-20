import { FormatLineSpacing } from '@mui/icons-material'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import FallIcon from '../../src/assets/icons/FallIcon'
import GrowIcon from '../../src/assets/icons/GrowIcon'
import thousandDivider from '../../utils/thousandDivider'
import { useNavigateWithParams } from '../../src/hooks/useNavigateWithParams'
import RightArrowRound from '../../src/assets/icons/dashboard/RightArrowRound'
import SortIcon from '../../src/assets/icons/dashboard/SortIcon'

export default function TotalOrdersByCity({ data }) {
  const { t } = useTranslation()
  const [isCollapse, setIsCollapse] = useState(false)
  const formattedData = isCollapse ? data : data?.slice(0, 5)
  const navigate = useNavigate()
  const { navigateWithParams } = useNavigateWithParams()

  return (
    <Box
      sx={{
        border: '1px solid #ECEDF2',
        borderRadius: '16px',
        padding: '32px 25px',
        backgroundColor: 'white',
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
            cursor: 'pointer',
            '&:hover': {
              '& rect': {
                stroke: '#333',
              },
              '& path': {
                fill: '#333',
              },
            },
          }}
        >
          <RightArrowRound sx={{ fontSize: '25px' }} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100% - 25px)',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <TableContainer px={'20px'}>
          <Table size='small'>
            <TableHead
              sx={{
                backgroundColor: '#F7F7F7',
                overflow: 'hidden',
                '& .table-cell': {
                  color: 'bunker.300 !important',
                  fontSize: '14px',
                  fontWeight: 600,
                  alignItems: 'center',
                  lineHeight: '20px',
                  p: '12px 8px',
                  border: 'none',
                },
              }}
            >
              <TableCell
                className='table-cell'
                sx={{
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
              >
                Филиал
              </TableCell>
              <TableCell className='table-cell'>
                Кол-во <SortIcon />
              </TableCell>
              <TableCell className='table-cell'>
                Сумма <SortIcon />
              </TableCell>
              <TableCell
                className='table-cell'
                sx={{
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                Прирост
              </TableCell>
            </TableHead>
            <TableBody
              sx={{
                '& .table-cell': {
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  border: 'none',
                  p: '16px 12px',
                  color: 'dark.500',
                },
              }}
            >
              {formattedData?.map((item, index) => {
                const isFall = item?.percent > 0
                const percent = item?.percent
                return (
                  <TableRow key={item.name}>
                    <TableCell className='table-cell'>
                      {index + 1}. {item.name}
                    </TableCell>
                    <TableCell className='table-cell'>{item.count}</TableCell>
                    <TableCell className='table-cell'>{thousandDivider(item.total_amount, 'сум')}</TableCell>
                    <TableCell className='table-cell'>
                      <Box
                        display='inline-flex'
                        sx={{
                          borderRadius: '16px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '5px',
                          textAlign: 'center',
                          height: '20px',
                          backgroundColor: !isFall ? '#30BE821A' : '#F45B691A',
                        }}
                        alignItems='center'
                      >
                        <Typography color={isFall ? '#F45B69' : '#30BE82'} textAlign={'center'} fontWeight='500' fontSize={12} lineHeight={'16px'}>
                          {!isFall ? '+' : ''} {percent}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Button sx={{ width: '100%' }} color='secondary' onClick={() => setIsCollapse((a) => !a)}>
          {isCollapse ? 'Показать меньше' : `Показать больше`}
        </Button> */}
      </Box>
    </Box>
  )
}
