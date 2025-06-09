import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import Pagination from './Pagination'

function ListWithPagination({ request, renderItem, customFilter }) {
  const { values } = useQueryParams()

  const [page, setPage] = useState(0)
  const handleChange = (e) => {
    setPage(e)
  }
  const dataFilter = useMemo(() => {
    return {
      limit: 5,
      offset: page * 5 - 5 || 0,
    }
  }, [values?.offset, page])

  const {
    data: datList,
    isLoading: dataLoading,
    isFetching: isDataList,
    refetch,
  } = useQuery(['productsList', dataFilter, customFilter], () => request({ ...dataFilter, ...customFilter }))
  return (
    <Box>
      <Box>{datList?.data?.data?.data.map((item) => renderItem(item))}</Box>
      <Box display={'flex'} justifyContent={'end'}>
        <Pagination count={Math.ceil(datList?.data?.data?._meta?.total_count / 5)} handleChangeOffset={handleChange} page={page + 1} pageQuery='page' />
      </Box>
    </Box>
  )
}

export default ListWithPagination
