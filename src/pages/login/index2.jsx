import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormProvider, useForm } from 'react-hook-form'
import LoadingContainer from '/components/LoadingContainer'
import BrandLogo from '../../assets/icons/BrandLogo'
import InputPassword from '/components/Inputs/InputPassword'
import PhoneNumber from '../../../components/Inputs/PhoneNumber'
import { countries } from '../../assets/data/countries'
import { useMutation } from 'react-query'
import { requests } from '../../../utils/requests'
import { LoadingButton } from '@mui/lab'
import { error } from '../../../utils/toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../redux-toolkit/userSlice'
import { fetchToken } from '../../firebase'
// import { request } from '../../../utils/axios'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.defaultStrong,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.palette.background.default,
    width: 504,
    height: 'auto',
    borderRadius: 32,
    padding: '64px 72px',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > div': {
      width: '100%',
      transition: 'all 0.3s ease-in-out',
    },
  },
  title: {
    marginBottom: 32,
    marginTop: 24,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: '42px',
    color: theme.palette.black,
    fontFamily: theme.fontFamily.VelaSans,
  },
}))

export default function LoginPage() {
  const classes = useStyles()
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [country, setCountry] = useState(countries[0])
  const [fcmToken, setFcmToken] = useState(null)
  useEffect(() => {
    fetchToken(setFcmToken)
    localStorage.clear()
    return
  }, [])
  const { mutate: logIn, isLoading: logInLoading } = useMutation(requests.logIn, {
    onSuccess: async ({ data }) => {
      localStorage.setItem('access_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      dispatch(setUserData(data?.user))
      navigate('/redirect')
    },
    onError: (err) => {
      error('Hеверный логин или пароль')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    if ((data?.phone_number?.replace(/[X() ]/g, '')?.replaceAll('x', '')?.length || 0) < country?.mask?.replace(/[X() ]/g, '')?.length) {
      methods.setError('phone_number', { type: 'required', message: '' })
      methods.setFocus('phone_number')
      return
    }

    data.phone_number = country.dial_code + data.phone_number.replace(/[X() ]/g, '')

    logIn({ phone: data.phone_number, password: data.password, fcmToken })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля')
    console.log('err', err)
  }

  return (
    <LoadingContainer boxStyle={{ height: '100%' }} readyState={!false}>
      <Box className={classes.root}>
        <Box className={classes.container} sx={{ height: 686 }}>
          <FormProvider {...methods}>
            <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <BrandLogo />
              <h1 className={classes.title}>Войти</h1>
              <Box width='100%'>
                <Box display='flex' justifyContent='space-between'>
                  <Typography>Номер телефона</Typography>
                </Box>
                <Box mt={2}>
                  <PhoneNumber
                    fullWidth
                    name='phone_number'
                    placeholder='Введите номер телефона'
                    secondary
                    required
                    country={country}
                    setCountry={setCountry}
                  />
                </Box>
                <Box mt={3}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography>Пароль</Typography>
                  </Box>
                  <InputPassword id='password' name='password' placeholder='Введите пароль' autoCompleteOff required fullWidth minLength={8} secondary />
                </Box>
              </Box>
              <Typography color='grey.400' lineHeight='16px' fontSize={12} mt={2}>
                Вы можете ввести только существующих пользователей, для создания аккаунта пользователя свяжитесь с менеджерами
              </Typography>
              <Box width='100%' mt={4}>
                <LoadingButton variant='contained' size='large' type='submit' fullWidth onClick={onSubmit} loading={logInLoading} id='login-button'>
                  Войти
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Box>
    </LoadingContainer>
  )
}
