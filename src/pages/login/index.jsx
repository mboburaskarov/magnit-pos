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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [country, setCountry] = useState(countries[0])
  const [fcmToken, setFcmToken] = useState(null)
  useEffect(() => {
    fetch('https://hf-api-gw.humans.uz/ftuz/api/v1/msisdns/retail/available', {
      headers: {
        accept: '*/*',

        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-humans-avatar-type': 'WEB',
        'x-humans-host': 'im',
        'x-humans-locale': 'en-US',
        'x-humans-name': 'unknown',
        'x-humans-session-token':
          'iLBo2FkfP5Hr9EjLNXhWGzHVLD1T7Q5spBIETnZHsXBGMVd4nYzg9_CzkrLHK8Qgn5MAm_nH_RzH-_lD98B4nIMxZrOrNUBPWPG_qEPgOnh-kjPRAf6JzYv8ih0v-ABvO3WzBK_s159_BiKm3fMVSg7W2E9wkuehtb4PXhXX01G4ibTC2GlcomKBOnTs8AWFEtnyH-fEkJygaDZiZ4mcnEPJ15kxzHhKmbJ5R7nfs5_PlBXNpEZ-nztzcpI077ZWEsJIC67izVW1Cn3v2XyotGxuKrs6ErkK8Kc_-iXOzzIOaL51zctrJP7DhP9yjfQONQ1ErfgYPYkVmTsY4X-VKHrLKJ--XoZCiPDOxdz5C_qb6Z-fxR7JEO2_TLmowmmcEXe8jVjGhtQfCd3F-q5iIgMJ6uW_Lfhouvg73M0gp0BRa_ZtlqskKqGRqjaxLnguV_N7Kx3tCPsxB_EqeigDVOnYndppci6gZyOz3vZYFiTI2mwjrfKpNEhXmQz4wv7ph2DNee80ssbO1pJPezKAXTnsniBTW_Nw-A3K0D8yeqYh0XLfw4Sx59WsLQAXZtuzJlkqTULIxgfO1vEgJTOsudpej2w4cn3Oa5j0LFQh_XriQlMIo42V30pTThiJIlzZu8VWOI5W8WLj7BPOm7xjjectWhMS',
        'x-humans-trace': 'df73256e7a91842e:df73256e7a91842e:0:1',
        'x-user-agent': 'net.humans.fintech_uz.web/1.2.525 // wretch/1.7.4',
        Referer: 'https://humans.uz/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: '{"salesChannel":"WEB_AUTH","bookingResourceId":"019454d6-13d0-f8ef-ad8b-a51241f27ecc","bookingResourceIdType":"SESSION_ID","poolNumberRegion":"1726","isPhantom":false,"msisdnPattern":"_0_0100","prefix":"99833"}',
      method: 'POST',
    })
    fetchToken(setFcmToken)
    return
  }, [])
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
