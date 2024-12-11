import { Box, Button, Checkbox, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import WaitingCashAmoutIcon from '../../../assets/icons/WaitingCashAmoutIcon'
import InComeCashIcon from '../../../assets/icons/InComeCashIcon'
import ExpenseCashIcon from '../../../assets/icons/ExpenseCashIcon'
import InputDatePicker from '../../../../components/Inputs/InputDatePicker'
import OutLineTextField from '../../../../components/Inputs/OutLineTextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import { useSelector } from 'react-redux'
import { get } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'

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
  const { setValue, getValues } = useFormContext()
  const userData = useSelector((state) => state.user)
  const { id } = useParams()

  const methods = useForm()

  const [eposChecked, setEposChecked] = useState(false)
  const changeExpireDate = (type, date = new Date()) => {
    if (type === 'ertaga') {
      const nextWeek = new Date(date)
      nextWeek.setDate(nextWeek.getDate() + 1)
      setValue('draft_time', nextWeek)
    }
    if (type === '3kun') {
      const nextWeek = new Date(date)
      nextWeek.setDate(nextWeek.getDate() + 3)
      setValue('draft_time', nextWeek)
    }
    if (type === '1hafta') {
      const nextWeek = new Date(date)
      nextWeek.setDate(nextWeek.getDate() + 7)
      setValue('draft_time', nextWeek)
    }
  }
  const navigate = useNavigate()

  const { mutate: createDraft, isLoading: isCreateDraft } = useMutation(requests.createDraft, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
      setOpen(false)
      refetchcartItemsList()
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
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
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <FormProvider {...methods}>
      <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
        <Box display={'flex'} flexDirection={'column'} height={'100%'} justifyContent={'space-between'}>
          <Box>
            <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
              <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
                Kechiktirish
              </Typography>
              <CloseIcon onClick={() => setOpen(false)} />
            </Box>
            <Box display={'flex'} padding={'24px'} flexDirection={'column'}>
              <Box>
                <InputDatePicker
                  // withTime
                  defaultValue={new Date()}
                  name='draft_time'
                  minDate={new Date()}
                  // minTime={new Date()}
                  // minT
                  required
                  id='draft_time_id'
                  showYearDropdown
                  label='Kechiktirish muddati'
                  placeholder='Kechiktirish muddati'
                />
                <Box display={'flex'} justifyContent={'start'}>
                  <Typography onClick={() => changeExpireDate('ertaga')} className={classes.expireInitialDate}>
                    Ertaga qadar
                  </Typography>
                  <Typography onClick={() => changeExpireDate('3kun')} className={classes.expireInitialDate}>
                    3 kunga
                  </Typography>
                  <Typography onClick={() => changeExpireDate('1hafta')} className={classes.expireInitialDate}>
                    1 haftaga
                  </Typography>
                </Box>
              </Box>
              <Box height={'24px'} />
              <OutLineTextField
                // endAdornmentText={'UZS'}
                multiline
                type='number'
                fullWidth
                borderRadius={'20px'}
                name='description'
                label='Eslatma'
                placeholder="Misol uchun tovar haydovchi tomonidan olindi va to'landi"
              />
              <Box height={'8px'} />

              <Box display={'flex'} alignItems={'center'}>
                <Checkbox
                  checked={eposChecked}
                  onChange={() => setEposChecked((prev) => !prev)}
                  className={classes.checkbox}
                  icon={<FontAwesomeIcon icon={faCircle} style={{ fill: 'orange.500' }} />}
                  checkedIcon={<FontAwesomeIcon icon={faCheckCircle} style={{ fill: 'orange.500' }} />}
                />
                <Typography ml={'10px'} fontSize={'16px'}>
                  Kechiktirish uchun chekni chop eting
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
            Kechiktirish
          </LoadingButton>
        </Box>
      </Drawer>
    </FormProvider>
  )
}

export default CreateDraftDrawer
