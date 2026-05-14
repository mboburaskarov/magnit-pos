import CloseIcon from '@/assets/icons/CloseIcon'
import { useQueryParams } from '@/hooks/useQueryParams'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import InputSearch from '@components/Inputs/InputSearch'
import SelectSimple from '@components/Select/SelectSimple'
import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import TargetByEmployee from './TargetByEmployeeModal'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { get } from 'lodash'
import { error } from '@utils/toast'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme) => ({
  drawer: {
    maxWidth: '840px',
    '& .MuiDrawer-paper': {
      width: '60%',
      maxWidth: '840px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    height: '80px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Gilroy-Bold, sans-serif',
    fontSize: 24,
    fontWeight: 700,
    color: theme.palette.bunker[950],
    lineHeight: '32px',
  },
}))

export const ProgressBar = ({ current, total, minWidth = '100%', mt = '10px' }) => {
  const progress = current / total
  return (
    <Box sx={{ width: '100%', minWidth: minWidth, height: '36px', backgroundColor: 'orange.200', borderRadius: '6px', mt: mt ,overflow: 'hidden' }}>
      <Box width={(current * 100) / total + '%'} height={36} sx={{ backgroundColor: 'orange.500', borderRadius: '6px' }}>
        {progress > 10 && (
          <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '500', color: 'white', textAlign: 'center' }}>{progress + '%'}</Typography>
        )}
      </Box>
    </Box>
  )
}

const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    let newOrder = { position: 0, colId: '' }
    if (lastStort) {
      if (orderPosition == 2 && ordercolId == props.column.colId) {
        newOrder = {
          position: 0,
          colId: '',
        }
      } else {
        if (ordercolId != props.column.colId && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: props.column.colId,
          }
        } else {
          newOrder = {
            position: orderPosition + 1,
            colId: props.column.colId,
          }
        }
      }
    }

    props.column.colDef.setOrderStoring(newOrder)
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        padding: '12px',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111217',
          fontSize: '16px',
          fontWeight: ' 600',
          lineHeight: '24px',
        }}
      >
        {props.displayName}
        <Box height={'18px'} ml='10px'>
          {orderPosition == 1 && currentColId == ordercolId && <ArrowUpward color='#ccc' />}
          {orderPosition == 2 && currentColId == ordercolId && <ArrowDownward color='#ccc' />}
        </Box>
      </Typography>
    </Box>
  )
}

export default function TargetDrawer({ openDrawer, closeDrawer }) {
  const classes = useStyles()
  const { values } = useQueryParams()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const [offsetCount, setOffsetCount] = useState(0)
  const [openTargetByEmployee, setOpenTargetByEmployee] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(3)
  const targetListFIlter = useMemo(() => {
    return {
      limit: values?.limitTarget || 5,
      offset: values?.offsetTarget || 0,
      search: values?.search,
      month: selectedMonth?.id || dayjs().month(),
      year: selectedYear?.id || dayjs().year(),
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
    }
  }, [values?.limitTarget, values?.offsetTarget, values?.search, orderStoring, selectedMonth, selectedYear])

 const {
  data: targetList,
  isLoading: isTargetList,
  isFetching: isFetchingTargetList,
} = useQuery({
  queryKey: ['targetList', targetListFIlter],
  queryFn: () => requests.getTargetList(targetListFIlter),
  enabled: !!openDrawer?.open,
})
const { data: dashboardTargetStatistic } = useQuery({
  queryKey: ['dashboardTargetStatisticInside', targetListFIlter],
  queryFn: () => requests.dashboardTargetStatistic(targetListFIlter),
  enabled: !!openDrawer?.open,
})
 
  const { mutate: targetsExcelReport, isLoading: istargetsExcelReport } = useMutation(requests.getTargetsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
useEffect(() => {
    const count = targetList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitTarget || 0))

    setOffsetCount(offsetsCount || 0)
  }, [targetList?.data, values?.limitTarget])

  const columns = useMemo(
    () => [
      {
        headerName: 'Aптека',
        colId: 'store_name',
        minWidth: 250,
        maxWidth: 450,
        width: 350,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        cellRenderer: ({ data, rowIndex }) => (
          <Box
            id={`${'created_at'}-${rowIndex}`}
            whiteSpace='pre-wrap'
            onClick={() => setOpenTargetByEmployee({ store_id: data?.store_id, store_target_id: data?.id, open: true, filter: targetListFIlter })}
            sx={{ cursor: 'pointer' }}
          >
            <Typography color={'orange.500'}>{data?.store_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Таргет',
        colId: 'target',
        minWidth: 180,
        flex: 1,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        cellRenderer: ({ data }) => <SimpleText data={data} type={'amount'} withDevider currency={'сум'} />,
      },
      {
        headerName: 'Продажи',
        colId: 'sales',
        minWidth: 180,
        maxWidth: 180,
        width: 180,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        cellRenderer: ({ data }) => <SimpleText data={data} type={'sales'} withDevider currency={'сум'} />,
      },
      {
        headerName: '',
        colId: 'progress',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <ProgressBar current={data?.sales} total={data?.amount} minWidth='140px' />
          </Box>
        ),
      },
    ],
    [orderStoring,targetListFIlter],
  )

  const formattedData = targetList?.data?.data?.data

  return (
    <Drawer className={classes.drawer} open={openDrawer?.open} onClose={closeDrawer} anchor='right'>
      <Box className={classes.header}>
        <Typography className={classes.title}>Таргет</Typography>
        <CloseIcon color={'black'} onClick={() => closeDrawer(false)} />
      </Box>
      <Box sx={{ padding: '12px 20px', mt: '24px' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '28px', fontWeight: '600', color: 'bunker.950' }}>
          Цель на месяц {thousandDivider(dashboardTargetStatistic?.data?.data?.total_target_amount, 'сум')}{' '}
        </Typography>
        <ProgressBar current={dashboardTargetStatistic?.data?.data?.total_target_sales} total={dashboardTargetStatistic?.data?.data?.total_target_amount} />
      </Box>
      <Box
        sx={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <Box
          width='250px'
          sx={{
            '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
            '& .MuiFormControl-root, .MuiFormControl-root:hover': {
              background: 'transparent',
              height: 48,
            },
          }}
        >
          <InputSearch fullWidth id='producrs-search' name='search' placeholder={t('Поиск')} uncontrolled />
        </Box>

        {/* year select */}
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <SelectSimple
            fullWidth
            id='year'
            white
            name='year'
            minWidth='auto'
            uncontrolled
            isClearable={false}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder={'2026'}
            options={[
              { name: '2026', id: '2026' },
              { name: '2027', id: '2027' },
              { name: '2028', id: '2028' },
              { name: '2029', id: '2029' },
              { name: '2030', id: '2030' },
              { name: '2031', id: '2031' },
              { name: '2032', id: '2032' },
              { name: '2033', id: '2033' },
              { name: '2034', id: '2034' },
              { name: '2035', id: '2035' },
              { name: '2036', id: '2036' },
              { name: '2037', id: '2037' },
              { name: '2038', id: '2038' },
              { name: '2039', id: '2039' },
              { name: '2040', id: '2040' },
            ]}
            getOptionLabel={(el) => el.name}
          />
          <SelectSimple
            fullWidth
            id='month'
            white
            name='month'
            minWidth='140px'
            uncontrolled
            value={selectedMonth}
            isClearable={false}
            onChange={setSelectedMonth}
            placeholder={'Март'}
            options={[
              { name: 'Январь', id: '1' },
              { name: 'Февраль', id: '2' },
              { name: 'Март', id: '3' },
              { name: 'Апрель', id: '4' },
              { name: 'Май', id: '5' },
              { name: 'Июнь', id: '6' },
              { name: 'Июль', id: '7' },
              { name: 'Август', id: '8' },
              { name: 'Сентябрь', id: '8' },
              { name: 'Октябрь', id: '10' },
              { name: 'Ноябрь', id: '11' },
              { name: 'Декабрь', id: '12' },
            ]}
            getOptionLabel={(el) => el.name}
          />
        </Box>
      </Box>
      <Box sx={{ padding: '12px 20px' }}>
        <AgGridTable


          fullDownload={() => targetsExcelReport({ ...targetListFIlter, offset: 0, limit: 6000000 })}
          downloadByFilter={() => targetsExcelReport(targetListFIlter)}
          isDownloading={istargetsExcelReport}

        


          isDataLoading={isTargetList || isFetchingTargetList}
          offsetQuery='offsetTarget'
          limitQuery='limitTarget'
          id='products-target-table'
          totalCount={targetList?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          updaterAction={() => {}}
          defaultOffsetSize={5}
          emptyTableText={{
            title: 'Нет Таргета',
            description: ' ',
          }}
        />
      </Box>
      <TargetByEmployee open={openTargetByEmployee} setOpen={setOpenTargetByEmployee} />
    </Drawer>
  )
}
