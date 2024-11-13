import { useEffect, useRef, useState } from 'react'
import useDidUpdate from './useDidUpdate'

export default function useVirtualizedData(request, search, page = 1, id, filters = { limit: 10 }, isNewSale = false) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const ref = useRef([])
  const [maxPage, setMaxPage] = useState(1)

  const fetch = () => {
    request({
      limit: filters?.limit || 10,
      offset: (page - 1) * (filters?.limit || 10),
      searchText: search,
      ...filters,
    })
      .then((res) => {
        const maxPageCount = Math.ceil(res?.data?.totalCount / (filters?.limit || 1))
        if (maxPageCount !== maxPage && !!maxPageCount) {
          setMaxPage(maxPageCount)
        }
        const resData = res?.data?.[id] || []
        const ids = new Set(ref.current.map((d) => d._id))
        ref.current = [...ref.current, ...resData.filter((d) => !ids.has(d._id))]

        setData(ref.current)

        setHasMore(res?.data?.totalCount > filters?.limit && res?.data?.[id]?.length)
        setLoading(false)
      })
      .catch((e) => {
        setError(true)
      })
  }

  const effect = () => {
    setLoading(true)
    setError(false)

    if (page <= maxPage && isNewSale && search) {
      fetch()
      return
    }
    if (page <= maxPage && !isNewSale) {
      fetch()
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    effect()
  }, [])

  useDidUpdate(() => {
    ref.current = []
    effect()
  }, [search])

  useDidUpdate(() => {
    effect()
  }, [page])

  return { loading, error, data, hasMore, setData }
}
