import { memo } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import { get } from 'lodash'
import TextField from '../../../../components/Inputs/TextField'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`import-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ importsColumns, setImports, t, setScanedNumber, id }) {
  const columns = importsColumns?.map((el) => {
    if (el.field === 'checkbox') {
      return {
        ...el,
        headerName: '',
        colId: el.field,
        cellRenderer: memo((p) => (
          <input onChange={(e) => setImports(e.target.checked, p.data?.id)} name='checkbox_zero' className='customCheckbox' type='checkbox' />
        )),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} data={p.data?.product} type='name' />),
      }
    }

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Штрих-код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} data={p.data?.product} type='barcode' />),
      }
    }
    if (el.field === 'declared') {
      return {
        ...el,
        headerName: 'Объявлено',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='received_count' />),
      }
    }
    if (el.field === 'scanned') {
      return {
        ...el,
        headerName: 'Сканирование',
        colId: el.field,
        cellRenderer: memo((p) => {
          return (
            <NumberFormatInput
              onBlur={({ target }) => {
                if (p?.data?.accepted_count == get(target, 'value')) return

                setScanedNumber({ id: get(p, 'data.id'), scanned_count: Number(get(target, 'value').replace(/\s+/g, '')) })
              }}
              placeholder={'0'}
              defaultValue={p?.data?.scanned_count}
              id={`scanned_quantity_${p?.data?.id}`}
              name={`scanned_quantity_${p?.data?.id}`}
              type='number'
              fullWidth
            />
          )
        }),
      }
    }
    if (el.field === 'series_number') {
      return {
        ...el,
        headerName: 'Cерия Номер',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='series_number' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: 'Срок годности',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{dayjs(new Date(p?.data?.expire_date)).format('DD.MM.YYYY')}</Typography>),
      }
    }
    if (el.field === 'producer_name') {
      return {
        ...el,
        headerName: t('create_new_product.features.manufacturer'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='producer_name' />),
      }
    }
  })

  return columns
}
