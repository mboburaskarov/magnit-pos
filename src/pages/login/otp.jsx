import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormProvider, useForm } from 'react-hook-form'
import LoadingContainer from '/components/LoadingContainer'
import BrandLogo from '../../assets/icons/BrandLogo'
import EmailInput from '../../../components/input/EmailInput'
import InputPassword from '../../../components/input/InputPassword'
import CheckBox from '../../../components/input/CheckBox'
import { Link } from 'react-router-dom'
// // import { error } from "../../../utils/toast";

import { LoadingButton } from '@mui/lab'
import ArrowLeft from '../../assets/icons/BrandLogo copy'
import { NumberFormatBase, NumericFormat, PatternFormat } from 'react-number-format'
// // import { useNavigate } from "react-router-dom";

// // import { request } from '../../../utils/axios'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: theme.palette.background.default,
    padding: '93px 0 93px 130px',
    height: 'auto',
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
    fontWeight: 24,
  },
}))

export default function OTPPage() {
  const classes = useStyles()
  const methods = useForm()
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  //   const [country, setCountry] = useState(countries[0]);
  //   const [fcmToken, setFcmToken] = useState(null);
  useEffect(() => {
    // fetchToken(setFcmToken);
    localStorage.clear()
    return
  }, [])
  //   const { mutate: logIn, isLoading: logInLoading } = useMutation(
  //     requests.logIn,
  //     {
  //       onSuccess: async ({ data }) => {
  //         localStorage.setItem("access_token", data.token);
  //         localStorage.setItem("user_data", JSON.stringify(data.user));
  //         dispatch(setUserData(data?.user));
  //         navigate("/redirect");
  //       },
  //       onError: (err) => {
  //         error("Hеверный логин или пароль");
  //         console.log("err", err);
  //       },
  //     }
  //   );

  const onSubmit = (data) => {
    // if (
    //   (data?.phone_number?.replace(/[X() ]/g, "")?.replaceAll("x", "")
    //     ?.length || 0) < country?.mask?.replace(/[X() ]/g, "")?.length
    // ) {
    //   methods.setError("phone_number", { type: "required", message: "" });
    //   methods.setFocus("phone_number");
    //   return;
    // }
    // data.phone_number =
    //   country.dial_code + data.phone_number.replace(/[X() ]/g, "");
    // logIn({ phone: data.phone_number, password: data.password, fcmToken });
  }

  const onError = (err) => {
    // error("Пожалуйста, заполните все поля");
    console.log('err', err)
  }

  return (
    <LoadingContainer boxStyle={{ height: '100%' }} readyState={!false}>
      <Box className={classes.root}>
        <Box className={classes.bgContainer} sx={{ height: 'auto' }}>
          <img src='../login-bg.jpg' />
        </Box>
        <Box className={classes.container} sx={{ height: 686 }}>
          <FormProvider {...methods}>
            <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              {/* <BrandLogo />*/}
              <Box display={'flex'} alignItems={'center'}>
                <ArrowLeft />
                <Typography ml={'5px'}>Back</Typography>
              </Box>
              <h1 className={classes.title}>Forgot Password</h1>
              <h4 className={classes.description}>Enter your registered email address. we’ll send you a code to reset your password. </h4>
              <Box width='100%'>
                {/* <Box display="flex" justifyContent="space-between">
              <Typography>Номер телефона</Typography>
            </Box> */}
                {/* <Box>
                  <PatternFormat
                    onChange={(e) => () => {}}
                    className="number-input"
                    format="#  #  #  #  #"
                    mask="_"
                    allowEmptyFormatting={true}
                  />
                </Box> */}
                <NumericFormat
                  format='#####'
                  name='ded'
                  allowEmptyFormatting
                  onValueChange={(values) => console.log(values.value)} // To capture value
                  renderText={(value, props) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid orange',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1.5rem',
                            color: '#000',
                          }}
                        >
                          {value[index] || ''}
                        </Box>
                      ))}
                    </Box>
                  )}
                />
              </Box>

              <Box width='100%' mt={4}>
                <LoadingButton variant='contained' size='large' type='submit' fullWidth onClick={onSubmit} id='login-button'>
                  Send OTP
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Box>
    </LoadingContainer>
  )
}
