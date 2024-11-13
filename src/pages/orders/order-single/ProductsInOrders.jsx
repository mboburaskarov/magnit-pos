import { useMemo } from 'react'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { IconButton, Typography } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import { shop_statuses } from '../../../assets/data/shop-statuses'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import ImageCell from '../../../../components/AgGridTable/Cells/ImageCell'
import CopyIcon from '../../../assets/icons/CopyIcon'
import { success } from '../../../../utils/toast'

const SimpleText = ({ data, rowIndex, type, withDevider, endText = 'сум' }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'grey.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], endText) : data?.[type] || 'Неопределенный'}
    </Typography>
  )
}

export default function ProductsInOrders({ products, setImages, isDataLoading }) {
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
        headerName: 'Кол-во',
        colId: 'qauntity',
        minWidth: 50,
        cellRenderer: (p) => <SimpleText {...p} type='amount' withDevider endText='шт' />,
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
        headerName: 'Cтатус',
        colId: 'status',
        minWidth: 80,
        cellRenderer: ({ data }) => (
          <StatusCell bgcolor={shop_statuses.find((el) => el.id === data.status)?.color} title={shop_statuses.find((el) => el.id === data.status)?.name} />
        ),
      },
      {
        headerName: 'Категории',
        colId: 'status',
        minWidth: 200,
        width: 300,
        cellRenderer: ({ data }) => (
          <Typography>{data.categories?.map((el, ind) => (ind + 1 !== data.categories.length ? `${el.nameRu}, ` : el.nameRu))}</Typography>
        ),
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
  const formattedData = products?.map((el) => {
    const newEl = { ...el, ...el.productId }
    delete newEl.productId

    return newEl
  })

  return (
    <AgGridTable
      offsetQuery='offsetProductsInOrders'
      limitQuery='limitProductsInOrders'
      id='orders-products-table'
      columns={columns}
      isDataLoading={isDataLoading}
      data={formattedData}
      offsetCount={1}
      defaultOffsetSize={1000}
    />
  )
}
