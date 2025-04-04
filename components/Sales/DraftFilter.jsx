import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../components/Dialogs/StyledeEmptyDialog'
import InputDatePicker from '../../components/Inputs/InputDatePicker'
import LazySelect from '../../components/Select/LazySelect'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import getOptionsFromUrlParam from '../../utils/getOptionsFromUrlParam'
import { requests } from '../../utils/requests'
export default function DraftFilter({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const { id } = useParams()
  const theme = useTheme()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods

  const { data: customers } = useQuery('customers', () => requests.getAllCustomers({ limit: 20, offset: 0 }))

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
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={t('filter_dialog.label')}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
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
              '& .react-datepicker-popper': {},
            }}
            rowGap={3}
            flexWrap='wrap'
            display='flex'
            component='form'
            onSubmit={methods.handleSubmit(onSubmit, onError)}
          >
            <Box maxHeight={'calc(100vh - 280px)'} width={'100%'} overflow={'visible'}>
              <InputDatePicker
                defaultValue={new Date()}
                name='expired_date'
                id='expired_date'
                showYearDropdown
                label='Дата закрытия'
                placeholder='Дата закрытия'
              />
              <Box height={'20px'} />

              <LazySelect
                slug='users'
                boxStyle={{ width: '100%' }}
                id='customers'
                name='customers'
                isMulti={false}
                placeholder={'Выберите клиент'}
                minWidth='auto'
                isClearable={true}
                label={t('input.client.label')}
                request={requests.getAllCustomers}
                filters={{ limit: 10 }}
                control={control}
                // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
                // uncontrolled
                customLabel={'full_name'}
                getOptionLabel={(option) => {
                  return <Typography color='grey.600'>{option.name}</Typography>
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />

              {/* <SelectSimple
              fullWidth
              id='produ'
              name='customers'
              white
              minWidth='auto'
              label={t('input.client.label')}
              placeholder={t('input.client.placeholder')}
              options={customers?.data?.data?.data}
              getOptionLabel={(el) => `${el.first_name} ${el.last_name}`}
            /> */}
            </Box>
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
