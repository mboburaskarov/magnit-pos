import { Box, Button, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { requests } from '../../../utils/requests'
import InputDatePicker from '../../Inputs/InputDatePicker'
import InputSwitchNew from '../../Inputs/InputSwitch'
import InputPhone from '../../Inputs/PhoneNumber'
import TextField from '../../Inputs/TextField'
import LazySelect from '../../Select/LazySelect'
import { get } from 'lodash'
import BrandPlaceholderIcon from '../../../src/assets/icons/BrandPlaceholderIcon'
import BrandCardIcon from '../../../src/assets/icons/BrandCardIcon'
import thousandDivider from '../../../utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[100],
    padding: 16,
    borderRadius: 24,
    marginTop: 16,
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  label: {
    marginRight: 255,
  },
}))

export default function MainDetails({ quickCreateClientName, clientData, openDrawer }) {
  const classes = useStyles()
  const { control, errors, setValue, register, watch } = useFormContext()
  const { t } = useTranslation()
  useEffect(() => {
    setValue('dial_code', '+998')
  }, [])

  return (
    <Box mt={'24px'}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography className={classes.required} mb='4px'>
            {t('client_name')}
          </Typography>

          <TextField
            id='client-name'
            name='first_name'
            control={control}
            fullWidth
            error={errors?.first_name}
            placeholder={t('client_name.placeholder')}
            required
            defaultValue={quickCreateClientName || clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('client_last_name')}</Typography>

          <TextField
            id='last-name'
            name='last_name'
            control={control}
            fullWidth
            error={errors?.last_name}
            placeholder={t('client_last_name.placeholder')}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('birthdate')}</Typography>
          <InputDatePicker
            noValidation
            noMarginTop
            fromMonthCustom={new Date(dayjs('1900.01.01').format(''))}
            name='date_of_birth'
            error={errors?.date_of_birth}
            id='birth-Date'
            showYearDropdown
            placeholder='yyyy/oo/kk'
          />
        </Grid>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('gender')}</Typography>

          <InputSwitchNew
            id='client-gender'
            noMarginTop
            name='gender'
            control={control}
            defaultValue='male'
            error={errors?.gender}
            options={[
              {
                title: t('gender_male'),
                value: 'male',
              },
              {
                title: t('gender_female'),
                value: 'female',
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box mt={'25px'}>
            <Typography mb={'4px'} className={classes.required}>
              {t('phone_number')}
            </Typography>
          </Box>
          <InputPhone
            login={false}
            id='phone'
            disabled
            name='phone'
            control={control}
            fullWidth
            boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
            required
            setCountry={({ dial_code }) => setValue('dial_code', dial_code)}
            error={errors?.phone}
          />
        </Grid>
        <Grid item xs={6}>
          <Box mt={'24px'}>
            <Typography mb='4px'>{t('tags')}</Typography>
          </Box>
          {/* <TextField
            id='tags'
            name='tags'
            control={control}
            fullWidth
            // required
            error={errors?.tags}
            placeholder={t('tags.placeholder')}
            defaultValue={clientData ? clientData.last_name : ''}
            asteriks
          /> */}
          <LazySelect
            isCreatable={true}
            slug='tags'
            boxStyle={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
            id='tags'
            name='tags'
            isMulti={false}
            // label={t('create_new_product.features.manufacturer')}
            // placeholder={t('create_new_product.features.manufacturer.placeholder')}
            minWidth='auto'
            isClearable={true}
            request={requests.getAllTags}
            filters={{ limit: 10 }}
            // control={control}
            // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
            // request={requests.brand.getAll}
            createOptionRequest={requests.createTag}
            getOptionLabel={(option) => {
              return option.name
            }}
            // filterOption={() => true}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid mt={'25px'} item xs={6}>
          {get(openDrawer, 'data.loyalty_card_barcode', false) ? (
            <Box
              sx={{
                padding: '20px',
                height: '160px',
                borderRadius: '16px',
                background: 'linear-gradient(147.13deg, #2558FF 3.88%, #0028FF 73.63%)',
              }}
            >
              <BrandCardIcon />
              <Box mt={'28px'}>
                <Typography sx={{ fontSize: '14px', fontWeight: '500', lineHeight: '20px', color: '#AFD5FF' }}>Карта лояльности</Typography>
                <Typography sx={{ fontSize: '28px', fontWeight: '700', lineHeight: '40px', color: 'white' }}>
                  {thousandDivider(get(openDrawer, 'data.balance', 0), 'сум')}{' '}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Typography className={classes.required} mb='4px'>
                {t('Лояльность карта')}
              </Typography>

              <TextField
                id='loyalty_card_barcode'
                name='loyalty_card_barcode'
                control={control}
                fullWidth
                error={errors?.loyalty_card_barcode}
                placeholder={t('Введите номер карты')}
                defaultValue={clientData?.loyalty_card_barcode || ''}
                asteriks
              />
            </>
          )}
        </Grid>
        {/* <Grid sx={{ mt: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} gap={'8px'} item xs={6}>
          <Button sx={{ height: '48px', width: '100%' }} color='secondary'>
            Отменить
          </Button>
          <Button sx={{ height: '48px', width: '100%' }}>Подтвердить</Button>
        </Grid> */}
      </Grid>
    </Box>
  )
}
