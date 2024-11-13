import React, { useEffect, useMemo, useState } from 'react'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Header from '../../../../../components/Header'
import SectionTitle from '../../../../../components/SectionTitle'
import InputSwitch from '../../../../../components/Inputs/InputSwitch'
import { useForm, useFormContext } from 'react-hook-form'
import ImageUpload from '../../../../../components/ImageUpload'
import InputDatePicker from '../../../../../components/Inputs/InputDatePicker'
import { useIMask } from 'react-imask'
import TextField from '../../../../../components/Inputs/TextField'
import dayjs from 'dayjs'
import TabContainer from '../../../../../components/Tab/TabContainer'
import ToggleButton from '../../../../../components/Buttons/ToggleButton'
import { useQuery } from 'react-query'
import { requests } from '../../../../../utils/requests'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import tableHeaderSelector from './tableHeaderSelector'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import { updateTableHeader } from '../../../../redux-toolkit/tableSlices/notificationsCustomTableColumns'
import { resetTableHeader } from '../../../../redux-toolkit/tableSlices/notificationsTableColumns'
import { error } from '../../../../../utils/toast'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import tableHeaderSelectorShops from './tableHeaderSelectorShops'
import { client_groups } from '../../../../assets/data/client-groups'

export default function NotificationCreateBody({ notificationBody }) {
  const { watch, setValue } = useFormContext()
  const theme = useTheme()
  const { notificationType, setNotificationType, group, setGroup, timeSelect, setTimeSelect, selectedRowsIds, setSelectedRowIds } = notificationBody
  const { ref: H_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: M_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const [offsetCount, setOffsetCount] = useState(0)
  const [shopsOffsetCount, setshopsOffseCount] = useState(0)
  const { values } = useQueryParams()
  const userListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      searchText: values?.search,
      status: 'ACTIVE',
    }
  }, [values?.offset, values?.limit, values?.search])

  const shopListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      searchText: values?.search,
      status: 'ACTIVE',
    }
  }, [values?.offset, values?.limit, values?.search])
  const {
    data: userList,
    isLoading: userListLoading,
    isFetching: isFetchingUserList,
    refetch,
  } = useQuery('userList', () => requests.getAllUsers(userListFilter))
  const {
    data: shopList,
    isLoading: shopListLoading,
    isFetching: isFetchingshopList,
    refetch: refetchshopsList,
  } = useQuery(['shopList', shopListFilter], () => requests.getAllShops(shopListFilter))
  const dispatch = useDispatch()
  const { columns, loading } = useSelector((state) => state.notificationCustomCreate)
  const tableColumns = tableHeaderSelector({ userColumns: columns })
  const tableColumnsShops = tableHeaderSelectorShops()

  useEffect(() => {
    const offsetsCount = Math.ceil(userList?.data?.active / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
    const shopsOffsetsCount = Math.ceil(shopList?.data?.active / Number(values?.limit))
    setshopsOffseCount(shopsOffsetsCount || 0)
  }, [userList?.data, values?.limit, shopList?.data])
  useEffect(() => {
    refetch()
    refetchshopsList()
  }, [userListFilter, shopListFilter])
  useEffect(() => {
    setSelectedRowIds([])
  }, [notificationType])
  return (
    <Box pb={10}>
      <SectionTitle noWrap withLine>
        Кому отправить
      </SectionTitle>
      <Box paddingBottom={'32px'}>
        <Box mt={1} paddingBottom={3}>
          <InputSwitch
            id='notification_types'
            name='notification_types'
            label='Тип отправки'
            defaultValue='all'
            uncontrolled
            onChange={(e) => {
              setNotificationType(e)
            }}
            options={[
              { title: 'Все', value: 'all' },
              { title: 'Клиенты', value: 'clients' },
              {
                title: 'Группы',
                value: 'groups',
              },
              { title: 'Вендоры', value: 'shops' },
            ]}
          />
        </Box>
        <Box>
          {notificationType === 'all' && <Typography>Уведомление будет отправлено всем пользователям.</Typography>}
          {notificationType === 'clients' && (
            <Box>
              <Box width='100%'>
                <InputSearch fullWidth id='search' name='search' placeholder='Введите информацию о клиенте' uncontrolled />
              </Box>
              <AgGridTable
                selection={notificationType === 'clients'}
                addAllProducts={() => setSelectedRowIds(userList?.data?.users?.map((el) => el._id))}
                deleteAllProducts={() => setSelectedRowIds([])}
                selectedRowsIds={selectedRowsIds}
                setAddedItems={(data) => setSelectedRowIds([...selectedRowsIds, data?._id])}
                setRemovedItems={(data) => setSelectedRowIds(selectedRowsIds.filter((el) => el !== data?._id))}
                id='users-main-table'
                tableSettings
                columns={tableColumns}
                data={userList?.data?.users || []}
                isDataLoading={isFetchingUserList || userListLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                isRefreshing={loading || isFetchingUserList || userListLoading}
              />
            </Box>
          )}
          {notificationType === 'shops' && (
            <Box>
              <Box width='100%'>
                <InputSearch fullWidth id='search' name='search' placeholder='Введите информацию о магазине' uncontrolled />
              </Box>
              <AgGridTable
                selection={notificationType === 'shops'}
                addAllProducts={() => setSelectedRowIds(shopList?.data?.shops?.map((el) => el._id))}
                deleteAllProducts={() => setSelectedRowIds([])}
                selectedRowsIds={selectedRowsIds}
                setAddedItems={(data) => setSelectedRowIds([...selectedRowsIds, data?._id])}
                setRemovedItems={(data) => setSelectedRowIds(selectedRowsIds.filter((el) => el !== data?._id))}
                id='shops-main-table'
                tableSettings
                columns={tableColumnsShops}
                data={shopList?.data?.shops || []}
                isDataLoading={isFetchingshopList || shopListLoading}
                offsetCount={shopsOffsetCount}
              />
            </Box>
          )}
          {notificationType === 'groups' && (
            <Box display={'flex'} columnGap={3}>
              {client_groups.map((item) => (
                <ToggleButton
                  values={group}
                  setValues={setGroup}
                  value={item.id}
                  selectedTextColor={'#6BAF96'}
                  selectedbgColor={theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]}
                  bgColor={theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]}
                  textColor={theme.palette.grey[400]}
                >
                  {item.id}
                </ToggleButton>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <SectionTitle noWrap withLine>
        Уведомление
      </SectionTitle>
      <Box display='flex' paddingTop={'16px'} columnGap={3} paddingBottom={'32px'} width='100%'>
        <Box display={'flex'} width={'50%'} gap={2}>
          <ImageUpload
            id='images'
            name='images_ru'
            onChange={(imagesArr) => setValue('images_ru', imagesArr)}
            withoutTextBox
            height={226}
            label={'Фото (RU)'}
          />

          <Box display={'flex'} flexDirection={'column'} width='100%' gap={2}>
            <TextField
              required
              fullWidth
              name='notification_name_ru'
              label='Название уведомления (RU)'
              placeholder='Введите название уведомления'
              value={watch('notification_name_ru')}
              setValue={setValue}
            />
            <TextField
              required
              multiline
              fullWidth
              name='description_ru'
              label='Описание (RU)'
              placeholder='Введите описание'
              value={watch('description_ru')}
              setValue={setValue}
            />
          </Box>
        </Box>
        <Box display={'flex'} width={'50%'} gap={2}>
          <ImageUpload
            id='images'
            name='images_uz'
            onChange={(imagesArr) => setValue('images_uz', imagesArr)}
            withoutTextBox
            height={226}
            label={'Фото (UZ)'}
          />
          <Box display={'flex'} flexDirection={'column'} width='100%' gap={2}>
            <TextField
              required
              fullWidth
              name='notification_name_uz'
              label='Название уведомления (UZ)'
              placeholder='Введите название уведомления'
              value={watch('notification_name_uz')}
              setValue={setValue}
            />
            <TextField
              required
              multiline
              fullWidth
              name='description_uz'
              label='Описание (UZ)'
              placeholder='Введите описание'
              value={watch('description_uz')}
              setValue={setValue}
            />
          </Box>
        </Box>
      </Box>
      <SectionTitle noWrap withLine>
        Время
      </SectionTitle>
      <Box>
        <InputSwitch
          id='notification_time_language'
          name='notification_time_language'
          noLabel
          defaultValue='now'
          uncontrolled
          onChange={(e) => {
            setTimeSelect(e)
          }}
          options={[
            { title: 'Сейчас', value: 'now' },
            { title: 'Выбрать дату', value: 'exact_time' },
          ]}
        />
        {timeSelect === 'exact_time' && (
          <Box>
            <Typography paddingTop={2} color={'red.500'}>
              Временно не работает
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={2} paddingTop={3}>
              <Box>
                <InputDatePicker
                  required
                  placeholder={'Выберите дату'}
                  minDate={Date.now()}
                  name='notification_push_date'
                  id='notification_push_date'
                  disabled={true}
                  noMarginTop
                  defaultValue={new Date()}
                />
              </Box>
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <TextField
                  name='notification_push_hour'
                  id='notification_push_hour'
                  inputRef={H_number_ref}
                  disabled={true}
                  centerMode
                  uncontrolled
                  required
                  fullWidth
                  defaultValue={'00'}
                />
                <Typography>:</Typography>
                <TextField
                  name='notification_push_minute'
                  id='notification_push_minute'
                  inputRef={M_number_ref}
                  disabled={true}
                  centerMode
                  uncontrolled
                  required
                  fullWidth
                  defaultValue={'00'}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
