import { faArrowCircleDown, faArrowCircleUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../../components/AgGridTable/Cells/StatusCell'
import palette from '../../../../../src/assets/theme/mui.config'
import thousandDivider from '../../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../../assets/data/imports-list-statuses'

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
            <Typography>{thousandDivider(p.data?.supply_price, 'сум')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'supply_price_vat') {
      return {
        ...el,
        headerName: t('table_columns.supply_price_vat'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(p.data?.supply_price_vat, 'сум')}</Typography>
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
            <Typography>{thousandDivider(p.data?.retail_price, 'сум')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'retail_price_vat') {
      return {
        ...el,
        headerName: t('table_columns.retail_price_vat'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(p.data?.retail_price_vat, 'сум')}</Typography>
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

    if (el.field === 'count') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.received_count)} {p?.data?.unit_name}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.green[500]} icon={faCheckCircle} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.accepted_count)} {p?.data?.unit_name}
              </Typography>
            </Box>
          </>
        )),
      }
    }
    if (el.field === 'amount') {
      return {
        ...el,
        headerName: 'Cумма',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.received_amount, 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.violet[500]} icon={faArrowCircleUp} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.accepted_amount, 'сум')}
              </Typography>
            </Box>
          </>
        )),
      }
    }

    if (el.field === 'amount_vat') {
      return {
        ...el,
        headerName: 'Сумма СНДС',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.received_amount_vat, 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.violet[500]} icon={faArrowCircleUp} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.accepted_amount_vat, 'сум')}
              </Typography>
            </Box>
          </>
        )),
      }
    }

    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')}</Typography>
          </Box>
        )),
      }
    }
  })

  return columns
}
