import { Box, Typography, Button } from '@mui/material'
import SelectSimple from '../../../../../components/Select/SelectSimple'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useStyles } from './useStyles'
import useWebsocketMutation from './SelectType'
import requests from './SelectType'
import { useEffect, useMemo } from 'react'
import ArrowBackIcon from '../../../../assets/icons/BackArrow'
import { useParams } from 'react-router-dom'
import { error } from '../../../../../utils/toast'

const SendCode = ({ step, setStep, clientInfo, verificationData }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { id } = useParams()
  const { control, getValues, reset } = useFormContext()

  const phoneNumbers = useMemo(() => {
    return Array.isArray(clientInfo?.phone_numbers)
      ? clientInfo?.phone_numbers?.map((item) => ({ name: item, id: item }))
      : [{ name: clientInfo?.phone_numbers, id: clientInfo?.phone_numbers }]
  }, [clientInfo?.phone_numbers])

  const { mutate: sendCode, isLoading } = useWebsocketMutation(requests.order.sendCode, {
    onWebsocketSuccess: () => {
      setStep('otp')
    },
    onWebsocketError: () => error('menu.sales.toast.error.message'),
  })

  const onSubmit = (data) => {
    sendCode({
      id,
      body: {
        customer_id: clientInfo?.id,
        phone_number: data?.phone_number?.name,
        auth_code_id: verificationData?.auth_code_id,
      },
    })
  }

  useEffect(() => {
    reset({ phone_number: phoneNumbers[0] })
  }, [phoneNumbers])

  return (
    <Box hidden={step !== 'code'}>
      <Box width='100%' display='flex' alignItems='center' mb={8}>
        <Box id='close-drawer' onClick={() => setStep('type')}>
          <ArrowBackIcon />
        </Box>
        <Box ml={2}>
          <Typography variant='h1' className={classes.title}>
            {t('titles.verification')}
          </Typography>
        </Box>
      </Box>
      <SelectSimple
        label='menu.sales.new.client_verification'
        name='phone_number'
        control={control}
        required
        isClearable={false}
        defaultValue={phoneNumbers[0]}
        options={phoneNumbers}
      />
      <Box className={classes.actions}>
        <Button primary fullWidth isLoading={isLoading} onClick={() => onSubmit(getValues())}>
          {t('buttons.send')}
        </Button>
      </Box>
    </Box>
  )
}

export default SendCode
