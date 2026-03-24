import { faArrowCircleDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import { autoorder_list_statuses } from '@/assets/data/imports-list-statuses'
import DeleteIcon from '@icons/DeleteIcon'
import palette from '@/assets/theme/mui.config'
import { useQueryParams } from '@hooks/useQueryParams'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ autoOrderColumns, t, setOpenConfirmDialog }) {
  const { values } = useQueryParams()
  const navigate = useNavigate()

  const columns = autoOrderColumns?.map((el) => {
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
        headerName: 'Номер автозаказа',
        colId: el.field,
        cellRenderer: memo((p) => {
          const targetPath =
            p?.data?.status == 'new'
              ? `/products/auto-order/${p.data.id}?${qs.stringify({
                  previusLimit: values?.limit,
                  previusOffset: values?.offset,
                })}
                `
              : `/products/auto-order/view/${p.data.id}?${qs.stringify({
                  previusLimit: values?.limit,
                  previusOffset: values?.offset,
                })}
                `
          return (
            <Typography
              onClick={() => {
                if (targetPath) {
                  navigate(targetPath, {
                    state: {
                      prevFilter: values, // save current filter state here
                    },
                  })
                }
              }}
              fontWeight={'600'}
              color={'orange.500'}
              fontSize={'16px'}
              lineHeight={'24px'}
            >
              {p.data.public_id}
            </Typography>
          )
        }),
      }
    }

    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace='pre-wrap'>{p.data?.store?.name}</Typography>),
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
            color={autoorder_list_statuses.find((el) => el.id === p.data.status)?.color}
            bgcolor={autoorder_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
            title={autoorder_list_statuses.find((el) => el.id === p.data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'import_date') {
      return {
        ...el,
        headerName: 'Дата заказ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='import_date' customText={dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }

    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider type={'adjusted_order_quantity'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.green[500]} icon={faCheckCircle} />

              <Box width={'10px'} />
              <SimpleText {...p} withDevider type={'response_order_quantity'} />
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
          <Box display='inline-flex' columnGap={'8px'}>
            <IconButton
              onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
              sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )),
      }
    }
  })

  return columns
}
