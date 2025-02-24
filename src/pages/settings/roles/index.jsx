import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import PlusIcon from '../../../assets/icons/PlusIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/rolesTableColumns'
import RolesCreateDrawer from './RolesCreateDrawer'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function RolesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.rolesTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openCreatePermission, setOpenCreatePermission] = useState(false)

  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [slectedVendors, setSelectedVendors] = useState([])
  const selectVendors = (isChecked, id) => {
    if (isChecked) {
      setSelectedVendors((p) => [...p, id])
    } else {
      setSelectedVendors((p) => p.filter((ids) => ids !== id))
    }
  }
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    selectVendors,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID && el.field !== 'category')
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])
  const rolesListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
    }
  }, [values?.offset, values?.limit, values?.search])
  const {
    data: rolesList,
    isLoading: rolesListLoading,
    isFetching: isFetchingrolesList,
    refetch,
  } = useQuery(['rolesList', rolesListFilter], () => requests.getAllRoles(rolesListFilter))
  const { mutate: deleteRole, isLoading: isDeletingProduct } = useMutation(requests.deleteRole, {
    onSuccess: () => {
      refetch()
      success('Роли успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении роли!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    const count = rolesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [rolesList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <RolesCreateDrawer isOpen={openCreatePermission} onClose={() => setOpenCreatePermission(null)} />
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Box display={'flex'}>
          <Typography variant='h1' onClick={() => setOpenCreatePermission(true)} fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {t('page.role.title')}
          </Typography>
          <Typography
            ml={'5px'}
            variant='h1'
            onClick={() => navigate('/settings/actions')}
            fontWeight={700}
            fontSize={'28px'}
            lineHeight={'40px'}
            color={'balck'}
          >
            и действия
          </Typography>
        </Box>
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'Поиск по таблице'} uncontrolled />
            </Box>

            {slectedVendors.length > 0 && (
              <>
                <Box minWidth={48} ml={'16px'}>
                  <Button
                    sx={{
                      height: '48px',
                      padding: 0,
                      bgcolor: '#fff',
                      border: '1px solid #ECEDF2',
                      color: 'dark.500',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '24px',
                      '& span': {
                        mr: '12px',
                      },
                    }}
                    fullWidth
                    variant='contained'
                    color='secondary'
                  >
                    <LockIcon color='#111217' />
                  </Button>
                </Box>
                <Box minWidth={48} ml={'16px'}>
                  <Button
                    sx={{
                      height: '48px',
                      padding: 0,
                      bgcolor: '#fff',
                      border: '1px solid #ECEDF2',
                      color: 'dark.500',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '24px',
                      '& span': {
                        mr: '12px',
                      },
                    }}
                    fullWidth
                    variant='contained'
                    color='secondary'
                    onClick={() => deleteRole({ data: slectedVendors })}
                  >
                    <DeleteIcon width='24px' />
                  </Button>
                </Box>
              </>
            )}
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            <CheckAccess id={'product-create'}>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  onClick={() => navigate('/roles/create')}
                  fullWidth
                  startIcon={<PlusIcon color='#fff' />}
                  variant='contained'
                  color='primary'
                >
                  {t('button.add_new.text')}
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='roles-main-table'
            tableSettings
            columns={tableColumns}
            data={rolesList?.data?.data?.data || []}
            totalCount={rolesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingrolesList || rolesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            emptyTableText={{
              title: 'Роли недоступен',
              description: 'Если вы не можете найти искомый Роли, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingrolesList || rolesListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить роль?'}
          desc={'хотите ли вы удалить роль?'}
          supDesc={openConfirmDialog.name}
          actions={
            <>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => setOpenConfirmDialog(null)}
              >
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteRole({ data: [openConfirmDialog.id] })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
