import { Box, Grid } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactInputMask from 'react-input-mask'
import InputSwitchNew from '../../../../components/Inputs/InputSwitch'
import InputPhone from '../../../../components/Inputs/PhoneNumber'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
export default function MainDetails({ clientData, openDrawer }) {
  const { control, errors, setValue, register, reset, getValues, watch } = useFormContext()
  const { t } = useTranslation()
  const [time, setDate] = useState('08:00 - 23:00')
  useEffect(() => {
    if (get(openDrawer, 'mode') === 'edit') {
      setValue('name', get(clientData, 'name'))
      setValue('detailed_name', get(clientData, 'detailed_name'))
      setValue('location', get(clientData, 'location'))
      setValue('employee_count', get(clientData, 'employee_count'))
      setValue('cash_box_count', get(clientData, 'cash_box_count'))
      setValue('store_code', get(clientData, 'store_code'))
      setValue('address', get(clientData, 'address'))

      setValue('work-time', get(clientData, 'work_hours'))
      setValue('time-type', get(clientData, 'work_hours') == '24' ? '24' : 'range')
      setValue('company_id', getOptionsSchema(get(employeeInfo, 'data.data.company_id', []), Object, 'name'))

      setDate(get(clientData, 'work_hours'))
    } else {
      reset()
    }
  }, [clientData, openDrawer])
  useEffect(() => {
    setDate('00:00 - 00:00')
    setValue('time-type', getValues('time-type'))
  }, [watch('time-type')])
  useEffect(() => {
    setValue('work-time', time)
  }, [time])

  return (
    <Box mt={'24px'}>
      <Grid container mb={'20px'} spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Наименование полное')}</Label>

          <TextField
            id='client-detailed_name'
            name='detailed_name'
            control={control}
            fullWidth
            error={errors?.detailed_name}
            placeholder={'Наименование полное'}
            required
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('phone_number')}</Label>

          <InputPhone
            login={false}
            id='phone'
            disabled
            name='phone'
            control={control}
            fullWidth
            boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
            setCountry={({ dial_code }) => setValue('dial_code', dial_code)}
            error={errors?.phone}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('Название')}</Label>

          <TextField id='client-name' name='name' control={control} fullWidth error={errors?.name} placeholder={'Название'} asteriks />
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
        <Grid item xs={12}>
          <Label mb='4px'>{t('Компания')}</Label>
          <LazySelect
            slug='company'
            id='company'
            name='company_id'
            isMulti={false}
            placeholder={t('role.placeholder')}
            minWidth='auto'
            isClearable={true}
            request={requests.getAllCompanies}
            filters={{ limit: 10 }}
            control={control}
            getOptionLabel={(option) => {
              return option.name
            }}
            filterOption={() => true}
          />
        </Grid>
      </Grid>
      <Box height={'20px'} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('В Аптекае код')}</Label>

          <TextField
            id='client-name'
            name='store_code'
            control={control}
            fullWidth
            error={errors?.store_code}
            placeholder={'В Аптекае код'}
            type={'number'}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{'Локация'}</Label>

          <TextField id='last-name' name='location' control={control} fullWidth error={errors?.location} placeholder={'Локация'} asteriks />
        </Grid>
      </Grid>
      <Grid mt={'5px'} container spacing={3}>
        <Grid item xs={6}>
          <Label mb='4px'>{'Режим работа '}</Label>

          <ReactInputMask
            disabled={getValues('time-type') == '24'}
            mask='99:99 - 99:99'
            value={time}
            onChange={(e) => getValues('time-type') !== '24' && setDate(e.target.value)}
            placeholder='HH:MM - HH:MM'
          >
            {(inputProps) => (
              <TextField {...inputProps} setValue={() => {}} id='client-name' name='ranged-time' fullWidth uncontrolled placeholder={'В Аптекае код'} />
            )}
          </ReactInputMask>
        </Grid>
        <Grid item xs={6}>
          <Box height={'25px'} />
          <InputSwitchNew
            id='client-time-type'
            noMarginTop
            name='time-type'
            control={control}
            defaultValue='24'
            error={errors?.gender}
            options={[
              {
                title: '24 часа',
                value: '24',
              },
              {
                title: 'Своботна',
                value: 'range',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
