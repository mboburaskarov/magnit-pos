import RightArrowRound from '@icons/dashboard/RightArrowRound'
import SortIcon from '@icons/dashboard/SortIcon'
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { size } from 'lodash'
import { Link } from 'react-router-dom'

export default function DashboardTopsBox({
  data,
  title,
  tableData,
  subTitle,
  isLoading = true,
  href = false,
  collapseCount = 5,
  noData = {
    title: 'Информация не найдена',
    description: 'Данные за этот период не найдены',
  },
}) {
  const formattedData = data?.slice(0, collapseCount)

  return (
    <Box
      sx={{
        height: '100%',
        border: '1px solid #ECEDF2',
        borderRadius: '16px',
        p: '20px',
        pb: '4px',
        backgroundColor: 'white',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* ---------- HEADER ---------- */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb='8px'>
        <Box sx={{ width: '100%' }}>
          {isLoading ? (
            <>
              <Typography lineHeight='32px' fontWeight='700' fontSize='24px'>
                {title}
              </Typography>
              <Skeleton variant='text' width={80} height={24} sx={{ borderRadius: '8px' }} />
            </>
          ) : (
            <>
              <Typography lineHeight='32px' fontWeight='700' fontSize='24px'>
                {title}
              </Typography>
              <Typography color='orange.500' lineHeight='24px' fontWeight={600} fontSize='16px'>
                {subTitle}
              </Typography>
            </>
          )}
        </Box>

        {href && !isLoading && (
          <Link to={href}>
            <Box
              sx={{
                mr: '2px',
                cursor: 'pointer',
                '&:hover': {
                  '& rect': { stroke: '#333' },
                  '& path': { fill: '#333' },
                },
              }}
            >
              <RightArrowRound sx={{ fontSize: '25px' }} />
            </Box>
          </Link>
        )}
      </Box>

      {/* ---------- TABLE ---------- */}
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100% - 25px)',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '260px',
        }}
      >
        <TableContainer>
          <Table size='small'>
            {/* ---------- TABLE HEADER ---------- */}
            <TableHead
              sx={{
                backgroundColor: '#F7F7F7',
                '& .table-cell': {
                  color: 'bunker.300 !important',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  p: '12px 8px',
                  border: 'none',
                },
              }}
            >
              <TableRow>
                {tableData.map((el, index) => (
                  <TableCell
                    className='table-cell'
                    key={index}
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
                    <Box display='flex' alignItems='center' color='bunker.300'>
                      {el?.title}
                      {el?.sortable && !isLoading && (
                        <Box display='inline-flex' ml='2px'>
                          {/* placeholder sorting icon */}
                          <SortIcon />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* ---------- TABLE BODY ---------- */}
            {isLoading ? (
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
                    p: '16px 12px',
                  },
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {tableData.map((el, ind) => (
                      <TableCell className='table-cell' key={ind}>
                        <Skeleton
                          variant='rounded'
                          width={ind === 0 ? '60%' : ind === tableData.length - 1 ? '50%' : '80%'}
                          height={16}
                          sx={{ borderRadius: '8px' }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : size(formattedData) >= 1 ? (
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
                    p: '16px 12px',
                    color: 'dark.500',
                  },
                }}
              >
                {formattedData?.map((item, index) => {
                  const isFall = item?.percent < 0
                  const percent = item?.percent

                  return (
                    <TableRow key={index}>
                      {tableData.map((el, ind) => {
                        if (el?.colId === 'name' || el?.colId === 'full_name') {
                          return (
                            <TableCell
                              key={ind}
                              className='table-cell'
                              sx={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {index + 1}. {item[el?.colId]}
                            </TableCell>
                          )
                        }

                        if (el?.colId === 'count') {
                          return (
                            <TableCell key={ind} className='table-cell'>
                              {item.unit_per_pack > 1
                                ? item[el?.colId] > 0
                                  ? `${item[el?.colId]}(${item.unit_quantity}/${item.unit_per_pack})`
                                  : `(${item.unit_quantity}/${item.unit_per_pack})`
                                : thousandDivider(item[el?.colId])}
                            </TableCell>
                          )
                        }

                        if (el?.colId === 'total_amount' || el?.colId === 'amount' || el?.colId === 'bonus_amount') {
                          return (
                            <TableCell key={ind} className='table-cell'>
                              {thousandDivider(item[el?.colId], 'сум')}
                            </TableCell>
                          )
                        }

                        if (el?.colId === 'stat') {
                          return (
                            <TableCell key={ind} className='table-cell' sx={{ textAlign: 'end' }}>
                              <Box
                                display='inline-flex'
                                alignItems='center'
                                sx={{
                                  borderRadius: '16px',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                  height: '20px',
                                  width: 'fit-content',
                                  backgroundColor: !isFall ? '#30BE821A' : '#F45B691A',
                                }}
                              >
                                <Typography
                                  component='span' // ✅ fix nested <p> warning
                                  padding='3px 8px'
                                  color={isFall ? '#F45B69' : '#30BE82'}
                                  textAlign='center'
                                  fontWeight='500'
                                  fontSize={12}
                                  lineHeight='16px'
                                >
                                  {!isFall ? '+' : ''} {percent <= 999 || percent == undefined ? thousandDivider(percent) : 999}%
                                </Typography>
                              </Box>
                            </TableCell>
                          )
                        }

                        return null
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            ) : (
              // ---------- NO DATA ----------
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '160px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  top: '80px',
                  position: 'absolute',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '24px',
                    lineHeight: '32px',
                    fontWeight: '600',
                    color: 'bunker.950',
                  }}
                >
                  {noData?.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '18px',
                    lineHeight: '28px',
                    fontWeight: '500',
                    color: 'bunker.500',
                  }}
                >
                  {noData?.description}
                </Typography>
              </Box>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
