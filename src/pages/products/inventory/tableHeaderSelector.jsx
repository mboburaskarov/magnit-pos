import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import CheckAccess from '../../../../components/CheckAccess'
import CustomImg from '../../../../components/CustomImg'
import StyledTooltip from '../../../../components/StyledTooltip'
import thousandDivider from '../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'
import ArrowRight from '../../../assets/icons/ArrowRight'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import DownloadIcon from '../../../assets/icons/DownloadIcon'
import LeftArrowIcon from '../../../assets/icons/LeftArrow'
import { useQueryParams } from '../../../hooks/useQueryParams'
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

const Image = ({ data, rowIndex, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: 2,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {data?.main_photo?.[0] ? (
        <CustomImg
          id={`product-image-${rowIndex}`}
          src={data?.main_photo || 'default-img.avif'}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <DefaultImgIcon />
      )}
      {data?.files?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: 2,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'green.600',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => setImages({ data: data?.files })}
        />
      )}
    </Box>
  )
}

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
              p.data.status !== 'completed'
                ? `/products/inventory-with-checking/${p.data.id}?${qs.stringify({
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
        headerName: 'Завершил',
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
        // <SimpleText currency='сум' withDevider {...p} type='accepted_amount' />),
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
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH:mm:ss')}</Typography>
          </Box>
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
            <CheckAccess id={'delete-inventory'}>
              <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 40, height: 40, borderRadius: 3, p: '8px' }}>
                <DeleteIcon width='18px' />
              </IconButton>
            </CheckAccess>
            <ButtonWithPopup
              id={'ff'}
              noArrow
              // ml={'16px'}
              sx={{
                height: '38px',
                padding: '0px !important',
                borderRadius: '8px !important',
                marginLeft: '5px',
                width: '38px',
                border: '1px solid transparent !important',
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
                { title: 'Излишек', soon: false, clickHandler: () => setIsOpenChangeShift(true) },
                { title: 'Излишек', soon: false, clickHandler: () => setIsOpenChangeShift(true) },
              ]}
            />
          </Box>
        )),
      }
    }
  })

  return columns
}
