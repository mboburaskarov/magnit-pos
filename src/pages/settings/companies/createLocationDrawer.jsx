import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import PlusIcon from '../../../assets/icons/PlusIcon'
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

export default function CreateVendorDrawer({ refetchCompanyList, quickCreateClientName, openDrawer, closeDrawer, setCustomerId, clientData }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const methods = useForm()

  useEffect(() => {
    methods.reset()
  }, [])

  const { mutate: createComapny, isLoading: isCreateCustomer } = useMutation(requests.createComapny, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchCompanyList()
      success('Вендор создан!')
    },
    onError: (err) => {
      error('Ошибка при Вендор создан!')
      console.error('err', err)
    },
  })

  const { mutate: handleUpdateCompany, isLoading: isUpdateCompany } = useMutation(requests.updateCompany, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchCompanyList()

      success('Вендор успешно редактирование!')
    },
    onError: (err) => {
      error('Ошибка при редактирование Вендор!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      name: data?.name,
      phone: '998' + data?.phone?.replace(/[()\s]/g, ''),

      email: data?.email,
      country: data?.country,
      city: data?.city,
      postal_code: data?.postal_code,
      legal_name: data?.legal_name,
      legal_address: data?.legal_address,
      company_inn: data?.company_inn,
      company_mfo: data?.company_mfo,
    }
    if (openDrawer?.mode === 'edit') {
      handleUpdateCompany({ data: requestBody, id: openDrawer?.data?.id })
    } else {
      createComapny(requestBody)
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
            {openDrawer?.mode === 'edit' ? 'Редактировать Компании' : 'Новый Компании'}
          </Typography>
          <CloseIcon color={theme.palette.black} onClick={() => closeDrawer(false)} />
        </Box>
        <FormProvider {...methods}>
          <Box
            minHeight={'calc(100vh - 80px)'}
            maxHeight={'100vh'}
            display={'flex'}
            justifyContent={'space-between'}
            flexDirection={'column'}
            position={'relative'}
            overflow={'auto'}
          >
            <form id='create-client-form-mini' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <Box
                sx={{
                  padding: '0 24px',
                }}
              >
                <MainDetails openDrawer={openDrawer} quickCreateClientName={quickCreateClientName} clientData={clientData} />
              </Box>
            </form>
            <Box
              width={196}
              sx={{
                padding: '24px',
                width: '100%',
                left: 0,
                display: 'flex',
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
                {openDrawer?.mode === 'edit' ? t('edit') : t('create')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </Drawer>
  )
}
