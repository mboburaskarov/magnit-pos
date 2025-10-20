import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import thousandDivider from '../../utils/thousandDivider'
import { useNavigateWithParams } from '../../src/hooks/useNavigateWithParams'
import RightArrowRound from '../../src/assets/icons/dashboard/RightArrowRound'
import SortIcon from '../../src/assets/icons/dashboard/SortIcon'
import SortUpIcon from '../../src/assets/icons/dashboard/SortUpIcon'
import SortDownIcon from '../../src/assets/icons/dashboard/SortDownIcon'

export default function DashboardTopsBox({ data, title, tableData, subTitle, href = false }) {
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
        padding: '20px',
        backgroundColor: 'white',
        width: '100%',
        position: 'relative',
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={'8px'}>
        <Box>
          <Typography lineHeight={'32px'} fontWeight={'700'} fontSize={'24px'}>
            {title}
          </Typography>
          <Typography color='orange.500' lineHeight={'24px'} fontWeight={600} fontSize={'16px'}>
            {subTitle}
          </Typography>
        </Box>
        {href && (
          <Link to={href}>
            <Box
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
          </Link>
        )}
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
              {tableData.map((el, index) => (
                <TableCell
                  className='table-cell'
                  key={el?.id}
                  sx={{
                    ...(index === 0 && {
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                    }),
                    ...(el?.sortable && { cursor: 'pointer' }),
                    ...(index + 1 === tableData.length && {
                      borderTopRightRadius: '8px',
                      borderBottomRightRadius: '8px',
                    }),
                  }}
                >
                  <Box display={'flex'} color={'bunker.300'} alignItems={'center'}>
                    {el?.title}{' '}
                    {el?.sortable && (
                      <Box display={'inline-flex'} ml='2px'>
                        {false ? <SortUpIcon /> ? false : <SortDownIcon /> : <SortIcon />}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableRow-root:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'bunker.100',
                },
                '& .table-cell': {
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  border: 'none',
                  p: '12px 8px',
                  color: 'dark.500',
                },
              }}
            >
              {formattedData?.map((item, index) => {
                const isFall = item?.percent < 0
                const percent = item?.percent
                return (
                  <TableRow key={item.name}>
                    {tableData.map((el, ind) => {
                      if (el?.colId == 'name' || el?.colId == 'full_name') {
                        return (
                          <TableCell
                            sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxLines: 1 }}
                            className='table-cell'
                          >
                            {index + 1}. {item[el?.colId]}
                          </TableCell>
                        )
                      }

                      if (el?.colId == 'count') {
                        return (
                          <TableCell className='table-cell'>
                            {item.unit_per_pack > 1
                              ? item[el?.colId] > 0
                                ? `${item[el?.colId]}(${item.unit_quantity}/${item.unit_per_pack})`
                                : `(${item.unit_quantity}/${item.unit_per_pack})`
                              : item[el?.colId]}
                          </TableCell>
                        )
                      }
                      if (el?.colId == 'total_amount' || el?.colId == 'amount' || el?.colId == 'bonus_amount') {
                        return <TableCell className='table-cell'>{thousandDivider(item[el?.colId], 'сум')}</TableCell>
                      }
                      if (el?.colId == 'stat') {
                        return (
                          <TableCell className='table-cell'>
                            <Box
                              display='inline-flex'
                              sx={{
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '20px',
                                width: 'fit-content',
                                backgroundColor: !isFall ? '#30BE821A' : '#F45B691A',
                              }}
                              alignItems='center'
                            >
                              <Typography
                                padding={'3px 8px'}
                                color={isFall ? '#F45B69' : '#30BE82'}
                                textAlign={'center'}
                                fontWeight='500'
                                fontSize={12}
                                lineHeight={'16px'}
                              >
                                {!isFall ? '+' : ''} {percent}%
                              </Typography>
                            </Box>
                          </TableCell>
                        )
                      }
                    })}
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
