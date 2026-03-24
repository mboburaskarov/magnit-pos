import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import { returns_list_statuses } from '@/assets/data/return-statuses'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import ButtonWithPopup from '@components/Buttons/ButtonWithPopup'
import { Box, IconButton, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import StyledTooltip from '@components/StyledTooltip'
import CheckAccess from '@components/CheckAccess'
import DownloadIcon from '@icons/DownloadIcon'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LeftArrowIcon from '@icons/LeftArrow'
import DeleteIcon from '@icons/DeleteIcon'
import ArrowRight from '@icons/ArrowRight'
import { memo } from 'react'
import { get } from 'lodash'
import dayjs from 'dayjs'
import * as qs from 'qs'

export default function tableHeaderSelector({ importsColumns, t, downloadNakladnoy, setOpenConfirmDialog }) {
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname + location.search

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
    if (el.field === 'created_by') {
      return {
        ...el,
        headerName: 'Создал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.created_by} type='full_name' />),
      }
    }
    if (el.field === 'updated_by') {
      return {
        ...el,
        headerName: 'Отправитель',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.updated_by} type='full_name' />),
      }
    }
    if (el.field === 'accepted_by') {
      return {
        ...el,
        headerName: 'Завершил',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' data={p?.data?.accepted_by} type='full_name' />),
      }
    }
    if (el.field === 'document_number') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => {
          const targetPath =
            p.data.status == 'completed' || p.data.status == 'canceled' || p.data.status == 'sent-to-1c'
              ? `/products/return-to-warehouse-completed/${p.data.id}?${qs.stringify({
                  previusLimit: values?.limit,
                  previusOffset: values?.offset,
                })}`
              : p.data.status == 'new'
                ? `/products/return-to-warehouse-sent-with-checking/${p.data.id}?${qs.stringify({
                    previusLimit: values?.limit,
                    previusOffset: values?.offset,
                  })}`
                : p.data.status == 'sent'
                  ? `/products/return-to-warehouse-get-with-checking/${p.data.id}?${qs.stringify({
                      previusLimit: values?.limit,
                      previusOffset: values?.offset,
                    })}`
                  : p.data.status == 'checking'
                    ? `/products/return-to-warehouse-recheck-with-checking/${p.data.id}?${qs.stringify({
                        previusLimit: values?.limit,
                        previusOffset: values?.offset,
                      })}`
                    : '#'
          return (
            <Link to={targetPath} state={{ from }}>
              <Typography
                whiteSpace={'pre-wrap'}
                fontWeight={'600'}
                color={p.data.status !== 'canceled' ? 'orange.500' : 'red.500'}
                fontSize={'16px'}
                lineHeight={'24px'}
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
            </Link>
          )
        }),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'store_name'} customText={p.data?.store?.name} />),
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
      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <StatusCell
            id={`products-status-${p.rowIndex}`}
            color={returns_list_statuses.find((el) => el.id === p.data.status)?.color}
            bgcolor={returns_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
            title={returns_list_statuses.find((el) => el.id === p.data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'import_date') {
      return {
        ...el,
        headerName: 'Завершение',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'import_date'} customText={dayjs(p.data?.['updated_at']).format('DD.MM.YYYY HH:mm:ss')} />),
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

    if (el.field === 'received_count') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={''} type={'return_count'} />),
      }
    }

    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Создание',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency={''} type={'created_at'} customText={dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box width={'100%'} display='flex' justifyContent={'center'} alignItems={'center'}>
            <CheckAccess id={'can-download-return-nakladnoy'}>
              {data.status != 'new' && data.status != 'canceled' && (
                <>
                  <ButtonWithPopup
                    id={'ff'}
                    noArrow
                    // ml={'16px'}
                    sx={{
                      height: '38px',
                      padding: '0px !important',
                      borderRadius: '8px !important',
                      marginRight: '5px',
                      width: '38px',
                      border: '1px solid transparent !important',
                      '& svg:first-of-type': {
                        fill: '#07259c !important',
                      },
                    }}
                    popperStyle={{
                      '& .pop-up-options': {
                        minWidth: '200px !important',
                      },
                    }}
                    noMarginSvg
                    placement='bottom-end'
                    onClick={() => refetch()}
                    buttonLabel={
                      <Box
                        sx={{
                          display: 'flex',
                          cursor: 'pointer',
                          justifyContent: 'center',
                          alignItems: 'center',

                          '&:hover': { bgcolor: 'transparent !important' },
                        }}
                        className='cash_register_icon_wrapper'
                      >
                        <DownloadIcon />
                      </Box>
                    }
                    popperData={[
                      { title: 'От аптеки на склад', soon: false, clickHandler: () => downloadNakladnoy({ return_id: data.id }) },
                      { title: 'От склада в аптеку', soon: false, clickHandler: () => downloadNakladnoy({ return_id: data.id, type: 'return' }) },
                    ]}
                  />
                </>
              )}
            </CheckAccess>
            <CheckAccess id={'can-delete-return-to-warehouse'}>
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
