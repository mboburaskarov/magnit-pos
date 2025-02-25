import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputSwitchNew from '../../../../components/Inputs/InputSwitch'
import InputPhone from '../../../../components/Inputs/PhoneNumber'
import LazySelect from '../../../../components/Select/LazySelect'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useQuery } from 'react-query'
import InputDatePicker from '../../../../components/Inputs/InputDatePicker'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import getOptionsSchema from '../../../../utils/getOptionsSchema'

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
  const { data: employeeInfo, refetch: refetemployeeInfo } = useQuery(
    ['employeeInfo', openDrawer],
    () => requests.getSingleVendor(get(openDrawer, 'id', 'no')),
    { enabled: !!get(openDrawer, 'id', false) }
  )
  const mode = openDrawer?.mode
  const { control, errors, setValue } = useFormContext()
  const { t } = useTranslation()
  useEffect(() => {
    refetemployeeInfo
  }, [openDrawer])
  useEffect(() => {
    if (mode === 'edit') {
      setValue('first_name', get(employeeInfo, 'data.data.first_name'))
      setValue('last_name', get(employeeInfo, 'data.data.last_name'))
      setValue('phone', get(employeeInfo, 'data.data.phone', '').replace('998', ''))
      get(employeeInfo, 'data.data.birthdate', false) && setValue('date_of_birth', new Date(get(employeeInfo, 'data.data.birthdate')))
      setValue('gender', get(employeeInfo, 'data.data.gender'))
      setValue('role', getOptionsSchema(get(employeeInfo, 'data.data.roles', []), false, 'name'))
      setValue('store_id', getOptionsSchema(get(employeeInfo, 'data.data.store', []), Object, 'name'))
    }
  }, [employeeInfo])

  return (
    <Box mt={'24px'}>
      <Typography fontSize={'20px'} lineHeight={'32px'} mb='24px' fontWeight={'600'} color={'#000'}>
        {t('profile')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('first_name')}</Label>

          <TextField
            id='client-name'
            name='first_name'
            control={control}
            fullWidth
            error={errors?.first_name}
            placeholder={t('first_name.placeholder')}
            required
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('last_name')}</Label>

          <TextField id='last-name' name='last_name' control={control} required fullWidth error={errors?.last_name} placeholder={t('last_name')} asteriks />
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
            defaultValue={get(employeeInfo, 'data.data.phone', '').replace('998', '')}
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
              {t('password')}
            </Label>
          </Box>
          <TextField
            id='password'
            name='password'
            control={control}
            fullWidth
            required={mode === 'edit' ? false : true}
            error={errors?.password}
            placeholder={t('Введите пароль')}
            defaultValue={clientData ? clientData.last_name : ''}
            asteriks
          />
        </Grid>
      </Grid>

      <Box mb={4} />
      <Typography fontSize={'20px'} lineHeight={'32px'} mb='24px' fontWeight={'600'} color={'#000'}>
        Магазин и роли
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('branch')}</Label>
          <LazySelect
            slug='users'
            id='store'
            name='store_id'
            isMulti={false}
            placeholder={t('Выберите Магазин')}
            minWidth='auto'
            isClearable={true}
            request={requests.getAllStores}
            filters={{ limit: 10 }}
            control={control}
            // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
            // uncontrolled
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            filterOption={() => true}
          />
          {/* <SelectSimple
            placeholder={t('store.placeholder')}
            disabled={false}
            white
            required
            isClearable={false}
            options={get(storesList, 'data.data.data')}
            name='store'
          /> */}
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('role')}</Label>
          <LazySelect
            slug='role'
            id='role'
            name='role'
            isMulti={true}
            placeholder={t('role.placeholder')}
            minWidth='auto'
            isClearable={true}
            request={requests.getAllRoles}
            filters={{ limit: 10 }}
            control={control}
            // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
            // uncontrolled
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            filterOption={() => true}
          />
          {/* <SelectSimple
            required
            placeholder={t('role.placeholder')}
            disabled={false}
            white
            isMulti
            isClearable={false}
            options={get(rolesList, 'data.data.data', []).map((el) => ({ value: el.id, name: el.name, id: el.id }))}
            name='role'
          /> */}
        </Grid>
      </Grid>

      <Box mb={4} />
      <Typography fontSize={'20px'} lineHeight={'32px'} mb='24px' fontWeight={'600'} color={'#000'}>
        Дополнительная информация
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('birthdate')}</Label>
          <InputDatePicker noMarginTop name='date_of_birth' error={errors?.date_of_birth} required id='birth-Date' showYearDropdown placeholder='yyyy/oo/kk' />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('gender')}</Label>

          <InputSwitchNew
            id='client-gender'
            noMarginTop
            required
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
    </Box>
  )
}
