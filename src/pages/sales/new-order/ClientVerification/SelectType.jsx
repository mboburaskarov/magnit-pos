import { Box, Typography, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useStyles } from './useStyles'
import useWebsocketMutation from './OtpVerification'
import requests from './OtpVerification'
import ArrowBackIcon from '../../../../assets/icons/BackArrow'
import UserFilledIcon from '../../../../assets/icons/UserFilledIcon'
import { useParams } from 'react-router-dom'
import { error } from '../../../../../utils/toast'

const Option = ({ icon, title, subTitle, onClick, isLoading }) => {
  const classes = useStyles()
  return (
    <Box className={classes.box} onClick={onClick}>
      {!isLoading && icon}
      {isLoading ? (
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      ) : (
        <Box style={{ marginLeft: 21 }}>
          <Typography className={`${classes.text} ${classes.blue}`}>{title}</Typography>
          <Typography className={classes.text}>{subTitle}</Typography>
        </Box>
      )}
    </Box>
  )
}

const SelectType = ({ step, setStep, clientInfo, closeDrawer, setVerificationData, handleAddClient }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { id } = useParams()

  const { mutate: createCode, isLoading } = useWebsocketMutation(requests.order.createCode, {
    onWebsocketSuccess: ({ data }) => {
      setStep('code')
      setVerificationData({
        auth_code_id: data,
      })
    },
    onWebsocketError: () => error('menu.sales.toast.error.message'),
  })

  const handleSelect = () => {
    createCode({ id, body: { customer_id: clientInfo?.id } })
  }

  return (
    <Box hidden={step !== 'type'}>
      <Box width='100%' display='flex' alignItems='center' mb={4}>
        <Box id='close-drawer' onClick={closeDrawer} height={48}>
          <ArrowBackIcon />
        </Box>
        <Box ml={2}>
          <Typography variant='h1' className={classes.title}>
            {t('menu.sales.shortcuts.add_client')}
          </Typography>
        </Box>
      </Box>
      <Option
        title={t('menu.sales.new.just_add_client')}
        subTitle={t('menu.sales.new.just_add_client_desc')}
        icon={<UserFilledIcon />}
        onClick={() => {
          handleAddClient({
            ...clientInfo,
            check_auth_code: false,
            auth_type: 'WITH_SMS',
          })
          closeDrawer()
        }}
      />
      <Typography className={classes.or}>- {t('menu.settings.profile.or')} -</Typography>
      <Option
        title={t('menu.sales.new.activate_discount')}
        subTitle={t('menu.sales.new.activate_discount_desc')}
        icon={<UserFilledIcon />}
        onClick={handleSelect}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default SelectType
