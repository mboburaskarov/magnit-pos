import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import CheckAccess from '@components/CheckAccess'
import StyledTooltip from '@components/StyledTooltip'
import { useQueryParams } from '@hooks/useQueryParams'
import ArrowRight from '@icons/ArrowRight'
import DeleteIcon from '@icons/DeleteIcon'
import DownloadIcon from '@icons/DownloadIcon'
import LeftArrowIcon from '@icons/LeftArrow'
import FolderSearch from '@icons/step-progress/FolderSearch'
import SentFastIcon from '@icons/step-progress/SentFast'
import TickIcon from '@icons/step-progress/Tick'
import TimeQuarterIcon from '@icons/step-progress/TimeQuarter'
import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import IndicatorBadge from '@components/IndicatorBadge'

export default function tableHeaderSelector({ transferColumns, t, downloadNakladnoy, setOpenConfirmDialog, setStatusModal }) {
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname + location.search
  const columns = transferColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return <Typography>{absoluteIndex}</Typography>
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
            <Link to={targetPath} state={{ from }}>
              <Typography
                whiteSpace={'pre-wrap'}
                fontWeight={500}
                color={p.data.status !== 'canceled' ? 'orange.500' : 'red.500'}
                sx={{ cursor: targetPath ? 'pointer' : 'default' }}
              >
                {p.data.name}
              </Typography>
            </Link>
          )
        }),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'до Магазин',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'store_name'} customText={p.data?.to_store?.name} />),
      }
    }

    if (el.field === 'from_store_name') {
      return {
        ...el,
        headerName: 'oт Магазин',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'from_store_name'} customText={p.data?.store?.name} />),
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
              <IndicatorBadge tooltip='Недостачи' type='<' bgcolor='red.500' />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_retail_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <IndicatorBadge tooltip='Излишек' type='>' bgcolor='green.500' />
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
              <IndicatorBadge tooltip='Недостачи' type='<' bgcolor='red.500' />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_supply_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <IndicatorBadge tooltip='Излишек' type='>' bgcolor='green.500' />
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

      const formatCount = (val) => {
        if (val === undefined || val === null) return ''
        const num = Number(val)
        if (isNaN(num)) return val
        return num % 1 === 0 ? num : parseFloat(num.toFixed(1))
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: '4px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                '& .loaded-bar': {
                  height: '4px',
                  flex: 1,
                  marginX: '-2px',
                  backgroundColor: '#ECEDF2',
                  borderRadius: '2px',
                },
                '& .complated-bar': {
                  height: '4px',
                  flex: 1,
                  marginX: '-2px',
                  backgroundColor: '#111217',
                  borderRadius: '2px',
                },
                '& .step-icon-box': {
                  backgroundColor: '#111217',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9,
                  '& svg': {
                    width: '14px',
                    height: '14px',
                    color: '#fff',
                    fill: 'none',
                  },
                },
                '& .step-icon-box.loaded': {
                  backgroundColor: '#ECEDF2',
                  '& svg': {
                    color: '#A0A5BA',
                  },
                },
              }}
            >
              <Box className={`step-icon-box complated`}>
                <FolderSearch />
              </Box>
              <Box className={isLoadedStage(p?.data, 1) ? 'loaded-bar' : 'complated-bar'} />

              <Box className={`step-icon-box ${isLoadedStage(p?.data, 1) ? 'loaded' : 'complated'}`}>
                <SentFastIcon color='#fff' />
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

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                mt: '4px',
                '& .step-title-text': {
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#111217',
                  lineHeight: '1.2',
                  textAlign: 'center',
                },
              }}
            >
              <Box sx={{ width: '26px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Typography className='step-title-text'></Typography>
              </Box>
              <Box sx={{ flex: 1, marginX: '-2px' }} />

              <Box sx={{ width: '26px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Typography className='step-title-text'>
                  {!isLoadedStage(p?.data, 1) && formatCount(get(p, 'data.expected_count'))}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, marginX: '-2px' }} />

              <Box sx={{ width: '26px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Typography className='step-title-text'>
                  {!isLoadedStage(p?.data, 2) && formatCount(get(p, 'data.scanned_count'))}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, marginX: '-2px' }} />

              <Box sx={{ width: '26px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <Typography className='step-title-text'>
                  {!isLoadedStage(p?.data, 3) && formatCount(get(p, 'data.accepted_count'))}
                </Typography>
              </Box>
            </Box>
          </Box>
        )),
      }
    }

    if (el.field === 'accepted_amount') {
      return {
        ...el,
        headerName: 'Cумма',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <IndicatorBadge tooltip='Недостачи' type='<' bgcolor='red.500' />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'shortage'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <IndicatorBadge tooltip='Излишек' type='>' bgcolor='green.500' />
              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'surplus'} />
            </Box>
          </>
        )),
      }
    }

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
                    '& svg:first-of-type': {
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
                    '& svg:first-of-type': {
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
