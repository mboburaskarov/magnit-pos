import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import InputSearch from './Inputs/InputSearch'
import { useTranslation } from 'react-i18next'
import PlusIcon from '../src/assets/icons/PlusIcon'
import TreeSelectCategory from './TreeSelectCategory/index'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import Pagination from './Table/Pagination'
import RowFilterButton from './Table/RowFilterButton'
import requests from './CheckAccess'
import { useFormContext } from 'react-hook-form'
import CreateEditCategories from './CreateEditCategories'
import { useQueryParams } from '../src/hooks/useQueryParams'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px 24px 0 24px',
    border: `1px solid ${theme.palette.gray[300]}`,
    paddingTop: 0,
    borderRadius: 24,
    marginTop: 16,
    maxHeight: 808,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
  treeView: {
    marginTop: 24,
    '& .MuiTreeItem-root': {
      width: '100%',
      background: theme.palette.gray[50],
      borderRadius: 16,
      marginTop: 8,
    },

    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      background: 'none !important',
    },
  },
  searchBar: {
    display: 'flex',
    position: 'sticky',
    padding: '24px 0px 0px 0px',
    top: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: 1,
  },
  addCategoryButton: {
    position: 'sticky',
    bottom: -2,
    paddingBottom: '16px',
    paddingTop: '24px',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    zIndex: 1,
  },
}))

function createTreeAdd(nodes = []) {
  return nodes.reduce(
    (tree, node) => [
      ...tree,
      {
        ...node,
        children: [...createTreeAdd(node?.subRows || [])],
      },
    ],
    []
  )
}

export default function FileSystemNavigator({
  showBorder = true,

  canAdd = true,
  disabled,
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const { setValue: setValue2, getValues } = useFormContext()
  const company_id = useSelector((state) => state.company)
  const [createEdit, setCreateEdit] = useState(false)
  const [selected, setSelected] = useState([])
  const { values } = useQueryParams()
  const [searchedCategories, setSearchedCategories] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const changePage = (page) => {
    const activePage = page + 1
    if (page === activePage) {
      return
    }

    setPageIndex(page - 1)
  }

  const {
    data: categories,
    refetch,
    isLoading,
  } = useQuery('categories', () =>
    requests.category.getAll({
      company_id,
      limit: pageSize,
      search: values?.search,
      page: pageIndex + 1,
    })
  )

  useEffect(() => {
    const pages = Math.ceil(categories?.data.count / pageSize)
    setPageCount(pages ?? 1)
  }, [categories?.data])

  useEffect(() => {
    refetch()
    setSearchedCategories(categories?.data?.categories)
  }, [values?.search, categories?.data?.categories, pageIndex, pageSize])

  useEffect(() => {
    setValue2('category_ids', selected)
  }, [selected, setValue2])

  useEffect(() => {
    changePage(1)
  }, [values?.search])

  useEffect(() => {
    if (getValues('category_ids')) setSelected(getValues('category_ids'))
  }, [getValues('category_ids')])

  const handleCreateButtonClick = (data) => {
    setCreateEdit(data)
  }

  return (
    <>
      <Box className={showBorder ? classes.root : null}>
        <Box display='flex' className={showBorder ? classes.searchBar : ''} mb={showBorder ? 0 : 3}>
          <InputSearch name='search' placeholder={t('placeholders.category_name')} fullWidth uncontrolled />
        </Box>

        {canAdd && (
          <Box className={classes.addCategoryButton}>
            <Button id='add-category' onClick={() => setCreateEdit(true)} secondary fullWidth disabled={disabled}>
              <PlusIcon style={{ marginRight: 8 }} fill='#4993DD' />
              {t('buttons.new_category')}
            </Button>
          </Box>
        )}
        {isLoading ? (
          // <LoadingBlock />
          <>loadingss</>
        ) : (
          searchedCategories?.length !== 0 && (
            <TreeSelectCategory
              selected={selected}
              disabled={disabled}
              setSelected={setSelected}
              handleCreate={handleCreateButtonClick}
              categories={createTreeAdd(searchedCategories)}
            />
          )
        )}

        <Box width='100%' display='flex' alignItems='center' justifyContent='space-between' my={3}>
          <Pagination count={pageCount} handleChangePage={changePage} page={pageIndex + 1} pageQuery='page' />

          <RowFilterButton id='row-filter' pageSize={pageSize} setPageSize={setPageSize} setPageIndex={setPageIndex} />
        </Box>
      </Box>

      <CreateEditCategories
        withoutNavigate
        refetch={refetch}
        open={!!createEdit}
        editId={createEdit?.parentId}
        focusId={createEdit?.id}
        closeDrawer={() => setCreateEdit(false)}
      />
    </>
  )
}
