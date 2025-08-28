import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function FilterMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control } = methods

  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.value || undefined,
      store_name: data.store_id?.name || undefined,
      cashbox_id: data.cashbox_id?.value || undefined,
      cashbox_name: data.cashbox_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/sales/cash-shifts${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { store_id, cashbox_id } = values

    reset(
      {
        cashbox_id: cashbox_id ? { name: values?.cashbox_name, value: values?.cashbox_id } : null,
        store_id: store_id ? { name: values?.store_name, value: values?.store_id } : null,
      },
      { keepDirty: true }
    )
  }, [values?.cashbox_id, values?.store_id])
  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/sales/cash-shifts?offset=0&limit=${values?.limit || 5}`)
  }
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      open={open}
      onClose={() => setOpen(false)}
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
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <Box maxHeight={'calc(100vh - 280px)'} px={'5px'} width={'100%'} overflow={'visible'}>
              <LazySelect
                slug='users'
                boxStyle={{ width: '100%' }}
                id='store'
                name='store_id'
                isMulti={false}
                placeholder={t('Выберите Аптека')}
                minWidth='auto'
                isClearable={true}
                label={t('input.store.label')}
                request={requests.getAllStores}
                filters={{ limit: 10 }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />

              <LazySelect
                slug='cashbox_id'
                boxStyle={{ width: '100%' }}
                id='cashbox_id'
                name='cashbox_id'
                fullWidth
                customLabel='name'
                isMulti={false}
                placeholder={'Выберите Касса'}
                minWidth='auto'
                isClearable={true}
                label={'Касса'}
                request={requests.getAllCashBoxList}
                filters={{ limit: 10 }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />
            </Box>
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                sx={{ bgcolor: `${theme.palette.background.gray} !important`, border: '1px solid #ECEDF2' }}
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
