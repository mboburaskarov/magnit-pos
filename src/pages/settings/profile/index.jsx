import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { get, size } from 'lodash'
import React, { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import CheckAccess from '@components/CheckAccess'
import TextField from '@components/Inputs/TextField'
import Label from '@components/Label'
import ImageUpload from '@components/ProfileImageUpload'
import SelectSimple from '@components/Select/SelectSimple'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import LockIcon from '@icons/LockIcon'
import i18n from '@/i18n'
import { setUserData } from '@/redux-toolkit/userSlice'
import ChangePassWordDialog from './changePasswordDialog'

const LANGUAGE_OPTIONS = [
  { name: "O'zbekcha", value: 'uz' },
  { name: 'Русский', value: 'ru' },
]

const THEME_OPTIONS = [
  { name: 'Auto', value: 'auto' },
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
]

const getSelectDefaultValue = (options, value) => {
  return options.find((option) => option.value === value) || options[0]
}

const Profile = () => {
  const userData = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const userTheme = localStorage.getItem('user_theme')
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [lang, setlang] = useState('uz')
  const [isEditMode, setIsEditMode] = useState(false)
  const methods = useForm({
    defaultValues: {
      first_name: get(userData, 'first_name'),
      last_name: get(userData, 'last_name'),
      position: get(userData, 'position'),
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

    if (userTheme !== data?.theme?.value) {
      localStorage.setItem('user_theme', data?.theme?.value || 'auto')
      navigate(`/settings/profile?theme_changed=${data?.theme?.value}`)
    }

    if (get(data, 'language')?.value && i18n.language !== get(data, 'language').value) {
      i18n.changeLanguage(get(data, 'language').value)
    }

    const requestBody = {
      first_name: get(data, 'first_name'),
      position: get(data, 'position'),
      last_name: get(data, 'last_name'),
      photo: get(data, 'photo.key', get(data, 'photo')),
      language: get(data, 'language')?.value,
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
        <Box width='calc(100% - 360px)'>
          <Box height={'24px'} />

          <Typography variant='h4' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} mb={'10px'}>
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

          <Box display='flex' gap={3} mt={3} mb={'20px'}>
            <Box flex={1}>
              <Label>Имя</Label>
              <TextField disabled={!isEditMode} required fullWidth name='first_name' placeholder='Enter first name' />
            </Box>

            <Box flex={1}>
              <Label>Фамилия</Label>
              <TextField disabled={!isEditMode} required fullWidth name='last_name' placeholder='Enter last name' />
            </Box>
          </Box>
          <CheckAccess id={'profile-update-position'}>
            <Box flex={1} mb={7}>
              <Label>Позиция</Label>
              <TextField disabled={!isEditMode} required fullWidth name='position' placeholder='Enter Позиция' />
            </Box>
          </CheckAccess>
          <CheckAccess id={'profile-update-password'}>
            <Typography variant='h5' fontWeight={700} mb={3}>
              Безопасность
            </Typography>

            <Button
              fullWidth
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
          </CheckAccess>

          <Typography variant='h5' fontWeight={700} mt={7} mb={3}>
            Интерфейс
          </Typography>

          <Box display='flex' gap={3}>
            <Box flex={1}>
              <Label>Язык</Label>
              <SelectSimple
                uncontrolled
                onChange={(e) => {
                  if (get(e, 'value', 'ru') && i18n.language !== get(e, 'value', 'ru')) {
                    i18n.changeLanguage(get(e, 'value', 'ru'))
                  }
                  setlang(get(e, 'value', 'ru'))
                }}
                value={getSelectDefaultValue(LANGUAGE_OPTIONS, lang)}
                white
                isClearable={false}
                defaultValue={languageDefaultValue}
                options={LANGUAGE_OPTIONS}
                name='language'
              />
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
