import { useEffect, useMemo, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import thousandDivider from '../../../utils/thousandDivider'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import CopyIcon from '../../assets/icons/CopyIcon'
import { success } from '../../../utils/toast'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import SectionTitle from '../../../components/SectionTitle'
import { order_statuses } from '../../assets/data/order-statuses'
import Highlighter from 'react-highlight-words'
import TruncatedText from '../../../components/TruncatedText'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import OrderDrawer from '../sales/OrderDrawer'

const SimpleText = ({ data, rowIndex, type, withDevider, endText = 'сум' }) => {
  return (
    <Typography style={{ whiteSpace: 'pre-line' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], endText) : type === 'shop' ? data.shop.name || '' : data?.[type]}
    </Typography>
  )
}

const DefaultCell = ({ data, rowIndex, type, st: searchTerm }) => {
  return (
    <TruncatedText>
      {data?.[type]}
      <Highlighter
        highlightClassName='highlighter'
        id={`product-${type}-${rowIndex}`}
        searchWords={searchTerm ? searchTerm.split(' ') : []}
        autoEscape
        textToHighlight={data?.[type] || '-'}
        style={{ whiteSpace: 'pre-line' }}
        className='highlighter-preline'
      />
    </TruncatedText>
  )
}

export default function UserOrders({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(null)
  const [removeElFromDom, setRemoveElFromDom] = useState(true)

  const userOrdersFilter = useMemo(() => {
    return {
      userId: id,
      limit: values?.limitUserOrders || 5,
      offset: values?.offsetUserOrders || 0,
      status: 'DONE',
      fromDate: '2023-01-01',
    }
  }, [values?.limitUserOrders, values?.offsetUserOrders])

  const {
    data: userOrders,
    isLoading: userOrdersLoading,
    isFetching: isFetchingUserOrders,
    refetch,
  } = useQuery('userOrders', () => requests.getAllOrders(userOrdersFilter))

  useEffect(() => {
    const count = userOrders?.data.done
    const offsetsCount = Math.ceil(count / Number(values?.limitUserOrders))
    setOffsetCount(offsetsCount || 0)
  }, [userOrders?.data, values?.limitUserOrders])

  useEffect(() => {
    refetch()
  }, [userOrdersFilter])

  useEffect(() => {
    if (isOrderDrawerOpen) {
      setRemoveElFromDom(false)
    } else {
      setTimeout(() => {
        setRemoveElFromDom(true)
      }, 300)
    }
  }, [isOrderDrawerOpen])

  const columns = useMemo(
    () => [
      {
        colId: 'order_number',
        minWidth: 100,
        width: 100,
        headerName: '№',
        cellRenderer: (p) => <DefaultCell {...p} type='orderNumber' />,
      },
      {
        headerName: 'Наименования',
        colId: 'name',
        minWidth: 200,
        width: 200,
        cellRenderer: ({ data, rowIndex }) => (
          <Box onClick={() => setIsOrderDrawerOpen(data._id)}>
            <Typography sx={{ cursor: 'pointer' }} color='green.500'>
              Заказ
              <br /> <TimeCell color='green.500' data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />
            </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Магазин',
        colId: 'shop',
        minWidth: 130,
        width: 130,
        cellRenderer: (p) => <SimpleText {...p} type='shop' />,
      },
      {
        headerName: 'Cтатус',
        colId: 'status',
        minWidth: 160,
        width: 160,
        cellRenderer: ({ data }) => (
          <StatusCell bgcolor={order_statuses.find((el) => el.id === data.status)?.color} title={order_statuses.find((el) => el.id === data.status)?.name} />
        ),
      },
      {
        headerName: 'Сумма',
        colId: 'total',
        minWidth: 180,
        width: 180,
        cellRenderer: (p) => <SimpleText {...p} type='totalSum' endText='сум' withDevider />,
      },
      {
        headerName: 'Колво продуктов',
        colId: 'quantity',
        minWidth: 100,
        width: 100,
        cellRenderer: (p) => <SimpleText {...p} endText='шт' type='quantity' withDevider />,
      },
      {
        headerName: 'ID',
        colId: 'id_product',
        minWidth: 90,
        width: 90,
        cellRenderer: ({ data }) => (
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(data?._id)
              success(`ID скопирован ${data._id}`)
            }}
            sx={{ borderRadius: 4, height: 48, width: 48, p: 1.9 }}
          >
            <CopyIcon />
          </IconButton>
        ),
      },
    ],
    []
  )

  return (
    <>
      <SectionTitle mt={1} gray>
        Заказы пользователей ({userOrders?.data.totalCount}/{userOrders?.data.done})
      </SectionTitle>
      <AgGridTable
        id='user-orders-table'
        offsetQuery='offsetUserOrders'
        limitQuery='limitUserOrders'
        isDataLoading={isFetchingUserOrders || userOrdersLoading}
        columns={columns}
        data={userOrders?.data?.orders}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      {!removeElFromDom && <OrderDrawer refetch={refetch} isOpen={isOrderDrawerOpen} onClose={() => setIsOrderDrawerOpen(null)} />}
    </>
  )
}
