import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputSwitchNew from '../../../../components/Inputs/InputSwitch'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useQuery } from 'react-query'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
import LazySelect from '../../../../components/Select/LazySelect'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'

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
  const { data: employeeInfo, refetch: refetemployeeInfo } = useQuery(
    ['employeeInfo', openDrawer],
    () => requests.getSingleCashBox(get(openDrawer, 'id', 'no')),
    { enabled: Boolean(openDrawer) }
  )
  const mode = openDrawer?.mode
  const { control, errors, setValue } = useFormContext()
  const { t } = useTranslation()
  useEffect(() => {
    refetemployeeInfo
  }, [openDrawer])
  useEffect(() => {
    if (mode === 'edit') {
      setValue('name', get(employeeInfo, 'data.data.name'))
      setValue('is_enable', get(employeeInfo, 'data.data.is_enable') ? 'active' : 'inactive')
      setValue('store', {
        id: get(employeeInfo, 'data.data.store.id'),
        name: get(employeeInfo, 'data.data.store.name'),
      })
    }
  }, [employeeInfo])
  // const { data: storesList } = useQuery('storesList', () => requests.getAllShops({ limit: 20, offset: 0 }))

  return (
    <Box mt={'24px'}>
      <Label mb='4px'>{t('name')}</Label>

      <TextField
        id='client-name'
        name='name'
        control={control}
        fullWidth
        error={errors?.name}
        placeholder={t('name.placeholder')}
        required
        defaultValue={clientData?.name || ''}
        asteriks
      />

      <Box mb={4} />

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('branch')}</Label>
          <LazySelect
            slug='users'
            id='store'
            name='store'
            isMulti={false}
            placeholder={'Выберите клиент'}
            minWidth='auto'
            isClearable={false}
            request={requests.getAllShops}
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
          <Label mb='4px'>{t('status')}</Label>

          <InputSwitchNew
            id='client-gender'
            noMarginTop
            required
            name='is_enable'
            control={control}
            // defaultValue='inactive'
            error={errors?.is_enable}
            options={[
              {
                title: 'Активный',
                value: 'active',
              },
              {
                title: 'Неактивный',
                value: 'inactive',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
