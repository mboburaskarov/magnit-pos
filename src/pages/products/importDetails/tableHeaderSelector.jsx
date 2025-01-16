import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'

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

export default function tableHeaderSelector({ importsColumns, values, t }) {
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

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Штрих-код',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.product?.barcode}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.product?.name}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: t('table_columns.supply_price'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.product?.supply_price}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: t('table_columns.retail_price'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.product?.retail_price}</Typography>
          </Box>
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
            color={imports_list_statuses.find((el) => el.id === p.data.import.status)?.color}
            bgcolor={imports_list_statuses.find((el) => el.id === p.data.import.status)?.bgcolor}
            title={imports_list_statuses.find((el) => el.id === p.data.import.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'received_count') {
      return {
        ...el,
        headerName: 'Количество принятых',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='received_count' />),
      }
    }

    if (el.field === 'scanned') {
      return {
        ...el,
        headerName: 'Сканированиe',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='scanned' />),
      }
    }

    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH.mm.ss')}</Typography>
          </Box>
        )),
      }
    }
  })

  return columns
}
