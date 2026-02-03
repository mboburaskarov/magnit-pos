import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import { imports_list_statuses } from '@/assets/data/imports-list-statuses'
import { useQueryParams } from '@hooks/useQueryParams'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ revaluationColumns, t }) {
  const { values } = useQueryParams()
  const location = useLocation()
  const from = location.pathname + location.search

  const columns = revaluationColumns?.map((el) => {
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
    if (el.field === 'checkbox') {
      return {
        ...el,
        headerName: '',
        colId: el.field,
        cellRenderer: memo((p) => <input onChange={(e) => {}} name='checkbox_zero' className='customCheckbox' type='checkbox' />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Номер автозаказа',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Link
            to={
              p.data.status == 'completed'
                ? `/products/revaluation/view/${p.data.id}?${qs.stringify({
                    previusLimit: values?.limit,
                    previusOffset: values?.offset,
                  })}`
                : `/products/revaluation/create/${p.data.id}?${qs.stringify({
                    previusLimit: values?.limit,
                    previusOffset: values?.offset,
                  })}`
            }
            state={{ from }}
          >
            <Typography fontWeight={'600'} color={'orange.500'} fontSize={'16px'} lineHeight={'24px'}>
              {p.data.name}
            </Typography>
          </Link>
        )),
      }
    }

    if (el.field === 'created_by') {
      return {
        ...el,
        headerName: 'Создал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'created_by'} />),
      }
    }
    if (el.field === 'updated_by') {
      return {
        ...el,
        headerName: 'Завершил',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'updated_by'} />),
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

    if (el.field === 'updated_at') {
      return {
        ...el,
        headerName: 'Дата переоценки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'updated_at'} customText={dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }

    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type={'count'} />),
      }
    }
  })

  return columns
}
