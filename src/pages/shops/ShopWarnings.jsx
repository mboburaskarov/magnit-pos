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
import { products_statuses } from '../../assets/data/products-statuses'
import ImageCell from '../../../components/AgGridTable/Cells/ImageCell'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import StyledTooltip from '../../../components/StyledTooltip'
import TimeCountdown from '../../../components/TimeCountdown'
import dayjs from 'dayjs'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'

const SimpleText = ({ data, rowIndex, type, withDevider, endText = 'сум' }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'grey.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], endText) : data?.[type] || 'Неопределенный'}
    </Typography>
  )
}

export default function ShopWarnings({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [warningType, setWarningType] = useState('ACTIVE')

  const shopWarningsFilter = useMemo(() => {
    return {
      shopId: id,
      limit: values?.limitWarning || 5,
      offset: values?.offsetWarning || 0,
    }
  }, [values?.limitWarning, values?.offsetWarning])

  const {
    data: shopProblems,
    isLoading: shopProblemsLoading,
    isFetching: isFetchingShopProblems,
    refetch,
  } = useQuery('shopProblems', () => requests.getShopProblems(shopWarningsFilter))

  useEffect(() => {
    const count = shopProblems?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
    setOffsetCount(offsetsCount || 0)
  }, [shopProblems?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [shopWarningsFilter])
  const columns = useMemo(
    () => [
      {
        headerName: 'Причина',
        colId: 'name',
        minWidth: 180,
        width: 180,
        cellRenderer: (p) => <SimpleText {...p} type='reason' />,
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
        headerName: 'Номер заказа',
        colId: 'orderNumber',
        minWidth: 80,
        cellRenderer: ({ data }) => <Typography sx={{ whiteSpace: 'pre-line', color: 'green.500' }}>{data?.orderNumber}</Typography>,
      },
      {
        headerName: 'Модератор',
        colId: 'moderator',
        minWidth: 150,
        width: 150,
        cellRenderer: ({ data }) => <Typography sx={{ whiteSpace: 'pre-line' }}>{data?.moderator?.fullName}</Typography>,
      },
      {
        headerName: 'Срок действия',
        colId: 'activeTime',
        minWidth: 80,
        cellRenderer: ({ data }) => (
          <StyledTooltip title={data?.status === 'ACTIVE' ? 'Осталось' : 'Прошло'}>
            <TimeCountdown moreDay endTime={dayjs(data?.createdAt).add(7, 'day')} />
          </StyledTooltip>
        ),
      },
      {
        headerName: 'Дата',
        colId: 'date',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />,
      },
    ],
    []
  )

  return (
    <>
      <Box mt={6} display={'flex'} justifyContent={'space-between'}>
        <SectionTitle mt={2}>Предупреждения</SectionTitle>
        <InputSwitch
          uncontrolled
          onChange={(e) => setWarningType(e)}
          value={warningType}
          id='warning-type'
          name='warning-type'
          defaultValue='ACTIVE'
          options={[
            { title: 'Активные', value: 'ACTIVE' },
            { title: 'Неактивные', value: 'INACTIVE' },
          ]}
        />
      </Box>
      <AgGridTable
        id='shop-products-table'
        offsetQuery='offsetWarning'
        limitQuery='limitWarning'
        isDataLoading={isFetchingShopProblems || shopProblemsLoading}
        columns={columns}
        data={shopProblems?.data?.shopProblems?.filter((item) => item.status === warningType)}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </>
  )
}
