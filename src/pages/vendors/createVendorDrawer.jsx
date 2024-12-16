import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { get, size } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import { requests } from '../../../utils/requests'
import { error, success } from '../../../utils/toast'
import MainDetails from './mainDetails'
import PlusIcon from '../../assets/icons/PlusIcon'

const useStyles = makeStyles((theme) => ({
  drawer: {
    maxWidth: '660px',
    '& .MuiDrawer-paper': {
      width: '60%',
      maxWidth: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
      '& form': {
        // position: 'relative',
      },
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    height: '80px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Gilroy-Bold, sans-serif',
    fontSize: 24,
    fontWeight: 700,
    color: theme.palette.bunker[950],
    lineHeight: '432px',
  },
}))

export default function CreateVendorDrawer({ refetchVendorList, quickCreateClientName, openDrawer, closeDrawer, setCustomerId, clientData }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const methods = useForm()
  const userData = useSelector((state) => state.user)

  useEffect(() => {
    methods.register('dial_code')
  }, [])

  // useDidUpdate(() => {
  //   if (clientData) {
  //     methods.reset(clientData)
  //   }
  // }, [clientData])
  useEffect(() => {
    methods.reset()
  }, [])
  // useEffect(() => {
  //   methods.reset()
  // }, [quickCreateClientName])
  const { mutate: handleSaleCreate, isLoading: isCreateCustomer } = useMutation(requests.createVendor, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchVendorList()
      // setCustomerId({ id: get(data, 'data.id'), name: get(data, 'data.first_name') + ' ' + get(data, 'data.last_name'), balance: get(data, 'data.balance') })
      success('Вендор создан!')
    },
    onError: (err) => {
      error('Ошибка при Вендор создан!')
      console.log('err', err)
    },
  })

  const { mutate: handleUpdateVendor, isLoading: isUpdateVendor } = useMutation(requests.updateVendor, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchVendorList()
      // setCustomerId({ id: get(data, 'data.id'), name: get(data, 'data.first_name') + ' ' + get(data, 'data.last_name'), balance: get(data, 'data.balance') })
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    if (size(get(data, 'phone')) < 14) {
      error('Phone number is less than 14')
    }
    const requestBody = {
      birthdate: data?.date_of_birth,
      // created_by: userData?.id,
      first_name: data?.first_name,
      gender: data?.gender,
      language: 'ru',
      password: data?.password,
      last_name: data?.last_name,
      role_id: data?.role?.id,
      store_id: data?.store?.id,
      phone: '+998' + data?.phone?.replace(/[()\s]/g, ''),
    }
    if (openDrawer?.mode === 'edit') {
      handleUpdateVendor({ data: requestBody, id: openDrawer?.id })
    } else {
      handleSaleCreate(requestBody)
    }
  }

  const onError = (err) => {
    error('alerts.enter_all_required_fields')
    console.log('err', err)
  }
  const theme = useTheme()
  return (
    <Drawer className={classes.drawer} open={openDrawer} onClose={closeDrawer} anchor='right' elevation={1}>
      <Box height={'100%'}>
        <Box className={classes.header}>
          <Typography variant='h4' className={classes.title}>
            {t('menu.clients.new_client')}
          </Typography>
          <CloseIcon color={theme.palette.black} onClick={() => closeDrawer(false)} />
        </Box>
        <FormProvider {...methods}>
          <form id='create-client-form-mini' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <Box
              sx={{
                padding: '0 24px',
              }}
            >
              <MainDetails openDrawer={openDrawer} quickCreateClientName={quickCreateClientName} clientData={clientData} />
            </Box>
            <Box
              width={196}
              sx={{
                padding: '24px',
                width: '100%',
                display: 'flex',
                justifyContent: 'end',
                position: 'absolute',
                bottom: 0,
              }}
            >
              <Button
                primary
                startIcon={<PlusIcon color='#fff' />}
                fullWidth
                size='small'
                style={{ borderRadius: 16 }}
                isLoading={isCreateCustomer}
                form='create-client-form-mini'
                type='submit'
              >
                {t('create')}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Drawer>
  )
}
