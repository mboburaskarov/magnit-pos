import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import Header from '../../../../../components/Header'
import DateRangeInput from '../../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import MultiOptionSelectNew from '../../../../../components/Select/MultiOptionSelectNew'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/sellerBonusTableColumns'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'
export default function SellerBonus() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const [selectedShops, setSelectedShops] = useState('all')
  const { columns, loading } = useSelector((state) => state.sellerBonusTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [selectedBonusType, setSelectedBonusType] = useState({ id: 'default', name: 'По умолчанию' })
  const sortTypes = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'max_amount', name: 'Топ продажи сум' },
    { id: 'min_amount', name: 'Мин продажи сум' },
    { id: 'max_count', name: 'Больше продаж шт' },
    { id: 'min_count', name: 'Меньше продаж шт' },
  ]
  const tableColumns = tableHeaderSelector({
    vendorsColumns: columns,
    setOrderStoring,
    orderStoring,
    t,
  })
  useEffect(() => {
    navigate(`/reports/seller-bonus?limit=10&offset=0&start_date=${dayjs().startOf('month').format('YYYY-MM-DD')}&end_date=${dayjs().format('YYYY-MM-DD')}`)
  }, [shopList])

  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID && el.field !== 'category')
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const sellerBonnusFilter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)
    return {
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
    }
  }, [
    values?.offset,
    values?.from_time,
    values?.to_time,
    orderStoring,
    selectedBonusType,
    selectedShops,
    values?.limit,
    values?.search,
    values?.store_id,
    values?.start_date,
    values?.end_date,
  ])

  const {
    data: sellerBonnus,
    isLoading: sellerBonnusLoading,
    isFetching: isFetchingsellerBonnus,
    refetch,
  } = useQuery(['sellerBonnus', sellerBonnusFilter], () =>
    requests.getSellerBonus(sellerBonnusFilter, selectedShops == 'all' ? get(shopList, 'data.data.ids', []) : selectedShops.map(({ id }) => id))
  )

  useEffect(() => {
    refetch()
  }, [sellerBonnusFilter])

  useEffect(() => {
    const count = sellerBonnus?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [sellerBonnus?.data, values?.limit])
  const { mutate: sellerBonusExcelReport, isLoading: issellerBonusExcelReport } = useMutation(requests.getsellerBonusExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Header noActions isLoading={false} backIcon backHref='/reports/vendor' text={'Отчет: бонусах продавца '} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'24px'} px={'50px'} pb={'20px'}>
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                mr: '10px',
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '450px',
                  height: 48,
                },
              }}
            >
              <InputSearch fullWidth id='producrs-search' name='search' placeholder={'ID, имя, телефон'} uncontrolled />
            </Box>
          </Box>

          <Box
            width={956}
            display={'flex'}
            sx={{
              '& .select': {
                width: '175px !important',
              },
            }}
          >
            <DateRangeInput
              minHeight={'48px'}
              id='accounting-report-date-range'
              defaultFilterData={{ end_date: dayjs().endOf('month').format('YYYY-MM-DD'), start_date: dayjs().startOf('month').format('YYYY-MM-DD') }}
            />
            <Box width={'15px'} />
            <MultiOptionSelectNew
              zIndex={999}
              placeholder={t('placeholders.select_shops')}
              multiple
              defaultSelectedAll
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
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            downloadByFilter={() => sellerBonusExcelReport(sellerBonnusFilter)}
            fullDownload={() => sellerBonusExcelReport({ ...sellerBonnusFilter, offset: 0, limit: 1000000 })}
            isDownloading={issellerBonusExcelReport}
            data={sellerBonnus?.data?.data?.data || []}
            totalCount={sellerBonnus?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingsellerBonnus || sellerBonnusLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Бонусах продавца',
              description: 'Если вы не можете найти искомый бонусах продавца, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingsellerBonnus || sellerBonnusLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
