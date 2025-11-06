import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNew';
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import LazySelect from '@components/Select/LazySelect';
import { useQueryParams } from '@hooks/useQueryParams';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { requests } from '@utils/requests';
import { useSelector } from 'react-redux';
import CloseIcon from '@icons/CloseIcon';
import { useTheme } from '@mui/styles';
import { useQuery } from 'react-query';
import Label from '@components/Label';
import { get } from 'lodash';
import * as qs from 'qs';


export default function FilterMenu({ open, selectedShops, setSelectedShops, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const theme = useTheme()
  const { t } = useTranslation()
  const methods = useForm()
  const userData = useSelector((state) => state.user)
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const { formState, reset, control, getValues } = methods

  const onSubmit = (data) => {
    const requestBody = {
      employee_id: data.employee_id?.id || undefined,
      producer_id: data.producer_id?.value || undefined,
      producer_name: data.producer_id?.name || undefined,
      store_name: data.store_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/reports/product-report${requestParams}`)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  const resetFilter = () => {
    reset({
      employee_id: null,
      producer_id: null,
    })
    setSelectedShops('all')
    setOpen(false)
    navigate(`/reports/product-report?offset=0&limit=${values?.limit || 5}`)
  }
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
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <Box width={'100%'}>
              <Label>Аптека</Label>
              <MultiOptionSelectNew
                zIndex={999}
                placeholder={t('placeholders.select_shops')}
                multiple
                defaultSelectedAll
                beforeContent={t('placeholders.select_shops')}
                value={selectedShops}
                allOptions={get(shopList, 'data.data.ids', [])}
                selectAllLabel={t('Все филиалы')}
                options={get(shopList, 'data.data.data', [])}
                isLoading={false}
                onChange={(val) => {
                  setSelectedShops(val)
                }}
                request={requests.getAllStores}
              />
            </Box>

            <LazySelect
              slug='users'
              boxStyle={{ width: '100%' }}
              id='producer'
              name='producer_id'
              isMulti={false}
              label={t('input.manufacturer.label')}
              placeholder={t('input.manufacturer.placeholder')}
              minWidth='auto'
              isClearable={true}
              request={requests.getProducer}
              filters={{ limit: 100 }}
              control={methods.control}
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
                disabled={!formState.isDirty && !selectedShops}
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
