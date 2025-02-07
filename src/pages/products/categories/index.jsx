import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
// import InputSearch from 'components/Input/InputSearch'
// import PaginationTable from 'components/Table/PaginationTable'
// import useDebouncedValue from 'hooks/useDebouncedValue'
// import { useQueryParams } from 'hooks/useQueryParams'
import useWebsocketMutation from '../../../hooks/useDebouncedValue'
import qs from 'qs'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import { requests } from 'services/requests'
import asyncRemoveCustomColumns from './index'
import removeCustomColumn from './index'
import { error, success } from '../../../../utils/toast'
import tableHeadersCategories from './tableHeadersCategories'
import { useQueryParams } from '../../../hooks/useQueryParams'
import useDebouncedValue from '../../../hooks/useDebouncedValue'
import InputSearch from '../../../../components/Inputs/InputSearch'
import PaginationTable from '../../../../components/AgGridTable/PaginationTable'
import { requests } from '../../../../utils/requests'

const useStyles = makeStyles((theme) => ({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: 48,
    height: 48,
    background: theme.palette.gray[100],
    borderRadius: 32,
    transition: 'background 0.2s',
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.gray[101],
    },
  },
  title: {
    fontSize: 36,
    lineHeight: '56px',
    color: theme.palette.black,
    marginLeft: 16,
  },
}))

export default function CatalogManagement() {
  const classes = useStyles()
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [type, setType] = useState('categories')
  const [status, setStatus] = useState('')
  const [pageCount, setPageCount] = useState(1)
  const [categoryDrawer, setCategoryDrawer] = useState(false)
  const [createEdit, setCreateEdit] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(null)
  const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebouncedValue('', 300)

  const closeDrawer = useCallback(() => {
    setCreateEdit(null)
  }, [])

  const {
    data: categories,
    refetch: categoriesRefetch,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useQuery(['categories', debouncedSearchTerm], () =>
    requests.getAllCategories({
      limit: queryParams?.values?.limit || 10,
      offset: queryParams?.values?.page || 1,
      search: debouncedSearchTerm,
    })
  )

  const {
    data: attributes,
    refetch: attributesRefetch,
    isLoading: attributesLoading,
    isFetching: attributesFetching,
  } = useQuery(
    ['attributes', debouncedSearchTerm],
    () =>
      requests.attribute.getAll({
        limit: queryParams?.values?.limit || 10,
        page: queryParams?.values?.page || 1,
        search: debouncedSearchTerm,
      }),
    {
      enabled: type === 'attributes',
    }
  )
  const {
    data: characteristics,
    refetch: characteristicsRefetch,
    isLoading: characteristicsLoading,
    isFetching: characteristicsFetching,
  } = useQuery(
    ['characteristics', debouncedSearchTerm],
    () =>
      requests.productCharacteristic.getAll({
        limit: queryParams?.values?.limit || 10,
        page: queryParams?.values?.page || 1,
        search: debouncedSearchTerm,
        is_deleted: status === 'deleted',
      }),
    {
      enabled: type === 'characteristics',
    }
  )

  const { mutate: deleteCategory, isLoading: isDeletingCat } = useWebsocketMutation(requests.category?.delete, {
    onWebsocketSuccess: () => {
      success('menu.finance.categories.toasts.delete_success')
      categoriesRefetch()
      setOpenConfirm(false)
    },
    onWebsocketError: () => {
      setOpenConfirm(false)
      error('menu.finance.categories.toasts.delete_error')
    },
  })
  const { mutate: recoverCategory, isLoading: isRecoveringCat } = useWebsocketMutation(requests.category?.recover, {
    onWebsocketSuccess: () => {
      success('menu.finance.categories.toasts.recover_success')

      categoriesRefetch()
      setOpenConfirm(false)
    },
    onWebsocketError: () => {
      setOpenConfirm(false)
      error('menu.finance.categories.toasts.restore_error')
    },
  })
  const { mutate: deleteCharacteristics, isLoading: isDeletingChar } = useWebsocketMutation(requests.productCharacteristic?.delete, {
    onWebsocketSuccess: () => {
      success('menu.products.catalog.management.del_char_success_toast')
      dispatch(removeCustomColumn(openConfirm?.id))
      dispatch(asyncRemoveCustomColumns(openConfirm?.id))
      characteristicsRefetch()
      setOpenConfirm(false)
    },
    onWebsocketError: () => {
      setOpenConfirm(false)
      error('menu.products.catalog.management.del_char_error_toast')
    },
  })
  const { mutate: recoverCharacteristics, isLoading: isRecoveringChar } = useWebsocketMutation(requests.productCharacteristic?.recover, {
    onWebsocketSuccess: () => {
      success('menu.products.catalog.management.recover_char_success_toast')
      characteristicsRefetch()
      setOpenConfirm(false)
    },
    onWebsocketError: () => {
      setOpenConfirm(false)
      error('menu.products.catalog.management.recover_char_error_toast')
    },
  })

  const refetchAll = () => {
    if (type === 'categories') {
      categoriesRefetch()
    }
    if (type === 'attributes') {
      attributesRefetch()
    }
    if (type === 'characteristics') {
      characteristicsRefetch()
    }
  }

  useEffect(() => {
    const totalCount =
      type === 'attributes'
        ? attributes?.data?.count
        : type === 'characteristics'
        ? status === 'deleted'
          ? characteristics?.data?.deleted_count
          : characteristics?.data?.active_count
        : categories?.data?.count
    const pages = Math.ceil(totalCount / queryParams?.values?.limit)

    setPageCount(pages || 1)

    refetchAll()
  }, [
    categories?.data,
    queryParams?.values?.search,
    queryParams?.values?.limit,
    queryParams?.values?.page,
    characteristics?.data,
    attributes?.data,
    status,
    type,
  ])

  useEffect(() => {
    const searchParams = qs.stringify(
      {
        ...queryParams?.values,
        page: 1,
      },
      { addQueryPrefix: true }
    )
    // navigate(`/products/catalog/management${searchParams}`)
  }, [status])

  useEffect(() => {
    const searchParams = qs.stringify(
      {
        ...queryParams?.values,
        page: 1,
        limit: 10,
      },
      { addQueryPrefix: true }
    )
    // navigate(`/products/catalog/management${searchParams}`)
  }, [])

  const columnsCategories = tableHeadersCategories(searchTerm, setCategoryDrawer, setCreateEdit, status, type, setOpenConfirm, t)

  const columns = columnsCategories

  const confirmDialogTitle =
    openConfirm?.type === 'categories'
      ? openConfirm?.isDelete
        ? t('alerts.delete_category')
        : t('alerts.restore_category')
      : openConfirm?.isDelete
      ? t('alerts.delete_characteristic')
      : t('alerts.restore_characteristic')

  const confirmDialogDesc =
    openConfirm?.type === 'categories'
      ? openConfirm?.isDelete
        ? t('alerts.warning_delete_category')
        : t('alerts.warning_restore_category')
      : openConfirm?.isDelete
      ? t('alerts.warning_delete_characteristic')
      : t('alerts.warning_restore_characteristic')

  const descWidth = openConfirm?.type === 'categories' ? (openConfirm?.isDelete ? 522 : 410) : openConfirm?.isDelete ? 432 : 458

  const ConfirmDialogFunction = () => {
    if (openConfirm?.type === 'categories') {
      if (openConfirm?.isDelete) {
        deleteCategory(openConfirm?.id)
      } else {
        recoverCategory(openConfirm?.id)
      }
    }
    if (openConfirm?.type === 'characteristics') {
      if (openConfirm?.isDelete) {
        deleteCharacteristics(openConfirm?.id)
      } else {
        recoverCharacteristics(openConfirm?.id)
      }
    }
  }

  const tableData = categories?.data?.data?.data

  const tableLoading =
    type === 'attributes'
      ? attributesLoading || attributesFetching
      : type === 'characteristics'
      ? characteristicsLoading || characteristicsFetching
      : categoriesLoading || categoriesFetching

  const confirmLoading = isDeletingCat || isDeletingChar || isRecoveringCat || isRecoveringChar

  return (
    <>
      <Box pt={6} px={4} pb={3}>
        {/* <Box display='inline-flex'>
          <Box onClick={() => navigate('/products/catalog?page=1&limit=10&search=')} className={classes.backButton}>
            <BackArrowIcon style={{ fill: '#4993DD' }} />
          </Box>
          <Typography variant='h1' className={classes.title}>
            {t('titles.catalog_management')}
          </Typography>
        </Box>
        <Box mt={3.5} width='100%'>
          <InputSwitchNew name='incomeOrExpense' onChange={(value) => setType(value)} noMarginTop uncontrolled defaultValue={type} options={switchData} />
        </Box>
        {type !== 'attributes' && (
          <Box display='flex' mt={4}>
            <TabContainer
              tabs={tabs}
              selected={status}
              setSelected={setStatus}
              counts={type === 'characteristics' && [characteristics?.data?.active_count, characteristics?.data?.deleted_count]}
            />
          </Box>
        )} */}
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
          {/* <Box flex='0 0 10%' minWidth={256}>
            <Button id='create' adornmentStart={<PlusIcon fill='#fff' />} primary onClick={() => setCreateEdit({ type })} style={{ minWidth: 256 }}>
              {type === 'attributes' ? t('buttons.new_attribute') : type === 'characteristics' ? t('buttons.new_field') : t('menu.finance.categories.new')}
            </Button>
          </Box> */}
        </Box>
        <PaginationTable
          isExpendable
          customTablePadding='8px 14px'
          defaultPageSize={10}
          columns={columns}
          isDataLoading={tableLoading}
          data={tableData}
          pageCount={pageCount}
          navigateUrl='/products/catalog/management'
          noDataTitle={t('titles.data_not_found')}
          withHover
        />
      </Box>
      {/* <CategoriesProductViewDrawer
        openDrawer={categoryDrawer}
        closeDrawer={() => setCategoryDrawer(null)}
      />
      <CreateEditCategories
        refetch={refetchAll}
        open={createEdit?.type === 'categories'}
        editId={createEdit?.id}
        closeDrawer={closeDrawer}
      />
      <CreateEditAttributes
        refetch={refetchAll}
        open={createEdit?.type === 'attributes'}
        editId={createEdit?.id}
        closeDrawer={closeDrawer}
      />
      <CreateEditCharacteristics
        refetch={refetchAll}
        editId={createEdit?.id}
        open={createEdit?.type === 'characteristics'}
        closeDrawer={closeDrawer}
      /> */}
      {/* {!!openConfirm && (
        <ConfirmDialog
          open={!!openConfirm}
          setOpen={setOpenConfirm}
          icon={openConfirm?.isDelete ? <BigWarningCircleIcon /> : <BigWarningIcon />}
          title={confirmDialogTitle}
          desc={confirmDialogDesc}
          descWidth={descWidth}
          actions={
            <>
              <Button secondary id='stop' onClick={() => setOpenConfirm(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button onClick={ConfirmDialogFunction} size='medium' variant='contained' isLoading={confirmLoading}>
                {openConfirm?.isDelete ? t('buttons.delete') : t('buttons.restore')}
              </Button>
            </>
          }
        />
      )} */}
    </>
  )
}
