import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import { Box, IconButton, Typography } from '@mui/material';
import { formatDate } from '@utils/validateDate';
import DeleteIcon from '@icons/DeleteIcon';
import EditIcon from '@icons/EditIcon';
import { memo } from 'react';
import { get } from 'lodash';

import { SimpleText } from '../../../components/AgGridTable/Cells/SimpleText';


export default function tableHeaderSelector({ clientsColumns, values, selectClientsFunc, t, setOpenConfirmDialog, setOpenClientCreateMini }) {
  const columns = clientsColumns?.map((el) => {
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
        cellRenderer: memo((p) => (
          <input onChange={(e) => selectClientsFunc(e.target.checked, p.data.id)} name='checkbox_zero' className='customCheckbox' type='checkbox' />
        )),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='public_id' />),
      }
    }
    if (el.field === 'fish') {
      return {
        ...el,
        headerName: t('fish'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={get(p, 'data.[first_name]') + ' ' + get(p, 'data.[last_name]')} type='fish' />),
      }
    }
    if (el.field === 'loyalty_card_barcode') {
      return {
        ...el,
        headerName: t('Карта лояльности'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText {...p} customText={get(p, 'data.loyalty_card_barcode', '')?.replace(/.(?=.{4})/g, '*')} type='loyalty_card_barcode' />
        )),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: t('phone_number'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={p.data.phone.length > 0 ? formatPhoneNumber(p.data.phone) : '-'} type='phone_number' />),
      }
    }
    if (el.field === 'tags') {
      return {
        ...el,
        headerName: t('tags'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => <SimpleText {...data} data={data?.tag} type='name' />),
      }
    }

    if (el.field === 'loyalty_card_percent') {
      return {
        ...el,
        headerName: 'Процент лояльности карты',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'%'} type='loyalty_card_percent' />),
      }
    }
    if (el.field === 'discount_card') {
      return {
        ...el,
        headerName: 'Дисконтная карта',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='discount_card' />),
      }
    }
    if (el.field === 'discount_percent') {
      return {
        ...el,
        headerName: 'Процент скидки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'%'} type='discount_percent' />),
      }
    }
    if (el.field === 'birthday') {
      return {
        ...el,
        headerName: 'Дата рождения',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={formatDate(p.data?.birthday, 'DD.MM.YYYY')} type='birthday' />),
      }
    }
    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата регистрации',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={formatDate(p.data?.created_at, 'DD.MM.YYYY')} type='created_at' />),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: 'Зарегистрируйтесь в филиале',
        colId: el.field,
        // cellRenderer: memo((p) => <SimpleText {...p} customText={get(p, 'data.store.name', '-')} type='store' />),

        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {get(p, 'data.store.name', '-')}
          </Typography>
        )),
      }
    }
    if (el.field === 'balance') {
      return {
        ...el,
        headerName: 'Баланс',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='balance' />),
      }
    }

    if (el.field === 'spending_from_balance') {
      return {
        ...el,
        headerName: 'Расходы с баланса',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='spending_from_balance' />),
      }
    }

    if (el.field === 'action') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box key={data.loyalty_card_barcode} display='inline-flex' columnGap={'8px'}>
            <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setOpenClientCreateMini({ type: 'edit', data })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
              <EditIcon />
            </IconButton>
          </Box>
        )),
      }
    }
  })

  return columns
}
