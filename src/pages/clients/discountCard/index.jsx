import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Typography } from '@mui/material'
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

import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/discountCardTableColumns'
import CreateDiscountCard from './createDiscountCard'
import EditDiscountCard from './editDiscountCard'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function DiscountCardPage() {
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.discountCardTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [openCreateBonusModal, setopenCreateBonusModal] = useState(false)
  const [openEditBonusModal, setopenEditBonusModal] = useState(false)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    setopenEditBonusModal: setopenEditBonusModal,
    setOpenConfirmDialog: setOpenConfirmDialog,
  })
  const { mutate: deleteDiscountCard } = useMutation(requests.deleteDiscountCard, {
    onSuccess: () => {
      refetch().then(() => {
        const requestParams = qs.stringify({ ...values, offset: 0 }, { addQueryPrefix: true })
        navigate(`/clients/discount-card${requestParams}`)
      })
      success('дисконтная карта успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении дисконтная карта!')
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

  const discountCardFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
    }
  }, [values?.offset, values?.limit, values?.search])
  const {
    data: discountCard,
    isLoading: discountCardLoading,
    isFetching: isFetchingdiscountCard,
    refetch,
  } = useQuery(['discountCard', discountCardFilter], () => requests.getAllDisountCardsList(discountCardFilter))

  useEffect(() => {
    refetch()
  }, [discountCardFilter])

  useEffect(() => {
    const count = discountCard?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [discountCard?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('Дисконтная карта')}
        </Typography>

        <Container>
          <FormProvider {...methods}>
            <Box display='flex' flexDirection='column' position='relative' pb={'20px'}>
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
              <CreateDiscountCard refetch={refetch} open={openCreateBonusModal} setOpen={setopenCreateBonusModal} />
              <EditDiscountCard refetch={refetch} open={openEditBonusModal} setOpen={setopenEditBonusModal} />
              <Box>
                <AgGridTable
                  id='auto-order-main-table'
                  tableSettings
                  columns={tableColumns}
                  data={discountCard?.data?.data?.data || []}
                  totalCount={discountCard?.data?.data?._meta?.total_count || 0}
                  isDataLoading={isFetchingdiscountCard || discountCardLoading}
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
                  isRefreshing={loading || isFetchingdiscountCard || discountCardLoading}
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
                  <LoadingButton variant='contained' type='button' onClick={() => deleteDiscountCard(openConfirmDialog.id)}>
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
