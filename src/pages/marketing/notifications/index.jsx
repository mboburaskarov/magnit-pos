import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TabContainer from '../../../../components/Tab/TabContainer'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { useDispatch, useSelector } from 'react-redux'
import tableHeaderSelector from './tableHeaderSelector'
import { resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/notificationsTableColumns'
import ImageGallery from '../../../../components/ImageGallery'
import CheckAccess from '../../../../components/CheckAccess'
export default function NotificationsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('ALL')
  const { values } = useQueryParams()
  const { columns, loading } = useSelector((state) => state.notificationsTableColumns)
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const tableColumns = tableHeaderSelector({ orderColumns: columns, searchTerm: values?.search, setImages: setOpenImageGallery })

  const notificationsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      type: 'NEWS',
    }
  }, [values?.offset, values?.limit])
  const {
    data: notificationList,
    isFetching: isFetchingNotificationList,
    isLoading: isLoadingNotificationList,
    refetch,
  } = useQuery(['allNotifications', notificationsListFilter], () => requests.getAllNotifications(notificationsListFilter))
  useEffect(() => {
    refetch()
  }, [notificationsListFilter, notificationList?.data?.totalCount])
  useEffect(() => {
    const offsetsCount = Math.ceil(notificationList?.data?.totalCount / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [notificationList?.data, values?.limit])
  return (
    <Box>
      <ImageGallery name={'уведомления'} open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant='h1'>Уведомления</Typography>
          <DateRangeInput
            defaultFilterData={{ label: 'За все время', start_date: dayjs('01.01.2023'), end_date: dayjs().tz() }}
            id='notifications-date-range'
          />
        </Box>
        <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            tabs={[
              {
                label: 'Все',
                id: 'ALL',
              },
              {
                label: 'Кастомные',
                id: 'CUSTOM',
              },
              { label: 'Группа', id: 'groups' },
            ]}
            counts={[notificationList?.data?.totalCount, 0, 0]}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='notifications-search' name='search' placeholder='Введите номер уведомления' uncontrolled />
          </Box>
          <CheckAccess id={'notification-create'}>
            <Box minWidth={156}>
              <Button
                onClick={() => navigate('/marketing/notifications/create')}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box>
          <AgGridTable
            id='notifications-main-table'
            tableSettings
            columns={tableColumns || []}
            data={notificationList?.data?.notifications?.map((el) => el) || []}
            isDataLoading={isFetchingNotificationList || isLoadingNotificationList}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            isRefreshing={loading || isFetchingNotificationList || isLoadingNotificationList}
          />
        </Box>
      </Box>
    </Box>
  )
}
