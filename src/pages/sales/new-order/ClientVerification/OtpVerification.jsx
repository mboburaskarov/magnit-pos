import { useCallback, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import requests from './SendCode'
import useWebsocketMutation from './SendCode'
import InputOTP from '../../../../../components/Inputs/SearchInput'
import ArrowBackIcon from '../../../../assets/icons/BackArrow'
import syncCartWithDatabase from './SelectType'
import { useTranslation, Trans } from 'react-i18next'
import { useStyles } from './useStyles'
import { useParams } from 'react-router-dom'
import { formatPhoneNumber } from '../../../../../utils/formatPhoneNumber'
import { error } from '../../../../../utils/toast'
import Timer from '../../../../../components/TimeCountdown'

const OtpVerification = ({ step, setStep, clientInfo, verificationData, closeDrawer, setClientInfo }) => {
  const classes = useStyles()
  const { id } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { forbiddenRoutes } = useSelector((state) => state?.permissionRoutes)
  const orderApiToHttps = forbiddenRoutes?.find((el) => el?.slug === 'order-api-to-http')?.slug
  const [seconds, setSeconds] = useState(60)
  const { getValues, control, formState, watch, setError, setValue, clearErrors } = useFormContext()

  const notifyError = useCallback(() => {
    setError('otp', {
      type: 'validate',
      message: 'not valid code',
    })
    error('menu.register.wrongCode')
  }, [])

  const { mutate: addClient, isLoading } = useWebsocketMutation(requests.order.addCustomer, {
    onWebsocketSuccess: (message) => {
      dispatch(syncCartWithDatabase(message?.data))
      closeDrawer()
      setClientInfo(clientInfo)
    },
    onWebsocketError: () => notifyError(),
  })

  const { mutate: addClientHttps, isLoading: isLoadingHttps } = useWebsocketMutation(requests.order.addCustomerHttps, {
    onSuccess: (message) => {
      dispatch(syncCartWithDatabase(message?.data))
      closeDrawer()
      setClientInfo(clientInfo)
    },
    onError: () => notifyError(),
  })

  const onSubmit = (data) => {
    const requestBody = {
      id,
      data: {
        customer_id: clientInfo?.id,
        check_auth_code: true,
        user_have_auth_role: true,
        auth_code: data?.otp,
        auth_code_id: verificationData?.auth_code_id,
        auth_type: 'WITH_SMS',
      },
    }

    orderApiToHttps ? addClientHttps(requestBody) : addClient(requestBody)
  }

  const { mutate: sendCode } = useWebsocketMutation(requests.order.sendCode, {
    onWebsocketSuccess: () => {
      setSeconds(60)
    },
    onWebsocketError: () => error('menu.sales.toast.error.message'),
  })

  const resend = () => {
    clearErrors('otp')
    setValue('otp', '')
    sendCode({
      id,
      body: {
        customer_id: clientInfo?.id,
        phone_number: watch('phone_number')?.name,
        auth_code_id: verificationData?.auth_code_id,
      },
    })
  }

  return (
    <Box hidden={step !== 'otp'}>
      <Box width='100%' display='flex' alignItems='center' mb={8}>
        <Box
          id='close-drawer'
          onClick={() => {
            clearErrors('otp')
            setValue('otp', '')
            setStep('code')
          }}
        >
          <ArrowBackIcon />
        </Box>
        <Box ml={2}>
          <Typography variant='h1' className={classes.title}>
            {t('titles.verification')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.changeNumber}>
        <Typography variant='h5'>
          {t('menu.register.enterCodeDesc', {
            phone: formatPhoneNumber(watch('phone_number')?.name || ''),
          })}
        </Typography>
        &nbsp;
        <button type='button' className={classes.link} onClick={() => setStep('code')}>
          {t('menu.login.changePhone')}
        </button>
      </Box>
      <Box my={4}>
        <InputOTP
          name='otp'
          control={control}
          error={!!formState?.errors?.otp?.message}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(getValues())}
          width={50}
          height={56}
          marginRight={4}
        />
      </Box>
      <Box mb={8} className={classes.sendAgain}>
        {seconds <= 0 ? (
          <Typography
            variant='h5'
            sx={(theme) => ({
              color: `${theme.palette.gray[600]} !important`,
            })}
          >
            <Trans
              i18nKey='menu.register.resendCode'
              components={{
                b: <mark onClick={resend} />,
              }}
            />
            &nbsp;
          </Typography>
        ) : (
          <Typography variant='h6'>
            <Trans
              i18nKey='menu.register.didntGetCodeResend'
              components={{
                b: <br />,
              }}
            />
            &nbsp;
            <Timer count={seconds} setCount={setSeconds} />
            &nbsp;{t('menu.login.second')}
          </Typography>
        )}
      </Box>
      <Box className={classes.actions}>
        <Button primary fullWidth onClick={() => onSubmit(getValues())} isLoading={isLoading || isLoadingHttps}>
          {t('dashboard.next')}
        </Button>
      </Box>
    </Box>
  )
}

export default OtpVerification
