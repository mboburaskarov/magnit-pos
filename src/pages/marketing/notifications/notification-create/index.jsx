import { Box, Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import NotificationCreateBody from './NotificationCreateBody'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import Header from '../../../../../components/Header'
import { useNavigate } from 'react-router-dom'

export default function NotificationCreatePage() {
  const methods = useForm()
  const [notificationType, setNotificationType] = useState('all')
  const [group, setGroup] = useState('')
  const [selectedRowsIds, setSelectedRowIds] = useState([])
  const [notificationLanguage, setNotificationLanguage] = useState('uz')
  const [timeSelect, setTimeSelect] = useState('now')
  const navigate = useNavigate()
  const { mutate } = useMutation(requests.createNotification, {
    onSuccess: () => {
      navigate('/marketing/notifications')
      success('Уведомление успешно создано!!')
    },
    onError: (err) => {
      error('Ошибка при создании уведомления!')
      console.log('err', err)
    },
  })
  const notificationBody = {
    notificationType,
    setNotificationType,
    group,
    setGroup,
    notificationLanguage,
    setNotificationLanguage,
    timeSelect,
    setTimeSelect,
    selectedRowsIds,
    setSelectedRowIds,
  }
  const handleCreateNotification = (data) => {
    if (notificationType === 'all') {
      mutate({
        type: 'NEWS',
        userType: 'USER',
        headerUz: data?.notification_name_uz,
        headerRu: data?.notification_name_ru,
        headerEn: data?.notification_name_uz,
        summaryUz: data?.description_uz,
        summaryRu: data?.description_ru,
        summaryEn: data?.description_uz,
        imageUz: data?.images_uz[0]?.key,
        imageRu: data?.images_ru[0]?.key,
        imageEn: data?.images_uz[0]?.key,
      })
      mutate({
        type: 'NEWS',
        userType: 'NOT_REGISTER',
        headerUz: data?.notification_name_uz,
        headerRu: data?.notification_name_ru,
        headerEn: data?.notification_name_uz,
        summaryUz: data?.description_uz,
        summaryRu: data?.description_ru,
        summaryEn: data?.description_uz,
        imageUz: data?.images_uz[0]?.key,
        imageRu: data?.images_ru[0]?.key,
        imageEn: data?.images_uz[0]?.key,
      })
    } else {
      mutate({
        type: 'NEWS',
        userType: notificationType === 'groups' ? group : 'USER',
        headerUz: data?.notification_name_uz,
        headerRu: data?.notification_name_ru,
        headerEn: data?.notification_name_uz,
        summaryUz: data?.description_uz,
        summaryRu: data?.description_ru,
        summaryEn: data?.description_uz,
        imageUz: data?.images_uz[0]?.key,
        imageRu: data?.images_ru[0]?.key,
        imageEn: data?.images_uz[0]?.key,
        userIds: notificationType === 'clients' ? selectedRowsIds : undefined,
        dbIds: notificationType === 'shops' ? selectedRowsIds : undefined,
      })
    }
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <Box>
      <Header
        buttonText={'Создать'}
        onSubmit={methods.handleSubmit(handleCreateNotification, onError)}
        backIcon
        backHref='/marketing/notifications'
        text={'Уведомления'}
        checkAccessId={'notification-create'}
      />
      <Container>
        <FormProvider {...methods}>
          <NotificationCreateBody notificationBody={notificationBody} />
        </FormProvider>
      </Container>
    </Box>
  )
}
