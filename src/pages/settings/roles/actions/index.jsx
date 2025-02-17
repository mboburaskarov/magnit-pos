import { Box, Button } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import PaginationTable from '../../../../../components/AgGridTable/PaginationTable'
import ConfirmDialog from '../../../../../components/ConfirmDialog'
import CreateEditCategories from '../../../../../components/CreateEditCategories'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import BigWarningCircleIcon from '../../../../assets/icons/BigWarningCircleIcon'
import PlusIcon from '../../../../assets/icons/PlusIcon'
import useDebouncedValue from '../../../../hooks/useDebouncedValue'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import tableHeadersActions from './tableHeadersActions'
import RolesCreateDrawer from '../RolesCreateDrawer'

export default function ActionListPage() {
  const queryParams = useQueryParams()
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const dispatch = useDispatch()
  const [type, setType] = useState('categories')
  const [status, setStatus] = useState('')
  const [categoryDrawer, setCategoryDrawer] = useState(false)
  const [createEdit, setCreateEdit] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(null)
  const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebouncedValue('', 300)
  const [confirmToDelete, setConfirmToDelete] = useState(false)
  const [offsetCount, setOffsetCount] = useState(0)
  const [openCreatePermission, setOpenCreatePermission] = useState(false)
  const categoryFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      search: values?.search,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, values?.limit, values?.search])
  const {
    data: categories,
    refetch: categoriesRefetch,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useQuery(['categories', categoryFilter], () => requests.getAllRolesWithPermissions(categoryFilter))

  const { mutate: deleteCategory, isLoading: isdeleteCategory } = useMutation(requests.deleteCategory, {
    onSuccess: () => {
      categoriesRefetch()
      success('Категори успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании Категори!')
      console.log('err', err)
    },
  })

  useEffect(() => {
    const count = categories?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    // refetchAll()
  }, [categories?.data, queryParams?.values?.search, queryParams?.values?.limit, queryParams?.values?.page])

  const columnsCategories = tableHeadersActions(searchTerm, setCategoryDrawer, setCreateEdit, status, type, setOpenConfirm, t, setConfirmToDelete)

  const columns = columnsCategories

  function renameSubRows(obj) {
    if (obj.children || obj.children === 'null') {
      obj.subRows = obj.children
      delete obj.children

      obj.subRows.forEach(renameSubRows) // Recurse through sub_category if exists
    }
    return obj
  }

  const tableData = categories?.data?.data?.map((e) => renameSubRows(e))

  const tableLoading = categoriesLoading || categoriesFetching

  return (
    <>
      <Box pt={6} px={4} pb={3}>
        <Box display='flex' width='100%' mb={3} mt={4}>
          <Box flex='1 0 30%' mr={1}>
            <InputSearch
              name='search'
              placeholder={
                type === 'attributes'
                  ? t('placeholders.attribute_name')
                  : type === 'characteristics'
                  ? t('placeholders.characteristics_name')
                  : t('menu.finance.categories.searchplaceholder')
              }
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Box>
          <Box flex='0 0 10%' minWidth={256}>
            <Button id='create' adornmentStart={<PlusIcon fill='#fff' />} primary onClick={() => setOpenCreatePermission(true)} style={{ minWidth: 256 }}>
              {t('menu.finance.categories.new')}
            </Button>
          </Box>
        </Box>
        <PaginationTable
          isExpendable
          customTablePadding='8px 14px'
          defaultPageSize={10}
          columns={columns}
          isDataLoading={tableLoading}
          data={tableData}
          pageCount={offsetCount}
          navigateUrl='/settings/actions'
          noDataTitle={t('titles.data_not_found')}
          withHover
        />
      </Box>
      <CreateEditCategories
        withoutNavigate
        refetch={categoriesRefetch}
        open={!!createEdit}
        editId={createEdit?.parentId}
        focusId={createEdit?.id}
        closeDrawer={() => setCreateEdit(false)}
      />

      <RolesCreateDrawer isOpen={openCreatePermission} onClose={() => setOpenCreatePermission(null)} />

      <ConfirmDialog
        open={!!confirmToDelete}
        setOpen={setConfirmToDelete}
        icon={<BigWarningCircleIcon />}
        title={t('menu.finance.categories.delete_subcattegory.title')}
        desc={t('menu.finance.categories.delete_subcattegory.desc')}
        actions={
          <>
            <Button variant='contained' id='stop' onClick={() => setConfirmToDelete(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button
              onClick={() => {
                setConfirmToDelete(false)
                deleteCategory({ data: [confirmToDelete] })
              }}
              size='medium'
              variant='contained'
            >
              {t('buttons.delete')}
            </Button>
          </>
        }
      />
    </>
  )
}
