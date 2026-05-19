import { Eye } from 'lucide-react'
import SortIcon from '@icons/dashboard/SortIcon'
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { size } from 'lodash'
import { Link, useLocation } from 'react-router-dom'
import './magnit-dashboard.css'

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
  const location = useLocation()

  const formattedData = data?.slice(0, collapseCount)
  const from = location.pathname + location.search

  return (
    <div className="mdash-kpi-card" style={{ height: '100%', position: 'relative', borderRadius: '16px', padding: '20px 20px 8px 20px' }}>
      {/* ---------- HEADER ---------- */}
      <div className="mdash-chart-header" style={{ marginBottom: '12px' }}>
        <div>
          {isLoading ? (
            <>
              <h3 className="mdash-chart-title">{title}</h3>
              <Skeleton variant='text' width={80} height={24} />
            </>
          ) : (
            <>
              <h3 className="mdash-chart-title">{title}</h3>
              <p className="mdash-chart-subtitle" style={{ color: '#6B7280', fontWeight: 500 }}>{subTitle}</p>
            </>
          )}
        </div>

        {href && !isLoading && (
          <Link to={href} state={{ from }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#667085', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#111'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#667085'; }}
            >
              <Eye size={16} />
            </div>
          </Link>
        )}
      </div>

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
                '& .table-cell': {
                  color: '#9CA3AF !important',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  p: '10px 8px',
                  border: 'none',
                  borderBottom: '1px solid #F3F4F6',
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
                    <Box display='flex' alignItems='center'>
                      {el?.title}
                      {el?.sortable && !isLoading && (
                        <Box display='inline-flex' ml='4px'>
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
                    borderBottom: '1px solid #F3F4F6',
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
                          sx={{ borderRadius: '4px' }}
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
                    borderBottom: '1px solid #F3F4F6',
                  },
                  '& .table-cell': {
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    border: 'none',
                    p: '16px 12px',
                    color: '#111827',
                  },
                }}
              >
                {formattedData?.map((item, index) => {
                  const isFall = item?.percent < 0
                  const percent = item?.percent

                  return (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
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
                            <TableCell key={ind} className='table-cell' sx={{ fontWeight: 600 }}>
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
                                  borderRadius: '6px',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                  padding: '4px 8px',
                                  backgroundColor: !isFall ? '#D1FAE5' : '#FEE2E2',
                                  color: !isFall ? '#059669' : '#DC2626',
                                  fontWeight: 600,
                                  fontSize: '12px'
                                }}
                              >
                                  {!isFall ? '+' : ''} {percent <= 999 || percent == undefined ? thousandDivider(percent) : 999}%
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
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                  }}
                >
                  {noData?.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#6B7280',
                    mt: '4px'
                  }}
                >
                  {noData?.description}
                </Typography>
              </Box>
            )}
          </Table>
        </TableContainer>
      </Box>
    </div>
  )
}
