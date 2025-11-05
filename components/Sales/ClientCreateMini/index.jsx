import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get, size } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import useDidUpdate from '../../../src/hooks/useDidUpdate'
import { requests } from '../../../utils/requests'
import { error, success } from '../../../utils/toast'
import MainDetails from './mainDetails'

const useStyles = makeStyles((theme) => ({
  drawer: {
    maxWidth: '660px',
    '& .MuiDrawer-paper': {
      width: '60%',
      maxWidth: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
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

export default function ClientCreateMini({ quickCreateClientName, openDrawer, closeDrawer, setOpenDrawer, setCustomerId, clientData }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const methods = useForm()
  const userData = useSelector((state) => state.user)

  useEffect(() => {
    methods.register('dial_code')
    methods.setValue('loyalty_card_barcode', get(openDrawer, 'data.loyalty_card_barcode'))
    methods.setValue('first_name', get(openDrawer, 'data.first_name'))
    methods.setValue('last_name', get(openDrawer, 'data.last_name'))
    methods.setValue('date_of_birth', new Date(get(openDrawer, 'data.birthday', null)))
    methods.setValue('gender', get(openDrawer, 'data.gender'))
    methods.setValue('phone', get(openDrawer, 'data.phone', '').split('998')[1])
  }, [openDrawer])

  useDidUpdate(() => {
    if (openDrawer) {
      methods.reset(openDrawer?.data)
    }
  }, [openDrawer])
  useEffect(() => {
    methods.reset()
  }, [])

  const { mutate: handleCustomerCreate, isLoading: isCreateCustomer } = useMutation(requests.createCustomer, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()

      setCustomerId({
        id: get(data, 'data.id'),
        name: get(data, 'data.first_name') + ' ' + get(data, 'data.last_name'),
        balance: get(data, 'data.balance', 0),
        barcode: get(data, 'data.discount_card'),
      })
      success('Клиент создан!')
    },
    onError: (err) => {
      error('Ошибка при Клиент создан!')
      console.error('err', err)
    },
  })

  const { mutate: handleEditCustomer, isLoading: isHandleEditCustomer } = useMutation(requests.editCustomer, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()

      setCustomerId({
        id: get(data, 'data.id'),
        name: get(data, 'data.first_name') + ' ' + get(data, 'data.last_name'),
        balance: get(data, 'data.balance', 0),
        barcode: get(data, 'data.discount_card'),
      })
      success('Клиент создан!')
    },
    onError: (err) => {
      error('Ошибка при Клиент создан!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    if (size(get(data, 'phone')) < 14) {
      error('Номер телефона меньше 14')
    }

    const requestBody = {
      birthday: data?.date_of_birth ? dayjs(get(data, 'date_of_birth')).format('YYYY.MM.DD') : null,
      created_by: userData?.id,
      first_name: data?.first_name,
      gender: data?.gender,
      last_name: data?.last_name,
      store_id: get(userData, 'store.id'),
      phone: '998' + data?.phone?.replace(/[()\s]/g, ''),
      tag_id: data?.tags?.value,
      virtual_loyalty_card_needed: data?.shouldGenerateLoyalCard == 'auto' ? true : false,

      loyalty_card_barcode:
        data?.shouldGenerateLoyalCard == 'auto'
          ? get(openDrawer, 'data.loyalty_card_barcode', false) || data?.loyalty_card_barcode
          : data?.loyalty_card_barcode,
    }
    if (get(openDrawer, 'type') == 'edit') {
      handleEditCustomer({ id: get(openDrawer, 'data.id'), data: requestBody })
    } else {
      handleCustomerCreate(requestBody)
    }
  }

  const onError = (err) => {
    error('alerts.enter_all_required_fields')
    console.error('err', err)
  }
  const theme = useTheme()
  return (
    <Drawer className={classes.drawer} open={openDrawer} onClose={closeDrawer} anchor='right' elevation={1}>
      <Box height={'100%'}>
        <Box className={classes.header}>
          <Typography variant='h4' className={classes.title}>
            {get(openDrawer, 'type') == 'edit' ? 'Изменить клиент' : t('menu.clients.new_client')}
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
              <MainDetails
                setOpenDrawer={setOpenDrawer}
                setCustomerId={setCustomerId}
                quickCreateClientName={quickCreateClientName}
                clientData={clientData}
                openDrawer={openDrawer}
              />
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
              <Button primary fullWidth size='small' style={{ borderRadius: 16 }} isLoading={isCreateCustomer} form='create-client-form-mini' type='submit'>
                {get(openDrawer, 'type') == 'edit' ? t('Изменить') : t('create')}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Drawer>
  )
}
