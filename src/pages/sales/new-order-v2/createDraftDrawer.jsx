import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingButton } from '@mui/lab'
import { Box, Checkbox, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import InputDatePicker from '../../../../components/Inputs/InputDatePicker'
import OutLineTextField from '../../../../components/Inputs/OutLineTextField'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '460px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '80px',
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  expireInitialDate: {
    backgroundColor: theme.palette.bg[10],
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '16px',
    marginRight: '10px',
    marginTop: '10px',
  },
}))
function CreateDraftDrawer({ open, setOpen, customerId, refetchcartItemsList, cashBoxDetails }) {
  const classes = useStyles()
  const userData = useSelector((state) => state.user)
  const { id } = useParams()

  const methods = useForm()
  const [eposChecked, setEposChecked] = useState(false)
  const changeExpireDate = (type, date = new Date()) => {
    if (type === 'ertaga') {
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      methods.setValue('draft_time', nextDay)
    }
    if (type === '3kun') {
      const nextThreeDays = new Date(date)
      nextThreeDays.setDate(nextThreeDays.getDate() + 3)
      methods.setValue('draft_time', nextThreeDays)
    }
    if (type === '1hafta') {
      const nextWeek = new Date(date)
      nextWeek.setDate(nextWeek.getDate() + 7)
      methods.setValue('draft_time', nextWeek)
    }
  }
  const navigate = useNavigate()

  const { mutate: createDraft, isLoading: isCreateDraft } = useMutation(requests.createDraft, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
      setOpen(false)
      success('Черновик создан!')
    },
    onError: (err) => {
      error('Ошибка при Черновик создан!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    setOpen(false)

    const requestBody = {
      cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
      created_by: get(userData, 'id'),
      description: get(data, 'description'),
      customer_id: get(customerId, 'id'),
      draft_time: get(data, 'draft_time'),
      sale_id: id,
      store_id: get(userData, 'store.id'),
    }
    createDraft(requestBody)
  }
  const onError = (err) => {
    console.error('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  const theme = useTheme()
  return (
    <FormProvider {...methods}>
      <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
        <Box display={'flex'} flexDirection={'column'} height={'100%'} justifyContent={'space-between'}>
          <Box>
            <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
              <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
                Черновик
              </Typography>
              <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
            </Box>
            <Box display={'flex'} padding={'24px'} flexDirection={'column'}>
              <Box>
                <InputDatePicker
                  defaultValue={new Date()}
                  name='draft_time'
                  minDate={new Date()}
                  required
                  id='draft_time_id'
                  showYearDropdown
                  label='Время черновика'
                  placeholder='Время черновика'
                />
                <Box display={'flex'} justifyContent={'start'}>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'gray.200',
                      },
                    }}
                    onClick={() => changeExpireDate('ertaga')}
                    className={classes.expireInitialDate}
                  >
                    До завтра
                  </Typography>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'gray.200',
                      },
                    }}
                    onClick={() => changeExpireDate('3kun')}
                    className={classes.expireInitialDate}
                  >
                    3 дней
                  </Typography>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'gray.200',
                      },
                    }}
                    onClick={() => changeExpireDate('1hafta')}
                    className={classes.expireInitialDate}
                  >
                    1 недели
                  </Typography>
                </Box>
              </Box>
              <Box height={'24px'} />
              <OutLineTextField
                multiline
                fullWidth
                borderRadius={'20px'}
                name='description'
                label='Заметка'
                placeholder='Например, товар забирает и оплачивает водитель.'
              />
              <Box height={'8px'} />

              <Box
                display={'flex'}
                onClick={() => setEposChecked((prev) => !prev)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiCheckbox-root': {
                    border: '1px solid #ccc !important',
                  },
                }}
                alignItems={'center'}
              >
                <Checkbox
                  name='id'
                  id='id'
                  onClick={() => setEposChecked((prev) => !prev)}
                  onChange={() => setEposChecked((prev) => !prev)}
                  checked={eposChecked}
                  className={classes.checkbox}
                  icon={<FontAwesomeIcon icon={faCircle} style={{ fill: 'orange.500' }} />}
                  checkedIcon={<FontAwesomeIcon icon={faCheckCircle} style={{ fill: 'orange.500' }} />}
                />
                <Typography ml={'10px'} fontSize={'16px'}>
                  Печать чека за просрочку платежа
                </Typography>
              </Box>
            </Box>
          </Box>
          <LoadingButton
            variant='contained'
            loading={isCreateDraft}
            type='submit'
            onClick={methods.handleSubmit(onSubmit, onError)}
            sx={{ mb: '20px', mx: '20px' }}
          >
            Сохранить
          </LoadingButton>
        </Box>
      </Drawer>
    </FormProvider>
  )
}

export default CreateDraftDrawer
