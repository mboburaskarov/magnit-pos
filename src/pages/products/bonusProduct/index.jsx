import { LoadingButton } from '@mui/lab'
import { Box, Button, Container } from '@mui/material'
import dayjs from 'dayjs'
import * as qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'

import ImageGallery from '../../../../components/ImageGallery'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/bonusProductTableColumns'
import CreateBonusProduct from './createBonusProduct'
import EditBonusProduct from './editBonusProduct'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function BonusProductPage() {
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.bonusProductTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [openCreateBonusModal, setopenCreateBonusModal] = useState(false)
  const [openEditBonusModal, setopenEditBonusModal] = useState(false)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    setopenEditBonusModal: setopenEditBonusModal,
    setOpenConfirmDialog: setOpenConfirmDialog,
  })
  const { mutate: deleteBonusProduct } = useMutation(requests.deleteBonusProduct, {
    onSuccess: () => {
      refetch().then(() => {
        const requestParams = qs.stringify({ ...values, offset: 0 }, { addQueryPrefix: true })
        navigate(`/products/bonus-product${requestParams}`)
      })
      success('Продукт успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении товара!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
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

  const bonusProductListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date,
      status: values?.status,
      import_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
    values?.offset,
    values?.limit,
    values?.end_date,
    values?.start_date,
    values?.search,
    values?.status,
    values?.store_id,
    values?.received_amount_to,
    values?.received_amount_from,
  ])
  const {
    data: bonusProductList,
    isLoading: bonusProductListLoading,
    isFetching: isFetchingbonusProductList,
    refetch,
  } = useQuery(['bonusProductList', bonusProductListFilter], () => requests.getProductBonusList(bonusProductListFilter))

  useEffect(() => {
    refetch()
  }, [bonusProductListFilter])

  useEffect(() => {
    const count = bonusProductList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [bonusProductList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pb={'20px'}>
        <Header
          isLoading={false}
          buttonText='Бонусный продукт'
          backIcon
          noActions
          backButtonClick={() => navigate('/products/all')}
          text={'Бонусный продукт'}
          checkAccessId={'product-create'}
        />
        <Container>
          <FormProvider {...methods}>
            <Box display='flex' flexDirection='column' position='relative' px={'20px'} pb={'20px'}>
              <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
                <Box display={'flex'}>
                  <Box
                    width='100%'
                    sx={{
                      mr: 4,
                      '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                      '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                        background: 'transparent',
                        width: '400px',
                        height: 48,
                      },
                    }}
                  >
                    <InputSearch id='producrs-search' name='search' placeholder={t('table_columns.name')} uncontrolled />
                  </Box>
                  <DateRangeInput
                    defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }}
                    id='accounting-report-date-range'
                  />
                </Box>

                <Box display={'flex'} alignItems={'center'}>
                  <Box>
                    <ColumnsFilterButtonForAll
                      title={t('ag_grid.table_setting.label')}
                      columns={tableColumns}
                      isCatalog={false}
                      resetTableHeader={resetTableHeader}
                      changeColumnSequence={changeColumnSequence}
                    />
                  </Box>
                  <CheckAccess id={'create-auto-order'}>
                    <Box minWidth={156}>
                      <Button sx={{ height: '48px' }} type='submit' onClick={() => setopenCreateBonusModal(true)} fullWidth variant='contained' color='primary'>
                        Создать
                      </Button>
                    </Box>
                  </CheckAccess>
                </Box>
              </Box>
              <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
              <CreateBonusProduct refetch={refetch} open={openCreateBonusModal} setOpen={setopenCreateBonusModal} />
              <EditBonusProduct refetch={refetch} open={openEditBonusModal} setOpen={setopenEditBonusModal} />
              <Box>
                <AgGridTable
                  id='auto-order-main-table'
                  tableSettings
                  columns={tableColumns}
                  data={bonusProductList?.data?.data?.data || []}
                  totalCount={bonusProductList?.data?.data?._meta?.total_count || 0}
                  isDataLoading={isFetchingbonusProductList || bonusProductListLoading}
                  offsetCount={offsetCount}
                  updaterAction={(newData) => {
                    if (newData) dispatch(updateTableHeader(newData))
                  }}
                  emptyTableText={{
                    title: 'Заказ недоступен',
                    description: 'Если вы не можете найти искомый Заказ, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                  }}
                  fullInfoAboutCurrentPage
                  resetTable={() => dispatch(resetTableHeader({ refetch }))}
                  isRefreshing={loading || isFetchingbonusProductList || bonusProductListLoading}
                />
              </Box>
            </Box>

            <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
          </FormProvider>
          {openConfirmDialog && (
            <ConfirmDialog
              open={!!openConfirmDialog}
              setOpen={setOpenConfirmDialog}
              icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
              title={'Удалить бонусный продукт?'}
              desc={'Вы хотите Удалить бонусный продукт?'}
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
                  <LoadingButton variant='contained' type='button' onClick={() => deleteBonusProduct({ data: [openConfirmDialog.id] })}>
                    Да, удалить
                  </LoadingButton>
                </>
              }
            />
          )}
        </Container>
      </Box>
    </LoadingContainer>
  )
}
