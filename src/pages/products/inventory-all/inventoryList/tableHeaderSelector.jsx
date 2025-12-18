import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import CheckAccess from '@components/CheckAccess'
import StyledTooltip from '@components/StyledTooltip'
import { imports_list_statuses } from '@/assets/data/imports-list-statuses'
import ArrowRight from '@icons/ArrowRight'
import DeleteIcon from '@icons/DeleteIcon'
import LeftArrowIcon from '@icons/LeftArrow'
import { useQueryParams } from '@hooks/useQueryParams'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ importsColumns, t, setOpenConfirmDialog }) {
  const { values } = useQueryParams()

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
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='public_id' />),
      }
    }
    if (el.field === 'document_number') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Link
            to={
              p.data.status == 'new'
                ? `/products/inventory-with-checking/new/${p.data.id}?${qs.stringify({
                    previusLimit: values?.limit,
                    previusOffset: values?.offset,
                  })}`
                : `/products/inventory-completed/${p.data.id}?${qs.stringify({
                    previusLimit: values?.limit,
                    previusOffset: values?.offset,
                  })}`
            }
          >
            <Typography whiteSpace={'pre-wrap'} fontWeight={'600'} color={'orange.500'} fontSize={'16px'} lineHeight={'24px'}>
              {p.data.name}
            </Typography>
          </Link>
        )),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' customText={p.data?.store?.name} />),
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
            color={imports_list_statuses.find((el) => el.id === p.data.status)?.color}
            bgcolor={imports_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
            title={imports_list_statuses.find((el) => el.id === p.data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'import_date') {
      return {
        ...el,
        headerName: 'Завершил',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='import_date' customText={dayjs(p.data?.['updated_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }
    if (el.field === 'accepted_amount') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Програм'}>
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
                  <ArrowRight fill='transparent' color='#fff' />
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'current_count'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Факт'}>
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
                  <Typography textAlign={'center'} width={'20px'} height={'20px'} color={'#fff'}>
                    +
                  </Typography>
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'fact_count'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Разница'}>
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

              <SimpleText {...p} withDevider currency={''} type={'difference_count'} />
            </Box>
          </>
        )),
      }
    }

    if (el.field === 'received_count') {
      return {
        ...el,
        headerName: 'Cумма',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Програм'}>
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
                  <ArrowRight fill='transparent' color='#fff' />
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'current_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Факт'}>
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
                  <Typography textAlign={'center'} width={'20px'} height={'20px'} color={'#fff'}>
                    +
                  </Typography>
                </Box>
              </StyledTooltip>

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={''} type={'fact_sum'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <StyledTooltip title={'Разница'}>
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

              <SimpleText {...p} withDevider currency={'сум'} type={'difference_sum'} />
            </Box>
          </>
        )),
      }
    }

    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Создал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='created_at' customText={dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box width={'100%'} display='flex' justifyContent={'center'} alignItems={'center'}>
            <CheckAccess id={'delete-inventory'}>
              <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 40, height: 40, borderRadius: 3, p: '8px' }}>
                <DeleteIcon width='18px' />
              </IconButton>
            </CheckAccess>
          </Box>
        )),
      }
    }
  })

  return columns
}
