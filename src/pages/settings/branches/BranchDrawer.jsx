import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import PlusIcon from '@icons/PlusIcon'
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

export default function BranchDrawer({ refetchBranchList, openDrawer, closeDrawer }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const methods = useForm()

  useEffect(() => {
    methods.register('dial_code')
  }, [])

  useEffect(() => {
    methods.reset()
  }, [])

  const { mutate: handleCreateBranch, isLoading: isHandleCreateBranch } = useMutation(requests.createStore, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchBranchList()
      success('Аптека создан!')
    },
    onError: (err) => {
      error('Ошибка при Аптека создан!')
      console.error('err', err)
    },
  })

  const { mutate: handleUpdateBranch, isLoading: isHandleUpdateBranch } = useMutation(requests.updateStore, {
    onSuccess: ({ data }) => {
      closeDrawer(false)
      methods.reset()
      refetchBranchList()
      success('Аптека был отредактирован!')
    },
    onError: (err) => {
      error('Ошибка редактирования Аптекаа.!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      name: get(data, 'name'),
      detailed_name: get(data, 'detailed_name'),
      location: get(data, 'location'),
      ...(data?.phone && { phone: '998' + data.phone.replace(/[()\s]/g, '') }),
      address: get(data, 'address'),
      employee_count: Number(get(data, 'employee_count')),
      cash_box_count: Number(get(data, 'cash_box_count')),
      store_code: Number(get(data, 'store_code')),
      company_id: data?.company_id?.id,

      work_hours: get(data, 'time-type') == '24' ? '00:00-00:00' : get(data, 'work-time'),
    }
    if (openDrawer?.mode === 'edit') {
      handleUpdateBranch({ data: requestBody, id: openDrawer?.data?.id })
    } else {
      handleCreateBranch(requestBody)
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
            {openDrawer?.mode === 'edit' ? 'Редактировать филиал' : 'Новый филиал'}
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
              <MainDetails openDrawer={openDrawer} />
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
                isLoading={isHandleCreateBranch}
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
