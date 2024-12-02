import { useEffect } from 'react'
import { Box, Drawer, Button, Typography } from '@mui/material'
import ArrowBackIcon from '../../../src/assets/icons/ArrowDown'
import { useForm, FormProvider } from 'react-hook-form'
import requests from './mainDetails'
import { error, success } from '../../../utils/toast'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import palette from '../../../src/assets/theme/mui.config'
import useWebsocketMutation from './mainDetails'
import useDidUpdate from '../../../src/hooks/useDidUpdate'
import { useSelector } from 'react-redux'
import GroupsTags from './groupsTags/index'
import MainDetails from './mainDetails'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '60%',
      padding: 64,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Gilroy-Bold, sans-serif',
    fontSize: 36,
    fontWeight: 600,
    color: theme.palette.black,
    lineHeight: '48px',
    marginLeft: 16,
  },
}))

export default function ClientCreateMini({
  quickCreateClientName,
  openDrawer,
  closeDrawer,
  setOpenClientCreate,
  setClientDataMini,
  clientData,
  afterCreate,
  handleAddClient,
}) {
  const { t } = useTranslation()
  const classes = useStyles()
  const methods = useForm()
  const forbiddenRoutes = useSelector((state) => state.permissionRoutes)
  const smsAuthRole = forbiddenRoutes?.find((el) => el?.slug === 'order-assign-client-sms-auth')
  const current_shop_id = useSelector((state) => state.company)

  useEffect(() => {
    methods.register('cards')
    methods.register('groups')
    methods.register('tags')
  }, [])

  useDidUpdate(() => {
    if (clientData) {
      methods.reset(clientData)
    }
  }, [clientData])

  const { mutate, isLoading } = useWebsocketMutation(requests?.customer?.create, {
    onWebsocketSuccess: (res) => {
      success('menu.clients.success_client_add')
      methods.setValue('cards', [])
      closeDrawer()
      if (!smsAuthRole) {
        handleAddClient(res?.data)
      }
      if (afterCreate) {
        afterCreate(res.data.id)
      }
    },
    onWebsocketError: (err) => {
      if (err?.error?.message?.includes('customer with this phone already exists')) {
        error('menu.clients.create.number_duplicate')
        return
      }
      error('menu.clients.error_client_add')
    },
    onError: () => {
      error('menu.clients.error_client_add')
    },
  })

  const onSubmit = (data) => {
    const zeroWrapper = (date) => (date?.length === 1 ? `0${date}` : date)

    const date_of_birth = data?.year && data?.month && data?.day ? `${data?.year}-${zeroWrapper(data?.month)}-${zeroWrapper(data?.day)}` : ''
    const addresses = data?.addresses
      ? data?.addresses.map((item) => ({
          ...item,
          country_id: item.country?.id,
        }))
      : []
    const social_networks = data?.social_networks
      ? data?.social_networks.map((item) => {
          let newItem = {}
          for (const [key, value] of Object.entries(item)) {
            newItem = {
              id: key,
              value,
            }
          }
          return newItem
        })
      : []
    const relatives = data?.relatives
      ? data?.relatives.map((item) => ({
          ...item,
          date_of_birth: `${item.year}-${zeroWrapper(item.month)}-${zeroWrapper(item.day)}`,
          phone_numbers: [item.phone_number],
          relative_type: item.relative_type.enum,
        }))
      : []
    const groups = data?.groups?.length || data?.tags?.length ? [...(data?.groups || []), ...(data?.tags || [])] : []
    const requestBody = {
      addresses,
      cards: data?.cards ? data?.cards : [],
      channel: {},
      custom_fields: [],
      date_of_birth,
      email_notification: !!data?.email_notification,
      first_name: data?.name,
      gender: data?.clientGender,
      groups,
      last_name: data?.last_name,
      marital_status: data?.marital_status,
      middle_name: data?.middle_name,
      notes: [],
      phone_notification: !!data?.phone_notification,
      phone_numbers: data?.phone ? [data?.phone?.replace(/ /g, '')] : [],
      relatives,
      sms_notification: !!data?.sms_notification,
      social_network_notification: !!data?.social_network_notification,
      social_networks,
      tasks: [],
      shop_id: current_shop_id,
    }
    mutate(requestBody)
  }

  const onError = (err) => {
    error('alerts.enter_all_required_fields')
    console.log('err', err)
  }

  return (
    <Drawer open={openDrawer} onClose={closeDrawer} anchor='right' elevation={1} className={classes.drawer}>
      <Box>
        <Box className={classes.header}>
          <Box display='flex' alignItems='center'>
            <Box onClick={closeDrawer}>
              <ArrowBackIcon />
            </Box>
            <Typography variant='h4' className={classes.title}>
              {t('menu.clients.new_client')}
            </Typography>
          </Box>
          <Box width={196}>
            <Button primary fullWidth size='small' style={{ borderRadius: 16 }} isLoading={isLoading} form='create-client-form-mini' type='submit'>
              {t('menu.clients.create')}
            </Button>
          </Box>
        </Box>
        <FormProvider {...methods}>
          <form id='create-client-form-mini' onSubmit={methods.handleSubmit(onSubmit, onError)} noValidate>
            <Box>
              <MainDetails quickCreateClientName={quickCreateClientName} clientData={clientData} />
              {/* <GroupsTags clientData={clientData} /> */}
              {/* <Box width='100%' mt={4}>
                <Button
                  id='expand-client-fields'
                  color='secondary'
                  fullWidth
                  size='small'
                  style={{ borderRadius: 16, height: 56 }}
                  variant='contained'
                  onClick={() => {
                    setClientDataMini(methods.getValues())
                    setOpenClientCreate(true)
                  }}
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{
                      marginRight: 8,
                      color: palette.blue[500],
                    }}
                  />
                  {t('menu.clients.new.expand_fields')}
                </Button>
              </Box> */}
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Drawer>
  )
}
