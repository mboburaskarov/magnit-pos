import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import { requests } from '../../utils/requests'
import SelectSimple from '../../components/Select/SelectSimple'
import InputRange from '../../components/Inputs/InputRange'
import getOptionsFromUrlParam from '../../utils/getOptionsFromUrlParam'
import * as qs from 'qs'
import StyledEmptyDialog from '../../components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import { useTranslation } from 'react-i18next'
import InputDatePicker from '../../components/Inputs/InputDatePicker'

export default function DraftFilter({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const { id } = useParams()

  const methods = useForm()
  const { formState, reset, control, getValues } = methods

  const { data: customers } = useQuery('customers', () => requests.getAllCustomers({ limit: 1000, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      customer_id: data.customers?.id || undefined,
      draft_date: data.expired_date || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/sales/new-sale/${id}${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { customer_id, draft_date } = values

    reset(
      {
        customer_id: customer_id ? getOptionsFromUrlParam(customer_id, customers?.data?.data?.data)[0] : null,
        expired_date: draft_date ? new Date(draft_date) : new Date(),
      },
      { keepDirty: true }
    )
  }, [values?.category_id, values?.store_id])

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/sales/new-sale/${id}?offset=0&limit=${values?.limit || 5}`)
  }
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog open={open} title={t('filter_dialog.label')} customButtons={<CloseIcon onClick={() => setOpen(false)} />}>
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box
            sx={{
              '& .react-datepicker-popper': {
                transform: 'translate(596px, 530px) !important',
              },
            }}
            rowGap={3}
            flexWrap='wrap'
            display='flex'
            component='form'
            onSubmit={methods.handleSubmit(onSubmit, onError)}
          >
            <InputDatePicker
              // withTime
              defaultValue={new Date()}
              name='expired_date'
              // minDate={new Date()}
              // minTime={new Date()}
              // minT
              // required
              id='expired_date'
              showYearDropdown
              label='Дата закрытия'
              placeholder='Дата закрытия'
            />
            <SelectSimple
              fullWidth
              id='produ'
              name='customers'
              white
              minWidth='auto'
              label={t('input.manufacturer.label')}
              placeholder={t('input.store.placeholder')}
              options={customers?.data?.data?.data}
              getOptionLabel={(el) => `${el.first_name} ${el.last_name}`}
            />

            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                sx={{ bgcolor: '#fff !important', border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                disabled={!formState.isDirty}
                onClick={resetFilter}
              >
                <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                  {t('filter_dialog.reset.label')}
                </Typography>
              </Button>
              <Button fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
