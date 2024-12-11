import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import UploadImage from '../../../../components/UploadImage'
import TextField from '../../../../components/Inputs/TextField'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import Label from '../../../../components/Label'
import ImageUpload from '../../../../components/ProfileImageUpload'
import LockIcon from '../../../assets/icons/LockIcon'
import ChangePassWordDialog from './changePasswordDialog'
import { LoadingButton } from '@mui/lab'
import { error, success } from '../../../../utils/toast'
import { get, size } from 'lodash'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../../redux-toolkit/userSlice'
import i18n from '../../../i18n'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const userData = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const userTheme = localStorage.getItem('user_theme')
  const navigate = useNavigate()

  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const methods = useForm()
  const { mutate: changeEmployeeInfo } = useMutation(requests.changeEmployeeInfo, {
    onSuccess: ({ data }) => {
      dispatch(setUserData({ ...data?.data }))
      console.log(data)

      success('Заказ успешно передан оператору!')
      // setOpen(false)
      // resetField('nafirst_nameme')
      // methods.setValue('first_name', data?.data?.first_name)
      // methods.reset({ ...data?.data, language: { name: 'frf', value: data?.data?.language } })
      // navigate(`/products${requestParams}`)
      // refetch()
    },
    onError: (err) => {
      error('Ошибка при назначении заказа оператору!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    console.log(data)

    if (!size(get(data, 'photo'))) {
      return error('rasm!')
    }
    if (userTheme !== data?.theme?.value) {
      localStorage.setItem('user_theme', data?.theme?.value || 'auto')
      navigate(`/settings/profile?theme_changed=${data?.theme?.value}`)
    }
    if (get(data, 'language').value) {
      if (i18n.language !== get(data, 'language').value) {
        i18n.changeLanguage(get(data, 'language').value)
      }
    }

    const requestBody = {
      first_name: get(data, 'first_name'),
      last_name: get(data, 'last_name'),
      photo: get(data, 'photo.key', get(data, 'photo')),
      language: get(data, 'language').value,
    }
    changeEmployeeInfo(requestBody)
    // console.log(requestBody)
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <FormProvider {...methods}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Box width={'716px'}>
          <Box height={'24px'} />
          <Typography mb='24px' lineHeight={'40px'} fontSize={'28px'} fontWeight={'700'}>
            Profile
          </Typography>
          <ImageUpload
            width={80}
            withoutTextBox
            height={80}
            images={{ key: get(userData, 'photo'), value: get(userData, 'photo') }}
            onChange={(images) => methods.setValue('photo', images)}
            name={'photo'}
            label={' '}
            type={'BANNER'}
          />
          <Box display={'flex'} mb={'56px'} mt={'24px'}>
            <Box width={'100%'}>
              <Label mb='4px'>Ism</Label>
              <TextField defaultValue={get(userData, 'first_name')} required fullWidth name='first_name' id='first_name' placeholder='Fikr kiriting' />
            </Box>
            <Box width={'24px'} />
            <Box width={'100%'}>
              <Label mb='4px'>Familiya</Label>

              <TextField defaultValue={get(userData, 'last_name')} required fullWidth name='last_name' id='last_name' placeholder='Fikr kiriting' />
            </Box>
          </Box>

          <Typography mb='24px' lineHeight={'40px'} fontSize={'28px'} fontWeight={'700'}>
            Xavfsizlik
          </Typography>
          <Button
            onClick={() => setOpen(true)}
            sx={{
              width: '100%',
              border: '2px solid',
              borderColor: 'bunker.100',
              height: '48px',
            }}
            variant='secondary'
          >
            <LockIcon />
            <Typography ml={'12px'} lineHeight={'24px'} fontSize={'14px'} fontWeight={'600'}>
              Parolni o'zgartirish
            </Typography>
          </Button>
          <Typography mt={'56px'} mb='24px' lineHeight={'40px'} fontSize={'28px'} fontWeight={'700'}>
            Interfeys
          </Typography>
          <Box display={'flex'}>
            <Box width={'100%'}>
              <Label mb='4px'>Til</Label>
              <SelectSimple
                white
                isClearable={false}
                onChange={() => {}}
                defaultValue={i18n.language == 'uz' ? { name: "O'zbekch", value: 'uz' } : { name: 'Ruscha', value: 'ru' }}
                options={[
                  { name: "O'zbekch", value: 'uz' },
                  { name: 'Ruscha', value: 'ru' },
                ]}
                required
                placeholder='Kassirni tanlang'
                name={'language'}
              />
            </Box>
            <Box width={'24px'} />

            <Box width={'100%'}>
              <Label mb='4px'>Mavzu</Label>
              <SelectSimple
                isClearable={false}
                white
                onChange={() => {}}
                defaultValue={
                  userTheme == 'dark'
                    ? { name: 'Dark', value: 'dark' }
                    : userTheme == 'light'
                    ? { name: 'Light', value: 'light' }
                    : { name: 'Auto', value: 'auto' }
                }
                options={[
                  { name: 'Auto', value: 'auto' },
                  { name: 'Dark', value: 'dark' },
                  { name: 'Light', value: 'light' },
                ]}
                required
                placeholder='Kassirni tanlang'
                name={'theme'}
              />
            </Box>
          </Box>
          <LoadingButton
            sx={{ margin: '50px 0 0 auto' }}
            variant='contained'
            type='submit'
            // disabled={!isDirty}
            onClick={methods.handleSubmit(onSubmit, onError)}
          >
            Saqlash
          </LoadingButton>
        </Box>
      </Box>

      <ChangePassWordDialog open={open} setOpen={setOpen} />
    </FormProvider>
  )
}

export default Profile
