import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import * as qs from 'qs'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function FilterMenu({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const userData = useSelector((state) => state.user)

  const { formState, reset, control, getValues } = methods

  const onSubmit = (data) => {
    console.log(data)

    const requestBody = {
      store_id: data.store_id?.id || undefined,
      employee_id: data.employee_id?.id || undefined,
      store_name: data.store_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/reports/product-report${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/reports/product-report?offset=0&limit=${values?.limit || 5}`)
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
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            {/* <SelectSimple
              fullWidth
              id='sto'
              name='store_id'
              white
              minWidth='auto'
              label={t('input.store.label')}
              placeholder={t('input.store.placeholder')}
              getOptionLabel={(el) => el.name}
              options={shopList?.data?.data?.data}
            /> */}
            <LazySelect
              slug='employee_id'
              boxStyle={{ width: '100%' }}
              id='employee_id'
              name='employee_id'
              customLabel='full_name'
              isMulti={false}
              placeholder={'Выберите Продавец'}
              minWidth='auto'
              isClearable={true}
              label={'Продавец'}
              request={requests.getAllVendors}
              filters={{ store_id: get(userData, 'store.id'), limit: 20 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <LazySelect
              slug='users'
              boxStyle={{ width: '100%' }}
              id='store'
              name='store_id'
              isMulti={false}
              placeholder={t('Выберите Магазин')}
              minWidth='auto'
              isClearable={true}
              label={t('input.store.label')}
              request={requests.getAllStores}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />

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
