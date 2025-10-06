import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import Pagination from './Pagination'

function ListWithPagination({ request, limit = 5, renderItem, statePath = 'productsList', customFilter }) {
  const { values } = useQueryParams()

  const [page, setPage] = useState(0)
  const handleChange = (e) => {
    setPage(e)
  }

  const dataFilter = useMemo(() => {
    return {
      limit: limit,
      offset: page > 0 ? page * 5 - 5 : 0,
    }
  }, [values?.offset, page])

  const {
    data: datList,
    isLoading: dataLoading,
    isFetching: isDataList,
    refetch,
  } = useQuery([statePath, dataFilter, customFilter], () => request({ ...dataFilter, ...customFilter }))
  return (
    <Box>
      <Box sx={{ padding: '0 0 10px 0', borderRadius: '10px', overflow: 'hidden' }}>{datList?.data?.data?.data?.map((item) => renderItem(item))}</Box>
      <Box display={'flex'} justifyContent={'end'}>
        <Pagination count={Math.ceil(datList?.data?.data?._meta?.total_count / 5)} handleChangeOffset={handleChange} page={page + 1} pageQuery='page' />
      </Box>
    </Box>
  )
}

export default ListWithPagination
