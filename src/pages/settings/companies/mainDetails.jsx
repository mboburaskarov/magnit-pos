import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputPhone from '../../../../components/Inputs/PhoneNumber'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useQuery } from 'react-query'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import { requests } from '../../../../utils/requests'

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

export default function MainDetails({ clientData, openDrawer }) {
  const classes = useStyles()

  const { data: companyInfo, refetch: refetcompanyInfo } = useQuery(
    ['companyInfo', openDrawer],
    () => requests.getSingleComapny(get(openDrawer, 'data.id', 'no')),
    {
      enabled: !!get(openDrawer, 'data.id', false),
    }
  )
  const mode = openDrawer?.mode

  const { control, errors, setValue } = useFormContext()
  const { t } = useTranslation()
  useEffect(() => {
    refetcompanyInfo
  }, [openDrawer])
  useEffect(() => {
    if (mode === 'edit') {
      setValue('name', get(companyInfo, 'data.data.name'))
      setValue('email', get(companyInfo, 'data.data.email'))
      setValue('phone', get(companyInfo, 'data.data.phone', '').replace('998', ''))
      setValue('country', get(companyInfo, 'data.data.country'))
      setValue('city', get(companyInfo, 'data.data.city'))
      setValue('postal_code', get(companyInfo, 'data.data.postal_code'))
      setValue('legal_name', get(companyInfo, 'data.data.legal_name'))
      setValue('legal_address', get(companyInfo, 'data.data.legal_address'))
      setValue('company_inn', get(companyInfo, 'data.data.company_inn'))
      setValue('company_mfo', get(companyInfo, 'data.data.company_mfo'))
    }
  }, [companyInfo])

  return (
    <Box mt={'24px'}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('name')}</Label>

          <TextField
            id='client-name'
            name='name'
            control={control}
            fullWidth
            error={errors?.name}
            placeholder={t('Название')}
            required
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Электронная почта')}</Label>

          <TextField id='last-name' name='email' control={control} required fullWidth error={errors?.email} placeholder={t('Электронная почта')} asteriks />
        </Grid>
      </Grid>
      <Box mb={4} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <Label mb={'4px'} className={classes.required}>
              {t('phone_number')}
            </Label>
          </Box>
          <InputPhone
            login={false}
            disabled
            id='phone'
            name='phone'
            defaultValue={get(companyInfo, 'data.data.phone', '').replace('998', '')}
            placeholder={t('menu.settings.shops.shop_create.phone_placeholder')}
            control={control}
            fullWidth
            boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
            required
            setCountry={({ dial_code }) => setValue('dial_code', dial_code)}
            error={errors?.phone}
          />
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Label className={classes.required} mb='4px'>
              {t('Страна')}
            </Label>
          </Box>
          <TextField
            id='country'
            name='country'
            control={control}
            fullWidth
            required={mode === 'edit' ? false : true}
            error={errors?.Страна}
            placeholder={t('Страна')}
            defaultValue={'Uzbekistan'}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Город')}</Label>

          <TextField
            id='client-name'
            name='city'
            control={control}
            fullWidth
            error={errors?.city}
            placeholder={t('Город')}
            required
            defaultValue={clientData?.city || 'Tashkent'}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Почтовый индексc')}</Label>

          <TextField
            id='last-postal_code'
            name='postal_code'
            control={control}
            required
            fullWidth
            error={errors?.postal_code}
            placeholder={t('Почтовый индексc')}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Юридическое название')}</Label>

          <TextField
            id='client-legal_name'
            name='legal_name'
            control={control}
            fullWidth
            error={errors?.legal_name}
            placeholder={t('Юридическое название')}
            required
            defaultValue={clientData?.legal_name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Юридический адрес')}</Label>

          <TextField
            id='last-legal_address'
            name='legal_address'
            control={control}
            required
            fullWidth
            error={errors?.legal_address}
            placeholder={t('Юридический адрес')}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('ИНН компании')}</Label>

          <TextField
            id='client-company_inn'
            name='company_inn'
            control={control}
            fullWidth
            error={errors?.company_inn}
            placeholder={t('ИНН компании')}
            required
            defaultValue={clientData?.company_inn || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Компания МФО ')}</Label>

          <TextField
            id='last-company_mfo'
            name='company_mfo'
            control={control}
            required
            fullWidth
            error={errors?.company_mfo}
            placeholder={t('Компания МФО ')}
            asteriks
          />
        </Grid>
      </Grid>
    </Box>
  )
}
