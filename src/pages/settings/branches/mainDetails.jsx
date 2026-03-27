import { Box, Button, Grid, InputAdornment, Typography } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useState, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactInputMask from 'react-input-mask'
import InputSwitchNew from '@components/Inputs/InputSwitch'
import InputPhone from '@components/Inputs/PhoneNumber'
import TextField from '@components/Inputs/TextField'
import Label from '@components/Label'
import LazySelect from '@components/Select/LazySelect'
import { requests } from '@utils/requests'
import OutLineTextField from '@components/Inputs/OutLineTextField'
import { LocationEditIcon } from 'lucide-react'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import { YMaps, Map, Placemark } from 'react-yandex-maps'

export default function MainDetails({ openDrawer }) {
  const { control, errors, setValue, reset, getValues, watch } = useFormContext()
  const { t } = useTranslation()
  const [openLocationModal, setOpenLocationModal] = useState(false)
  const [time, setDate] = useState('08:00 - 23:00')
  const [selectedCoords, setSelectedCoords] = useState(null)
  const [mapCenter, setMapCenter] = useState([41.31123758475188, 69.27976554916285])
  const [fixedMarkerCoords, setFixedMarkerCoords] = useState([41.31123758475188, 69.27976554916285])
  const [mapLoading, setMapLoading] = useState(true)
  const mapRef = useRef()
  const placemarkRef = useRef()

  const handleMapClick = (event) => {
    const coords = event.get('coords')
    setFixedMarkerCoords(coords)
    setSelectedCoords(coords)
  }
  useEffect(() => {
    if (get(openDrawer, 'mode') === 'edit') {
      setValue('name', get(openDrawer, 'data.name'))
      setValue('detailed_name', get(openDrawer, 'data.detailed_name'))

      setValue('location', get(openDrawer, 'data.location'))
      setValue('employee_count', get(openDrawer, 'data.employee_count'))
      setValue('cash_box_count', get(openDrawer, 'data.cash_box_count'))
      setValue('store_code', get(openDrawer, 'data.store_code'))
      setValue('address', get(openDrawer, 'data.address'))
      setValue('inn', get(openDrawer, 'data.inn'))

      setValue('work-time', get(openDrawer, 'data.work_hours'))
      setValue('time-type', get(openDrawer, 'data.work_hours') == '24' ? '24' : 'range')

      setDate(get(openDrawer, 'work_hours'))

      // Set existing coordinates if available
      const existingCoords = get(openDrawer, 'data.location')
      if (existingCoords) {
        const coords = existingCoords.split(',').map(Number)
        setFixedMarkerCoords(coords)
        setSelectedCoords(coords)
        setMapCenter(coords)
      }
    } else {
      reset()
    }
  }, [openDrawer])
  useEffect(() => {
    setDate('00:00 - 00:00')
    setValue('time-type', getValues('time-type'))
  }, [watch('time-type')])
  useEffect(() => {
    setValue('work-time', time)
  }, [time])

  useEffect(() => {
    if (openLocationModal) {
      setMapLoading(true)
    }
  }, [openLocationModal])

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
            required={true}
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <Label mb='4px'>{'ИНН'}</Label>

          <TextField
            id='inn'
            type={'number'}
            name='inn'
            control={control}
            fullWidth
            error={errors?.inn}
            placeholder={'ИНН'}
            asteriks
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

          <OutLineTextField
            id='last-name'
            name='location'
            endAdornment={
              <InputAdornment position='end' sx={{ cursor: 'pointer', mr: '4px' }} onClick={() => setOpenLocationModal(true)}>
                <LocationEditIcon />
              </InputAdornment>
            }
            control={control}
            fullWidth
            error={errors?.location}
            placeholder={'Локация'}
            asteriks
          />
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

      <StyledEmptyDialog onClose={() => setOpenLocationModal(false)} open={!!openLocationModal} setOpen={setOpenLocationModal} title='Выберите локацию'>
        <Box width='100%' height='400px' position='relative'>
          {mapLoading && (
            <Box
              position='absolute'
              top={0}
              left={0}
              right={0}
              bottom={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              bgcolor='white'
              zIndex={1}
            >
              <Typography>Загрузка карты...</Typography>
            </Box>
          )}
          <YMaps query={{ load: 'package.full', apikey: import.meta.env.VITE_YANDEX_MAPS_KEY }}>
            <Map
              instanceRef={mapRef}
              state={{ center: mapCenter, zoom: 16 }}
              width='100%'
              height='100%'
              modules={['control.ZoomControl']}
              onClick={handleMapClick}
              onLoad={() => setMapLoading(false)}
            >
              <Placemark
                instanceRef={placemarkRef}
                geometry={fixedMarkerCoords}
                options={{
                  iconImageSize: [30, 30],
                  draggable: false,
                  preset: 'islands#redIcon',
                  hideIconOnBalloonOpen: false,
                }}
              />
            </Map>
          </YMaps>
        </Box>
        <Box display='flex' gap={2} mt={2} padding={'10px 20px'}>
          <Button
            sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
            fullWidth
            color='secondary'
            variant='contained'
            onClick={() => setOpenLocationModal(null)}
          >
            Отмена
          </Button>
          <Button
            fullWidth
            variant='contained'
            type='button'
            loading={false}
            onClick={() => {
              const coords = selectedCoords || fixedMarkerCoords
              if (coords) {
                setValue('coordinates', `${coords[0]},${coords[1]}`)
                setValue('location', `${coords[0].toFixed(6)},${coords[1].toFixed(6)}`)
              }
              setOpenLocationModal(null)
            }}
          >
            Подтверждать
          </Button>
        </Box>
      </StyledEmptyDialog>
    </Box>
  )
}
