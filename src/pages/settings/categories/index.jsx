import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import { useState } from 'react'
import TabContainer from '../../../../components/Tab/TabContainer'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import LoadingBlurry from '../../../../components/LoadingBlurry'
import CategoriesBox from './CategoriesBox'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { OverlayNoRowsTemplate } from '../../../../components/AgGridTable/AgGridComponents'
import CategoryCreateDrawer from './CategoryCreateDrawer'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { error, success } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import CategoryEditDrawer from './CategoryEditDrawer'
import CheckAccess from '../../../../components/CheckAccess'

export default function CategoriesPage() {
  const [status, setStatus] = useState('ALL')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)

  const {
    data: categoriesList,
    isLoading: categoriesLoading,
    isFetching: isFetchingCategoriesList,
    refetch,
  } = useQuery(['categoriesList', status], () => requests.getAllCategories({ ...(status !== 'ALL' && { type: status }) }))

  const { mutate: deleteCategory, isLoading: isDeletingCategory } = useMutation(requests.deleteCategory, {
    onSuccess: () => {
      refetch()
      success('Категория успешно удалена!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении категории!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box>
          <Typography variant='h1'>Категории ( {categoriesList?.data.length || 0} )</Typography>
        </Box>
        <Box display='flex' mb={3} mt={3}>
          <TabContainer
            customTooltip
            tabs={[
              { id: 'ALL', label: 'Все' },
              { id: 'BUCHET', label: 'Buchet' },
              { id: 'MARKET', label: 'Market' },
            ]}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='producrs-search' name='search' placeholder='Поиск по категориям' uncontrolled />
          </Box>
          <CheckAccess id={'category-create'}>
            <Box minWidth={156}>
              <Button
                onClick={() => setIsDrawerOpen({ type: 'create' })}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box mb={4} mt={4}>
          <LoadingBlurry isLoading={categoriesLoading || isFetchingCategoriesList} height={-50} outside />
          {categoriesList?.data?.map((category, ind) => (
            <CategoriesBox setIsDrawerOpen={setIsDrawerOpen} setOpenConfirmDialog={setOpenConfirmDialog} key={ind} data={category} ind={ind} />
          ))}
          {!categoriesList?.data?.length && <OverlayNoRowsTemplate />}
        </Box>
      </Box>
      <CategoryEditDrawer refetch={refetch} isOpen={isDrawerOpen?.type === 'edit'} id={isDrawerOpen?.id} onClose={() => setIsDrawerOpen(null)} />
      <CategoryCreateDrawer refetch={refetch} isOpen={isDrawerOpen?.type === 'create'} onClose={() => setIsDrawerOpen(null)} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить категорию'}
          desc={'Вы действительно хотите удалить категорию?'}
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingCategory} onClick={() => deleteCategory(openConfirmDialog.id)}>
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
