import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusCell from '../../../../../components/AgGridTable/Cells/StatusCell'
import CheckAccess from '../../../../../components/CheckAccess'
import StyledTooltip from '../../../../../components/StyledTooltip'
import thousandDivider from '../../../../../utils/thousandDivider'
import { returns_list_statuses } from '../../../../assets/data/return-statuses'
import ArrowRight from '../../../../assets/icons/ArrowRight'
import DeleteIcon from '../../../../assets/icons/DeleteIcon'
import DownloadIcon from '../../../../assets/icons/DownloadIcon'
import LeftArrowIcon from '../../../../assets/icons/LeftArrow'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { ClockIcon } from '@mui/x-date-pickers-pro'
import FolderSearch from '../../../../assets/icons/step-progress/FolderSearch'
import SentFastIcon from '../../../../assets/icons/step-progress/SentFast'
import TimeQuarterIcon from '../../../../assets/icons/step-progress/TimeQuarter'
import TickIcon from '../../../../assets/icons/step-progress/Tick'
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ importsColumns, t, downloadNakladnoy, setOpenConfirmDialog, setStatusModal }) {
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const columns = importsColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,
        headerName: 'Номер',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' {...p} type='public_id' />),
      }
    }
    if (el.field === 'document_number') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => {
          const targetPath =
            p.data.status == 'completed' || p.data.status == 'canceled'
              ? `/products/transfer-completed/${p.data.id}`
              : p.data.status == 'new'
              ? `/products/transfer-sent-with-checking/${p.data.id}`
              : p.data.status == 'sent'
              ? `/products/transfer-get-with-checking/${p.data.id}`
              : p.data.status == 'checking'
              ? `/products/transfer-recheck-with-checking/${p.data.id}`
              : null

          return (
            <Typography
              whiteSpace={'pre-wrap'}
              fontWeight={'600'}
              color={p.data.status !== 'canceled' ? 'orange.500' : 'red.500'}
              fontSize={'16px'}
              lineHeight={'24px'}
              sx={{ cursor: targetPath ? 'pointer' : 'default' }}
              onClick={() => {
                if (targetPath) {
                  navigate(targetPath, {
                    state: {
                      prevFilter: values, // save current filter state here
                    },
                  })
                }
              }}
            >
              {p.data.name}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'до Аптека',
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace={'pre-wrap'}>{p.data?.to_store?.name}</Typography>),
      }
    }
    // if (el.field === 'created_by') {
    //   return {
    //     ...el,
    //     headerName: 'Создал',
    //     colId: el.field,
    //     cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.created_by} type='full_name' />),
    //   }
    // }
    // if (el.field === 'updated_by') {
    //   return {
    //     ...el,
    //     headerName: 'Отправитель',
    //     colId: el.field,
    //     cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.updated_by} type='full_name' />),
    //   }
    // }
    // if (el.field === 'accepted_by') {
    //   return {
    //     ...el,
    //     headerName: 'Завершил',
    //     colId: el.field,
    //     cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.accepted_by} type='full_name' />),
    //   }
    // }
    if (el.field === 'from_store_name') {
      return {
        ...el,
        headerName: 'oт Аптека',
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace={'pre-wrap'}>{p.data?.store?.name}</Typography>),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Сумма продажи',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Недостачи'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'red.500',
                  }}
                >
                  <LeftArrowIcon fill='transparent' color='#fff' />
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_retail_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Излишек'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'green.500',
                  }}
                >
                  <ArrowRight color='#fff' />
                </Box>
              </StyledTooltip>
              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'accepted_retail_sum'} />
            </Box>
          </>
        )),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Сумма поставки',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Недостачи'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'red.500',
                  }}
                >
                  <LeftArrowIcon fill='transparent' color='#fff' />
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_supply_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Излишек'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'green.500',
                  }}
                >
                  <ArrowRight color='#fff' />
                </Box>
              </StyledTooltip>
              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'accepted_supply_sum'} />
            </Box>
          </>
        )),
      }
    }
    if (el.field === 'status') {
      const isLoadedStage = (data, stage) => {
        const status = data?.status
        const stagesByStatus = {
          sent: [1],
          checking: [1, 2],
          completed: [1, 2, 3],
        }

        return !stagesByStatus[status]?.includes(stage)
      }

      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            onClick={() => setStatusModal(p?.data)}
            id={`${'status'}-${p.rowIndex}`}
            whiteSpace='pre-wrap'
            sx={{
              cursor: 'pointer',
              '& .step-title > p': {
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '24px',
                color: 'black',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                '& .loaded-bar': {
                  height: '10px',
                  flex: 1,
                  width: '24px',
                  marginX: '-2px',
                  backgroundColor: '#ffff',
                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: '8px',
                  background: `repeating-linear-gradient(
          45deg,
          #f0f0f0,
          #f0f0f0 5px,
          #e8e8e8 5px,
          #e8e8e8 10px
        )`,
                },
                '& .complated-bar': {
                  height: '10px',
                  flex: 1,
                  width: '24px',
                  marginX: '-2px',

                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: '8px',
                  background: `repeating-linear-gradient(
          45deg,
          #ff9f40,
          #ff9f50 5px,
          #ff7f40 5px,
          #ff7f00 10px
        )`,
                },
                '& .step-icon-box': {
                  backgroundColor: 'orange.500',
                  borderRadius: '50%',
                  width: '27px',
                  height: '27px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9,
                },
                '& .step-icon-box.loaded': {
                  backgroundColor: 'bunker.200',
                },
              }}
            >
              <Box className={`step-icon-box complated`}>
                <FolderSearch />
              </Box>
              <Box className={isLoadedStage(p?.data, 1) ? 'loaded-bar' : 'complated-bar'} />

              <Box className={`step-icon-box ${isLoadedStage(p?.data, 1) ? 'loaded' : 'complated'}`}>
                <SentFastIcon />
              </Box>
              <Box className={isLoadedStage(p?.data, 2) ? 'loaded-bar' : 'complated-bar'} />

              <Box className={`step-icon-box ${isLoadedStage(p?.data, 2) ? 'loaded' : 'complated'}`}>
                <TimeQuarterIcon />
              </Box>
              <Box className={isLoadedStage(p?.data, 3) ? 'loaded-bar' : 'complated-bar'} />

              <Box className={`step-icon-box ${isLoadedStage(p?.data, 3) ? 'loaded' : 'complated'}`}>
                <TickIcon />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mt: 1 }}>
              <Box className='step-title' sx={{ width: '27px', textAlign: 'center', flexShrink: 0 }}>
                <Typography></Typography>
              </Box>
              <Box sx={{ flex: 1 }} />

              <Box className='step-title' sx={{ width: '27px', textAlign: 'center', flexShrink: 0 }}>
                <Typography>{!isLoadedStage(p?.data, 1) && get(p, 'data.expected_count')}</Typography>
              </Box>
              <Box sx={{ flex: 1 }} />

              <Box className='step-title' sx={{ width: '27px', textAlign: 'center', flexShrink: 0 }}>
                <Typography>{!isLoadedStage(p?.data, 2) && get(p, 'data.scanned_count')}</Typography>
              </Box>
              <Box sx={{ flex: 1 }} />

              <Box className='step-title' sx={{ width: '27px', textAlign: 'center', flexShrink: 0 }}>
                <Typography>{!isLoadedStage(p?.data, 3) && get(p, 'data.accepted_count')}</Typography>
              </Box>
            </Box>
          </Box>
          // <StatusCell
          //   id={`products-status-${p.rowIndex}`}
          //   color={returns_list_statuses.find((el) => el.id === p.data.status)?.color}
          //   bgcolor={returns_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
          //   title={returns_list_statuses.find((el) => el.id === p.data.status)?.name}
          // />
        )),
      }
    }

    // if (el.field === 'import_date') {
    //   return {
    //     ...el,
    //     headerName: 'Завершение',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.['accepted_at'] ? dayjs(p.data?.['accepted_at']).format('DD.MM.YYYY HH:mm:ss') : '-'}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    if (el.field === 'accepted_amount') {
      return {
        ...el,
        headerName: 'Cумма',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Недостачи'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'red.500',
                  }}
                >
                  <LeftArrowIcon fill='transparent' color='#fff' />
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'shortage'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Излишек'}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: 'green.500',
                  }}
                >
                  <ArrowRight color='#fff' />
                </Box>
              </StyledTooltip>
              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'surplus'} />
            </Box>
          </>
        )),
      }
    }

    // if (el.field === 'received_count') {
    //   return {
    //     ...el,
    //     headerName: 'Количество',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <>
    //         <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
    //           <StyledTooltip title={'Недостачи'}>
    //             <Box
    //               sx={{
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 width: '20px',
    //                 height: '20px',
    //                 borderRadius: '50%',
    //                 bgcolor: 'red.500',
    //               }}
    //             >
    //               <LeftArrowIcon fill='transparent' color='#fff' />
    //             </Box>
    //           </StyledTooltip>

    //           <Box width={'10px'} />

    //           <SimpleText {...p} withDevider currency={''} type={'received_count'} />
    //         </Box>
    //         <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
    //           <StyledTooltip title={'Излишек'}>
    //             <Box
    //               sx={{
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 width: '20px',
    //                 height: '20px',
    //                 borderRadius: '50%',
    //                 bgcolor: 'green.500',
    //               }}
    //             >
    //               <ArrowRight color='#fff' />
    //             </Box>
    //           </StyledTooltip>
    //           <Box width={'10px'} />

    //           <SimpleText {...p} withDevider currency={''} type={'accepted_count'} />
    //         </Box>
    //       </>
    //     )),
    //   }
    // }

    // if (el.field === 'created_at') {
    //   return {
    //     ...el,
    //     headerName: 'Создание',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box width={'100%'} display='flex' justifyContent={'center'} alignItems={'center'}>
            <CheckAccess id={'can-download-transfer-nakladnoy'}>
              {(data.status == 'completed' || data.status == 'sent' || data.status == 'checking') && (
                <IconButton
                  onClick={() => downloadNakladnoy({ transfer_id: data.id })}
                  sx={{
                    width: 40,
                    mr: '5px',
                    height: 40,
                    borderRadius: 3,
                    p: '8px',
                    '& svg:first-child': {
                      fill: '#07259c !important',
                    },
                  }}
                >
                  <DownloadIcon color='#07259c' />
                </IconButton>
              )}
            </CheckAccess>
            <CheckAccess id={'can-delete-transfer'}>
              {data.status == 'new' && (
                <IconButton
                  onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                    p: '8px',
                    '& svg:first-child': {
                      fill: '#fe5000 !important',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CheckAccess>
          </Box>
        )),
      }
    }
  })

  return columns
}
