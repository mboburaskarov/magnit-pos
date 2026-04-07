import { Box, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import PlusIcon from '@icons/PlusIcon'
import MainDetails from './mainDetails'
import { LoadingButton } from '@mui/lab'

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
  const [terminalIdValue, setTerminalIdValue] = useState('')
  const [terminalIds, setTerminalIds] = useState([])

  useEffect(() => {
    methods.register('dial_code')
  }, [])

  useEffect(() => {
    methods.reset()
  }, [])

  useEffect(() => {
    setTerminalIdValue('')
    setTerminalIds(get(openDrawer, 'data.terminal_ids', []))
  }, [openDrawer])

  const { mutateAsync: createBranch, isLoading: isHandleCreateBranch } = useMutation(requests.createStore)
  const { mutateAsync: updateBranch, isLoading: isHandleUpdateBranch } = useMutation(requests.updateStore)

  const onSubmit = async (data) => {
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
      inn: data?.inn,
      work_hours: get(data, 'time-type') == '24' ? '00:00-00:00' : get(data, 'work-time'),
      terminal_ids: terminalIds,
    }

    try {
      if (openDrawer?.mode === 'edit') {
        await updateBranch({ data: requestBody, id: openDrawer?.data?.id })
        success('Аптека был отредактирован!')
      } else {
        await createBranch(requestBody)
        success('Аптека создан!')
      }

      closeDrawer(false)
      methods.reset()
      refetchBranchList()
    } catch (err) {
      error(openDrawer?.mode === 'edit' ? 'Ошибка редактирования Аптекаа.!' : 'Ошибка при Аптека создан!')
      console.error('err', err)
    }
  }

  const onError = (err) => {
    error('alerts.enter_all_required_fields')
    console.error('err', err)
  }

  const handleAddTerminalId = () => {
    const normalizedTerminalId = terminalIdValue.trim()

    if (!normalizedTerminalId) {
      error('Terminal ID kiriting')
      return
    }

    if (!get(openDrawer, 'data.id')) {
      error('Filial topilmadi')
      return
    }

    if (terminalIds.includes(normalizedTerminalId)) {
      error('Bu Terminal ID allaqachon mavjud')
      return
    }

    setTerminalIds((prev) => [...prev, normalizedTerminalId])
    setTerminalIdValue('')
  }

  const handleDeleteTerminalId = (terminalId) => {
    setTerminalIds((prev) => prev.filter((item) => item !== terminalId))
  }

  const theme = useTheme()
  return (
    <Drawer className={classes.drawer} open={openDrawer} onClose={closeDrawer} anchor='right' elevation={1}>
      <Box height={'100%'} sx={{ position: 'relative' }}>
        <Box className={classes.header}>
          <Typography variant='h4' className={classes.title}>
            {openDrawer?.mode === 'edit' ? 'Редактировать филиал' : 'Новый филиал'}
          </Typography>
          <CloseIcon color={theme.palette.black} onClick={() => closeDrawer(false)} />
        </Box>
        <FormProvider {...methods}>
          <form id='create-client-form-mini' onSubmit={methods.handleSubmit(onSubmit, onError)} style={{ height: 'calc(100% - 80px)' }}>
            <Box
              sx={{
                padding: '0 24px 120px',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <MainDetails
                openDrawer={openDrawer}
                terminalIdValue={terminalIdValue}
                setTerminalIdValue={setTerminalIdValue}
                terminalIds={terminalIds}
                handleAddTerminalId={handleAddTerminalId}
                handleDeleteTerminalId={handleDeleteTerminalId}
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
              <LoadingButton
                variant='contained'
                startIcon={<PlusIcon color='#fff' />}
                fullWidth
                size='small'
                style={{ borderRadius: 16 }}
                loading={isHandleCreateBranch || isHandleUpdateBranch}
                form='create-client-form-mini'
                type='submit'
              >
                {t('create')}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Drawer>
  )
}
