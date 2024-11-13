import { useEffect, useMemo, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import thousandDivider from '../../../utils/thousandDivider'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import CopyIcon from '../../assets/icons/CopyIcon'
import { success } from '../../../utils/toast'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import SectionTitle from '../../../components/SectionTitle'
import { products_statuses } from '../../assets/data/products-statuses'
import ImageCell from '../../../components/AgGridTable/Cells/ImageCell'

const SimpleText = ({ data, rowIndex, type, withDevider, endText = 'сум' }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'grey.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], endText) : data?.[type] || 'Неопределенный'}
    </Typography>
  )
}

export default function ShopProducts({ id, setImages }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const shopProductsFilter = useMemo(() => {
    return {
      dbId: id,
      limit: values?.limitShop || 5,
      offset: values?.offsetShop || 0,
    }
  }, [values?.limitShop, values?.offsetShop])

  const {
    data: shopProducts,
    isLoading: shopProductsLoading,
    isFetching: isFetchingShopProducts,
    refetch,
  } = useQuery('shopProducts', () => requests.getAllProducts(shopProductsFilter))

  useEffect(() => {
    const count = shopProducts?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
    setOffsetCount(offsetsCount || 0)
  }, [shopProducts?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [shopProductsFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Фото',
        colId: 'image',
        minWidth: 80,
        width: 80,
        cellRenderer: ({ data }) => <ImageCell imageArr={data?.files} setImages={setImages} />,
      },
      {
        headerName: 'Наименования',
        colId: 'name',
        minWidth: 80,
        cellRenderer: (p) => <SimpleText {...p} type='name' />,
      },
      {
        headerName: 'Cтатус',
        colId: 'status',
        minWidth: 80,
        cellRenderer: ({ data }) => (
          <StatusCell
            bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
            title={products_statuses.find((el) => el.id === data.status)?.name}
          />
        ),
      },
      {
        headerName: 'Цена',
        colId: 'price',
        minWidth: 80,
        cellRenderer: (p) => <SimpleText {...p} type='cost' withDevider />,
      },
      {
        headerName: 'Цена со скидкой',
        colId: 'price_with_discount',
        minWidth: 80,
        cellRenderer: (p) => <SimpleText {...p} type='discountCost' withDevider />,
      },
      {
        headerName: 'ID',
        colId: 'id_product',
        minWidth: 40,
        cellRenderer: ({ data }) => (
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(data?._id)
              success(`ID скопирован ${data._id}`)
            }}
            sx={{ borderRadius: 4, height: 48, width: 48 }}
          >
            <CopyIcon />
          </IconButton>
        ),
      },
    ],
    []
  )
  const formattedData = shopProducts?.data?.products?.map((el) => {
    const newEl = { ...el, ...el.productId }
    delete newEl.productId

    return newEl
  })

  return (
    <>
      <SectionTitle mt={6} grey>
        Товары магазина ({shopProducts?.data.totalCount})
      </SectionTitle>
      <AgGridTable
        id='shop-products-table'
        offsetQuery='offsetShop'
        limitQuery='limitShop'
        isDataLoading={isFetchingShopProducts || shopProductsLoading}
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </>
  )
}
