import { Box, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'

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
  const { control, errors, setValue, register, reset, watch } = useFormContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (get(openDrawer, 'mode') === 'edit') {
      setValue('name', get(openDrawer, 'data.name'))
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
            required
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Адрес'}</Label>

          <TextField id='last-name' name='address' control={control} required fullWidth error={errors?.address} placeholder={'Адрес'} asteriks />
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
            required
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
            required
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
            required
            type={'number'}
            defaultValue={clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Локация'}</Label>

          <TextField id='last-name' name='location' control={control} required fullWidth error={errors?.location} placeholder={'Локация'} asteriks />
        </Grid>
      </Grid>
    </Box>
  )
}
