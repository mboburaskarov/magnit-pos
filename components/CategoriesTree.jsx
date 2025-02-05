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
import { useFormContext } from 'react-hook-form'
import LoadingBlock from '../components/LoadingBlock'
import CreateEditCategories from './CreateEditCategories'
import { useQueryParams } from '../src/hooks/useQueryParams'
import { makeStyles } from '@mui/styles'
import { requests } from '../utils/requests'

const useStyles = makeStyles((theme) => ({
  roots: {
    padding: '24px 24px 0 24px',
    border: `1px solid ${theme.palette.bunker[100]}`,
    paddingTop: 0,
    borderRadius: 24,
    marginTop: 16,
    maxHeight: 808,
    // overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
  root: {
    // padding: '24px 24px 0 24px',
    // border: `1px solid ${theme.palette.bunker[100]}`,
    paddingTop: 0,
    borderRadius: 24,
    marginTop: 16,
    maxHeight: 708,
    // overflowY: 'scroll',
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
    height: '48px',
    width: '48px',
    minWidth: '48px',
    backgroundColor: theme.palette.bg[10],
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '16px',
    zIndex: 1,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.bunker[100],
    },
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
    requests.getAllCategories({
      company_id,
      limit: pageSize,
      search: values?.search,
      offset: pageIndex,
    })
  )

  useEffect(() => {
    const pages = Math.ceil(categories?.data?.data?._meta?.total_count / pageSize)

    setPageCount(pages ?? 1)
  }, [categories?.data?.data])
  function renameSubRows(obj) {
    // debugger
    if (obj.sub_category || obj.sub_category === 'null') {
      obj.subRows = obj.sub_category
      delete obj.sub_category

      obj.subRows.forEach(renameSubRows) // Recurse through sub_category if exists
    }
    return obj
  }
  useEffect(() => {
    refetch()
  }, [values?.search, pageIndex, pageSize])
  useEffect(() => {
    setSearchedCategories(categories?.data?.data?.data?.map((el) => renameSubRows(el)))
  }, [categories?.data?.data])
  useEffect(() => {
    setValue2('category_ids', selected)
  }, [selected, setValue2])

  useEffect(() => {
    changePage(1)
  }, [values?.search])

  useEffect(() => {
    // if (getValues('category_ids')) setSelected(getValues('category_ids'))
  }, [getValues('category_ids')])

  const handleCreateButtonClick = (data) => {
    refetch()
    setCreateEdit(data)
  }

  return (
    <>
      <Box className={showBorder ? classes.roots : null}>
        <Box className={showBorder ? classes.root : null}>
          <Box display='flex' className={showBorder ? classes.searchBar : ''} mb={showBorder ? '30px' : 3}>
            <InputSearch name='search' placeholder={t('placeholders.category_name')} fullWidth uncontrolled />
            {canAdd && (
              <Box className={classes.addCategoryButton} onClick={() => setCreateEdit(true)}>
                <PlusIcon style={{ marginRight: 8 }} />
              </Box>
            )}
          </Box>

          {isLoading ? (
            <LoadingBlock />
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
        </Box>
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
