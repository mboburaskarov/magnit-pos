import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import PhoneNumber from '../../../components/Inputs/PhoneNumber'
import { requests } from '../../../utils/requests'
import { error } from '../../../utils/toast'
import { countries } from '../../assets/data/countries'
import BrandLogo from '../../assets/icons/BrandLogo'
import LoginBg from '../../assets/icons/loginBg'
import { setUserData } from '../../redux-toolkit/userSlice'
import InputPassword from '/components/Inputs/InputPassword'
import LoadingContainer from '/components/LoadingContainer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '100vh',
    minWidth: '1300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 100px 30px 30px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      border: '1px solid ',
    },
    '& .MuiInputBase-root': {
      border: `1px solid ${theme.palette.bunker[100]} `,
    },
  },
  description: {
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '24px',
    color: theme.palette.gray[500],
    fontFamily: theme.fontFamily.Gilroy,
  },
  bgContainer: {
    display: 'flex',
    justifyContent: 'end',
    backgroundColor: theme.palette.orange[100],
    padding: '93px 0 93px 130px',
    height: '100%',
    alignItems: 'center',
    borderRadius: '30px',
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    height: 'auto',
    borderRadius: 32,
    paddingLeft: 50,
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > div': {
      width: '100%',
      transition: 'all 0.3s ease-in-out',
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '18px',
    },
  },
  title: {
    marginBottom: 5,
    marginTop: 40,
    fontSize: 36,
    fontWeight: 600,
    lineHeight: '42px',
    color: theme.palette.black,
    fontFamily: theme.fontFamily.Gilroy,
  },
  link: {
    fontSize: 16,
    fontWeight: 400,
  },
}))

export default function LoginPage() {
  const classes = useStyles()
  const methods = useForm()
  const dispatch = useDispatch()
  const [country, setCountry] = useState(countries[0])

  const { mutate: logIn, isLoading: logInLoading } = useMutation(requests.logIn, {
    onSuccess: async ({ data }) => {
      const userData = data.data
      localStorage.setItem('access_token', userData.token)
      localStorage.setItem('user_data', JSON.stringify(userData.employee))
      dispatch(setUserData(userData?.employee))
      setTimeout(() => {
        window.location.replace('/redirect')
      }, 300)
    },
    onError: (err) => {
      error('Hеверный логин или пароль')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    if ((data?.phone_number?.replace(/[X() ]/g, '')?.replaceAll('x', '')?.length || 0) < country?.mask?.replace(/[X() ]/g, '')?.length) {
      methods.setError('phone_number', { type: 'required', message: '' })
      methods.setFocus('phone_number')
      return
    }

    data.phone_number = country.dial_code + data.phone_number.replace(/[X() ]/g, '')
    data.password = data.password.replace(/[()\s-]/g, "")
    logIn({ phone: data.phone_number, password: data.password })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля')
    console.error('err', err)
  }

  return (
    <LoadingContainer boxStyle={{ height: '100%' }} readyState={!false}>
      <Box className={classes.root}>
        <Box className={classes.bgContainer} sx={{ height: 'auto', width: '55%' }}>
          <LoginBg />
        </Box>
        <Box className={classes.container} sx={{ height: 686, width: '45%' }}>
          <FormProvider {...methods}>
            <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <BrandLogo />
              <h1 className={classes.title}>Добро пожаловать 👋</h1>
              <h4 className={classes.description}>Пожалуйста, войдите сюда</h4>
              <Box width='100%'>
                <Box minWidth={'445px'}>
                  <PhoneNumber
                    fullWidth
                    name='phone_number'
                    placeholder='Введите номер телефона'
                    secondary
                    required
                    login={false}
                    country={country}
                    setCountry={setCountry}
                  />
                </Box>
                <Box sx={{ marginTop: '20px' }}>
                  <InputPassword id='password' name='password' label={'Password'} autoCompleteOff required fullWidth minLength={8} secondary />
                </Box>
              </Box>

              <Box width='100%' mt={4}>
                <LoadingButton variant='contained' size='large' type='submit' fullWidth loading={logInLoading} onClick={onSubmit} id='login-button'>
                  Login
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Box>
    </LoadingContainer>
  )
}
