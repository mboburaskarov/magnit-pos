import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import FallIcon from '../../src/assets/icons/FallIcon'
import GrowIcon from '../../src/assets/icons/GrowIcon'
import Money from '../../src/assets/icons/Money'
import { calculatePercentage } from '../../utils/calculatePercentage'
import thousandDivider from '../../utils/thousandDivider'

export default function Transactions({ data, title, subTitle }) {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        border: '1px solid #A4A5AB33',
        borderRadius: '24px',
        padding: '32px 25px',
        backgroundColor: 'bg.10',
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
            <TableHead sx={{ borderBottom: '1px solid', borderColor: 'gray.200', padding: '0' }}>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Продавец
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 16px 16px 0', border: 'none', color: 'dark.500' }}>
                Количество
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Продажи
              </TableCell>
              <TableCell sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '28px', p: '16px 0px 16px 0', border: 'none', color: 'dark.500' }}>
                Прирост
              </TableCell>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => {
                const isFall = calculatePercentage(item.previous_total_amount || 1, item.count) > 0
                const percent = calculatePercentage(item.previous_total_amount || 1, item.count)
                return (
                  <TableRow key={item.name}>
                    <TableCell
                      sx={{ width: 'auto', fontSize: '16px', fontWeight: 600, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}
                    >
                      {index + 1}. {item.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '28px', border: 'none', p: '16px 16px 16px 0', color: 'dark.500' }}>
                      {item.count}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'start',
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: '28px',
                        border: 'none',
                        p: '16px 0px 16px 0',
                        color: 'dark.500',
                      }}
                    >
                      {thousandDivider(item.amount, 'сум')}
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
      </Box>
    </Box>
  )
}
