import React, { useState, useMemo } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { get, size } from 'lodash'
import { LoadingButton } from '@mui/lab'

import UploadImage from '../../../../components/UploadImage'
import TextField from '../../../../components/Inputs/TextField'
import SelectSimple from '../../../../components/Select/SelectSimple'
import Label from '../../../../components/Label'
import ImageUpload from '../../../../components/ProfileImageUpload'
import ChangePassWordDialog from './changePasswordDialog'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { setUserData } from '../../../redux-toolkit/userSlice'
import i18n from '../../../i18n'
import LockIcon from '../../../assets/icons/LockIcon'

// Constants for options
const LANGUAGE_OPTIONS = [
  { name: "O'zbekcha", value: 'uz' },
  { name: 'Русский', value: 'ru' },
]

const THEME_OPTIONS = [
  { name: 'Auto', value: 'auto' },
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
]

// Helper function to get initial value for SelectSimple based on the current value
const getSelectDefaultValue = (options, value) => {
  return options.find((option) => option.value === value) || options[0]
}

const Profile = () => {
  const userData = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const userTheme = localStorage.getItem('user_theme')
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const methods = useForm({
    defaultValues: {
      first_name: get(userData, 'first_name'),
      last_name: get(userData, 'last_name'),
    },
  })

  const { mutate: getUserInfo } = useMutation(requests.getUserInfo, {
    onSuccess: ({ data }) => {
      dispatch(setUserData({ ...data?.data }))
      setIsEditMode(false)
    },
    onError: () => {
      error('Ошибка получения пользовательских данных.!')
    },
  })
  const { mutate: changeEmployeeInfo } = useMutation(requests.changeEmployeeInfo, {
    onSuccess: ({ data }) => {
      getUserInfo()
      setIsEditMode(false)
      success('Информация о пользователе изменена!')
    },
    onError: () => {
      error('Ошибка при изменении пользовательских данных!')
    },
  })

  const handleFormSubmit = (data) => {
    if (!size(get(data, 'photo'))) {
      return error('Загрузить изображение!')
    }

    // Theme handling
    if (userTheme !== data?.theme?.value) {
      localStorage.setItem('user_theme', data?.theme?.value || 'auto')
      navigate(`/settings/profile?theme_changed=${data?.theme?.value}`)
    }

    // Language handling
    if (get(data, 'language')?.value && i18n.language !== get(data, 'language').value) {
      i18n.changeLanguage(get(data, 'language').value)
    }

    const requestBody = {
      first_name: get(data, 'first_name'),
      last_name: get(data, 'last_name'),
      photo: get(data, 'photo.key', get(data, 'photo')),
      language: get(data, 'language').value,
    }

    changeEmployeeInfo(requestBody)
  }

  const handleFormError = () => {
    error('Пожалуйста, заполните все поля!')
  }

  const languageDefaultValue = useMemo(() => getSelectDefaultValue(LANGUAGE_OPTIONS, i18n.language), [i18n.language])
  const themeDefaultValue = useMemo(() => getSelectDefaultValue(THEME_OPTIONS, userTheme), [userTheme])

  return (
    <FormProvider {...methods}>
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Box width='calc(100% - 60px)'>
          <Box height={'24px'} />

          <Typography variant='h4' fontWeight={700} mb={3}>
            Профиль
          </Typography>

          <ImageUpload
            width={80}
            height={80}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            withoutTextBox
            images={{
              key: get(userData, 'photo'),
              value: get(userData, 'photo'),
            }}
            onChange={(images) => methods.setValue('photo', images)}
            name='photo'
            label={' '}
            type='BANNER'
          />

          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Имя</Label>
              <TextField disabled={!isEditMode} required fullWidth name='first_name' placeholder='Enter first name' />
            </Box>

            <Box flex={1}>
              <Label>Фамилия</Label>
              <TextField disabled={!isEditMode} required fullWidth name='last_name' placeholder='Enter last name' />
            </Box>
          </Box>

          <Typography variant='h5' fontWeight={700} mb={3}>
            Безопасность
          </Typography>

          <Button
            fullWidth
            disabled={!isEditMode}
            onClick={() => setOpen(true)}
            sx={{
              width: '100%',
              border: '2px solid',
              borderColor: 'bunker.100',
              height: '48px',
            }}
            variant='primary'
            startIcon={<LockIcon color={!isEditMode && '#ccc'} />}
          >
            Изменить пароль
          </Button>

          <Typography variant='h5' fontWeight={700} mt={7} mb={3}>
            Интерфейс
          </Typography>

          <Box display='flex' gap={3}>
            <Box flex={1}>
              <Label>Язык</Label>
              <SelectSimple disabled={true} white isClearable={false} defaultValue={languageDefaultValue} options={LANGUAGE_OPTIONS} name='language' />
            </Box>

            <Box flex={1}>
              <Label>Тема</Label>
              <SelectSimple disabled={true} white isClearable={false} defaultValue={themeDefaultValue} options={THEME_OPTIONS} name='theme' />
            </Box>
          </Box>
          {isEditMode && (
            <LoadingButton sx={{ mt: 6 }} variant='contained' fullWidth onClick={methods.handleSubmit(handleFormSubmit, handleFormError)}>
              Сохранить
            </LoadingButton>
          )}
        </Box>
      </Box>

      <ChangePassWordDialog open={open} setOpen={setOpen} />
    </FormProvider>
  )
}

export default Profile
