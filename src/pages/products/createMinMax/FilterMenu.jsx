import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import LazySelect from '@components/Select/LazySelect'
import { requests } from '@utils/requests'
import CloseIcon from '@icons/CloseIcon'
import { useQueryParams } from '@hooks/useQueryParams'

export default function FilterMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const theme = useTheme()
  const { t } = useTranslation()
  const { formState, reset, control } = methods

  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.id || undefined,
      store_name: data.store_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products/min-max-create${requestParams}`)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  useEffect(() => {
    const { store_id } = values

    reset(
      {
        store_id: store_id ? { name: values?.store_name, value: values?.store_id } : null,
      },
      { keepDirty: true }
    )
  }, [shopList])

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/products/min-max-create?offset=0&limit=${values?.limit || 5}`)
  }

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
