import { Box, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'

export default function MainDetails({ clientData, openDrawer }) {
  const { control, errors, setValue, register, reset, watch } = useFormContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (get(openDrawer, 'mode') === 'edit') {
      setValue('name', get(openDrawer, 'data.name'))
      setValue('detailed_name', get(openDrawer, 'data.detailed_name'))
      setValue('location', get(openDrawer, 'data.location'))
      setValue('employee_count', get(openDrawer, 'data.employee_count'))
      setValue('cash_box_count', get(openDrawer, 'data.cash_box_count'))
      setValue('store_code', get(openDrawer, 'data.store_code'))
      setValue('address', get(openDrawer, 'data.address'))
    } else {
      reset()
    }
  }, [openDrawer])
  return (
    <Box mt={'24px'}>
      <Grid container mb={'20px'} spacing={3}>
        <Grid item xs={12}>
          <Label mb='4px'>{t('Наименование полное')}</Label>

          <TextField
            id='client-detailed_name'
            name='detailed_name'
            control={control}
            fullWidth
            error={errors?.detailed_name}
            placeholder={'Наименование полное'}
            required
            defaultValue={clientData?.detailed_name || ''}
            asteriks
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Название')}</Label>

          <TextField
            id='client-name'
            name='name'
            control={control}
            fullWidth
            error={errors?.name}
            placeholder={'Название'}
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Адрес'}</Label>

          <TextField id='last-name' name='address' control={control} fullWidth error={errors?.address} placeholder={'Адрес'} asteriks />
        </Grid>
      </Grid>
      <Box height={'20px'} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{'Количество сотрудников'}</Label>

          <TextField
            id='client-name'
            name='employee_count'
            control={control}
            fullWidth
            error={errors?.employee_count}
            placeholder={'Количество сотрудников'}
            type={'number'}
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Количество касса'}</Label>

          <TextField
            id='last-name'
            type={'number'}
            name='cash_box_count'
            control={control}
            fullWidth
            error={errors?.cash_box_count}
            placeholder={'Количество касса'}
            asteriks
          />
        </Grid>
      </Grid>
      <Box height={'20px'} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('В магазине код')}</Label>

          <TextField
            id='client-name'
            name='store_code'
            control={control}
            fullWidth
            error={errors?.store_code}
            placeholder={'В магазине код'}
            type={'number'}
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Локация'}</Label>

          <TextField id='last-name' name='location' control={control} fullWidth error={errors?.location} placeholder={'Локация'} asteriks />
        </Grid>
      </Grid>
    </Box>
  )
}
