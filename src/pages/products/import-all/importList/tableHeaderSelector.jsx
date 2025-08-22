import { faArrowCircleDown, faArrowCircleUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusCell from '../../../../../components/AgGridTable/Cells/StatusCell'
import palette from '../../../../../src/assets/theme/mui.config'
import thousandDivider from '../../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../../assets/data/imports-list-statuses'
import { useQueryParams } from '../../../../hooks/useQueryParams'
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

export default function tableHeaderSelector({ importsColumns, t }) {
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
        headerName: 'Импортный номер',
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
          <Typography
            onClick={() => {
              console.log(values)

              navigate(
                `/products/imports/${p.data.id}?${qs.stringify({
                  previusLimit: values?.limit,
                  previusOffset: values?.offset,
                })}
        `,
                {
                  state: {
                    prevFilter: values, // save current filter state here
                  },
                }
              )
            }}
            whiteSpace={'pre-wrap'}
            fontWeight={'600'}
            color={'orange.500'}
            fontSize={'16px'}
            lineHeight={'24px'}
          >
            {p.data.document_number}
          </Typography>
        )),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace={'pre-wrap'}>{p.data?.store?.name}</Typography>),
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
        headerName: 'Дата закрытия',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['updated_at']).format('DD.MM.YYYY HH:mm:ss')}</Typography>
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
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_amount'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.violet[500]} icon={faArrowCircleUp} />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'accepted_amount'} />
            </Box>
          </>
        )),
      }
    }
    if (el.field === 'accepted_amount_vat') {
      return {
        ...el,
        headerName: 'Cумма СНДС',
        colId: el.field,
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'received_amount_vat'} />
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.violet[500]} icon={faArrowCircleUp} />

              <Box width={'10px'} />

              <SimpleText {...p} withDevider currency={'сум'} type={'accepted_amount_vat'} />
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
        cellRenderer: memo((p) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />

              <Box width={'10px'} />
              <Typography>
                {p?.data?.received_count} {p?.data?.unit_name}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.green[500]} icon={faCheckCircle} />

              <Box width={'10px'} />
              <Typography>
                {p?.data?.accepted_count} {p?.data?.unit_name}
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
