import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import DateRangeInputWithoutSelct from '../../../../components/Inputs/DateRangeInputWithoutSelect/DateRangeInput'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import LoadingContainer from '../../../../components/LoadingContainer'
import MultiOptionSelectNew from '../../../../components/Select/MultiOptionSelectNew'
import { downloadExcel } from '../../../../utils/downloadEXCEL'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function ReportLfl() {
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [appType, setAppType] = useState('ALL')
  const [selectedShops, setSelectedShops] = useState('all')
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))

  const [columnGroups, setColumnGroups] = useState([
    { id: 'first_month', name: 'Декабрь' },
    { id: 'second_month', name: 'Январь' },
  ])
  console.log(selectedShops)

  const ReportLFLFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: selectedShops == 'all' ? undefined : selectedShops[0]?.id,
      start_date: dayjs(values?.start_date).format('YYYY-MM') || dayjs().format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : dayjs(values?.end_date).format('YYYY-MM'),
    }
  }, [values?.offset, values?.limit, selectedShops, values?.search, values?.store_id, values?.start_date, values?.end_date])

  const {
    data: ReportLFL,
    isLoading: ReportLFLLoading,
    isFetching: isFetchingReportLFL,
    refetch,
  } = useQuery(['ReportLFL', ReportLFLFilter], () => requests.getReportLFL(ReportLFLFilter))

  useEffect(() => {
    refetch()
  }, [ReportLFLFilter])

  useEffect(() => {
    const count = ReportLFL?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [ReportLFL?.data, values?.limit])
  const { mutate: clientsExcelReport, isLoading: isclientsExcelReport } = useMutation(requests.getClientsExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, 'Клиенти')
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })

  const mockApiData = {
    december: [
      {
        id: 1,
        date: '05.12.24, Чт',
        pharmacy_count: '52 шт',
        priceform: '892 345 432 sum',
        medicine: '892 345 432 sum',
        total_sales: '9 892 345 432 sum',
        rowId: '1',
      },
      {
        id: 2,

        date: '06.12.24, Пт',
        pharmacy_count: '48 шт',
        priceform: '792 345 432 sum',
        medicine: '792 345 432 sum',
        total_sales: '8 792 345 432 sum',
        rowId: '2',
      },
    ],
    january: [
      {
        date: '05.01.25, Сб',
        id: 4,
        pharmacy_count: '52',
        priceform: '892 345 432 sum',
        medicine: '892 345 432 sum',
        total_sales: '9 892 345 432 sum',
        rowId: '1',
      },
      {
        date: '06.01.25, Вс',
        id: 5,
        pharmacy_count: '50',
        priceform: '872 345 432 sum',
        medicine: '872 345 432 sum',
        total_sales: '9 872 345 432 sum',
        rowId: '2',
      },
    ],
  }
  const baseColumnDefinition = [
    { headerName: 'Дата', field: 'date', minWidth: 120, width: 80, flex: 1 },
    { headerName: 'Кол-во аптек', field: 'pharmacy_count', minWidth: 150, width: 100 },
    { headerName: 'Парафарма', field: 'priceform', minWidth: 170, width: 120 },
    { headerName: 'Лекарство', field: 'medicine', minWidth: 170, width: 120 },
    { headerName: 'Общая продажа', field: 'total_sales', minWidth: 200, width: 120 },
  ]

  const dynamicColumnDefs = useMemo(() => {
    return columnGroups.map((group) => {
      const groupColumns = baseColumnDefinition.map((baseCol, index) => {
        const isLastColumn = index === baseColumnDefinition.length - 1

        return {
          ...baseCol,
          field: `${group.id}_${baseCol.field}`,
          colId: `${group.id}_${baseCol.field}`,
          cellClass: isLastColumn ? 'last-grouped-child' : '',
          headerClass: isLastColumn ? 'last-grouped-child' : '',
          cellRenderer: (params) => {
            const fieldValue = params.data?.[params.colDef.field]
            return <Typography>{fieldValue !== undefined ? fieldValue : '-'}</Typography>
          },
        }
      })
      return {
        headerName: group.name,
        children: groupColumns,
      }
    })
  }, [columnGroups, baseColumnDefinition])
  let ind = 0
  const transformDataForGrid = (apiData) => {
    console.log(apiData)
    if (ReportLFLLoading) return []
    const rows = []
    const rowIds = new Set()
    columnGroups.forEach((group) => {
      const groupData = apiData[group.id] || []
      groupData.forEach((item) => rowIds.add(item.rowId))
    })
    Array.from(rowIds).forEach((rowId) => {
      const rowData = {}

      columnGroups.forEach((group) => {
        const groupData = apiData[group.id] || []
        const rowItem = groupData.find((item) => item.rowId === rowId) || {}
        baseColumnDefinition.forEach((col, index) => {
          const value = rowItem[col.field]
          rowData[`${group.id}_${col.field}`] = value !== undefined ? value : '-'
          rowData[`id`] = ind
          ind++
        })
      })

      rows.push(rowData)
    })

    return rows
  }
  console.log(ReportLFL, get(ReportLFL, 'data.data'))

  const tableData = useMemo(() => transformDataForGrid(get(ReportLFL, 'data.data')), [ReportLFL, ReportLFLLoading, columnGroups])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('Oтчет LFL ')}
        </Typography>
        <Box
          minWidth={320}
          mb={'16px'}
          sx={{
            display: 'flex',
            width: '100%',
            '& .slider': {
              width: '100%',
            },
            '& .slider_box': {
              width: '100%',
            },
            '& .slider_box_wrapper': {
              width: '100%',
            },
          }}
        >
          <InputSwitch
            uncontrolled
            id='app-type'
            style={{ width: '100%' }}
            name='app-type'
            value={appType}
            defaultValue='ALL'
            onChange={(e) => setAppType(e)}
            options={[
              { title: t('Таблица'), value: 'ALL' },
              { title: t('График'), value: 'active', soon: true },
            ]}
          />
        </Box>
        <Box sx={{ mb: '20px', display: 'flex' }}>
          <DateRangeInputWithoutSelct
            defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }}
            id='accounting-report-date-range'
          />
          <Box maxWidth={'300px'} ml={2} mr={2}>
            <MultiOptionSelectNew
              zIndex={999}
              placeholder={t('placeholders.select_shops')}
              // fullWidth
              multiple
              defaultSelectedAll
              // minWidth='auto'
              beforeContent={t('placeholders.select_shops')}
              value={selectedShops}
              allOptions={get(shopList, 'data.data.ids', [])}
              selectAllLabel={t('Все филиалы')}
              options={get(shopList, 'data.data.data', [])}
              isLoading={false}
              onChange={(val) => {
                setSelectedShops(val)
              }}
              request={requests.getAllStores}
            />
          </Box>
        </Box>

        <Box>
          <AgGridTable
            id='group-table'
            className=''
            tableSettings
            groupHeaderHeight={50}
            headerHeight={40}
            fullDownload={() => clientsExcelReport({ ...ReportLFLFilter, limit: 1000000 })}
            downloadByFilter={() => clientsExcelReport(ReportLFLFilter)}
            isDownloading={isclientsExcelReport}
            columns={dynamicColumnDefs}
            // totalCount={ReportLFL?.data?.data?._meta?.total_count || 0}
            // data={ReportLFL?.data?.data?.data || []}
            data={tableData}
            isDataLoading={isFetchingReportLFL || ReportLFLLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Клиент не существует',
              description: 'Если вы не нашли искомого Клиента, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            fullInfoAboutCurrentPage
            isRefreshing={isFetchingReportLFL || ReportLFLLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
