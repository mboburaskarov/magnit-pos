import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormProvider, useForm } from 'react-hook-form'
import LoadingContainer from '/components/LoadingContainer'
import BrandLogo from '../../assets/icons/BrandLogo'
import InputPassword from '/components/Inputs/InputPassword'
import EmailInput from '../../../components/Inputs/EmailInput'
import CheckBox from '../../../components/Inputs/CheckBox'
import { countries } from '../../assets/data/countries'
import { useMutation } from 'react-query'
import { requests } from '../../../utils/requests'
import { LoadingButton } from '@mui/lab'
import { error } from '../../../utils/toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../redux-toolkit/userSlice'
import { fetchToken } from '../../firebase'
import PhoneNumber from '../../../components/Inputs/PhoneNumber'
import LoginBg from '../../assets/icons/loginBg'
// import { request } from '../../../utils/axios'

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
      border: '1px solid',
    },
    '& .MuiInputBase-root': {
      border: '1px solid',
    },
  },
  description: {
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '24px',
    color: theme.palette.grey[500],
    fontFamily: theme.fontFamily.LeagueSpartan,
  },
  bgContainer: {
    // width: "100%",
    display: 'flex',
    justifyContent: 'end',
    backgroundColor: theme.palette.orange[100],
    padding: '93px 0 93px 130px',
    height: '100%',
    alignItems: 'center',
    borderRadius: '30px',
    '& img': {
      // width: "100%",
    },
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    // width: 504,
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
      paddingTop: '23px',
    },
  },
  title: {
    marginBottom: 5,
    marginTop: 40,
    fontSize: 36,
    fontWeight: 600,
    lineHeight: '42px',
    color: theme.palette.black,
    fontFamily: theme.fontFamily.LeagueSpartan,
  },
  link: {
    fontSize: 16,
    fontWeight: 400,
    fontWeight: '22px',
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
  const { mutate: logIn, isLoading: logInLoading } = useMutation(requests.logIn2, {
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
        <Box className={classes.bgContainer} sx={{ height: 'auto', width: '55%' }}>
          <LoginBg />
        </Box>
        <Box className={classes.container} sx={{ height: 686, width: '45%' }}>
          <FormProvider {...methods}>
            <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <BrandLogo />
              <h1 className={classes.title}>Welcome 👋</h1>
              <h4 className={classes.description}>Please login here </h4>
              <Box width='100%'>
                {/* <Box display="flex" justifyContent="space-between">
            <Typography>Номер телефона</Typography>
          </Box> */}
                <Box minWidth={'445px'}>
                  <PhoneNumber
                    fullWidth
                    name='phone_number'
                    placeholder='Введите номер телефона'
                    secondary
                    required
                    country={country}
                    setCountry={setCountry}
                  />
                  {/* <EmailInput dashed disabled fullWidth name='phone_number' placeholder='Введите номер телефона' secondary label={'Email Address'} required /> */}
                </Box>
                <Box sx={{ marginTop: '20px' }}>
                  {/* <Box display="flex" justifyContent="space-between">
                  <Typography>Пароль</Typography>
                </Box> */}
                  <InputPassword id='password' name='password' label={'Password'} autoCompleteOff required fullWidth minLength={8} secondary />
                </Box>
              </Box>
              {/* <Box display={'flex'} alignItems={'center'} sx={{ marginTop: '16px', paddingRight: '23px' }} justifyContent={'space-between'}>
                <CheckBox />
                <Link className={classes.link}>Forgot Password?</Link>
              </Box> */}
              <Box width='100%' mt={4}>
                <LoadingButton variant='contained' size='large' type='submit' fullWidth onClick={onSubmit} id='login-button'>
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
