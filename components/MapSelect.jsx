import { Box, Container, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import { requests } from '../utils/requests'
import { useQuery } from 'react-query'
import TextField from './Inputs/TextField'
import Label from './Label'
import useDeepCompareEffect from '../src/hooks/useDeepCompareEffect'

const center = [41.31123758475188, 69.27976554916285]

export default function MapSelect({ label, onChange, defaultValue, onlyShow, height }) {
  const placemarkRef = useRef()
  const mapRef = useRef()
  const ymaps = useRef(null)

  const [addressSearch, setAddressSearch] = useState('')
  const [newCoords, setNewCoords] = useState(defaultValue || center)
  const [addressData, setAddressData] = useState(null)

  const { data: addressList, refetch } = useQuery('addressList', () =>
    requests.findAddressFromYandex(
      {
        ...(addressSearch && { geocode: addressSearch }),
        ll: '69.279729,41.311153',
        spn: '10,10',
        format: 'json',
        apikey: import.meta.env.VITE_YANDEX_MAPS_KEY,
      },
      { enabled: addressSearch && !onlyShow }
    )
  )
  useEffect(() => {
    if (!onlyShow && !!addressSearch) {
      refetch()
    }
  }, [addressSearch])

  const formattedAddressList = addressList?.data?.response?.GeoObjectCollection?.featureMember?.map((el) => ({ ...el.GeoObject })) || []

  useEffect(() => {
    if (!onlyShow && addressData) {
      onChange(addressData)
    }
  }, [addressData])

  useDeepCompareEffect(() => {
    if (!onlyShow && defaultValue) {
      onChange({ name: 'Название местоположения', points: defaultValue })
    }
  }, [defaultValue])

  return (
    <>
      {label && <Label mt={2}>{label}</Label>}
      <Container>
        <Box overflow='hidden' borderRadius={4} boxShadow='0 0 64px rgba(0, 0, 0, 0.08)' mt={1.5} position='relative' height={height || 500}>
          <Box ml={1} width='calc(100% - 16px)' zIndex={1} position='absolute'>
            <Box position='relative' mt={1} display='flex' columnGap={3} width='100%'>
              <TextField
                disabled={onlyShow}
                sx={{ boxShadow: '0 0 64px rgba(0, 0, 0, 0.45)', borderRadius: 4 }}
                white
                value={!addressData ? addressSearch : addressData?.name}
                setValue={(value) => setAddressSearch(value)}
                onBoxClick={() => {
                  if (addressData) {
                    setAddressData(null)
                  }
                }}
                uncontrolled
                required
                fullWidth
                placeholder='Например: Ташкент, улица Ниёзбек Ёли, 22a'
              />
              <Box
                display={addressSearch ? 'block' : 'none'}
                position='absolute'
                top={72}
                left={0}
                right={0}
                zIndex={1}
                width='100%'
                maxHeight={256}
                bgcolor='common.white'
                boxShadow='0 0 64px rgba(0, 0, 0, 0.08)'
                py={1.5}
                borderRadius={4}
                sx={{ overflowY: 'auto' }}
              >
                {formattedAddressList?.length === 0 && (
                  <Box
                    display='flex'
                    alignItems='center'
                    width='100%'
                    py={1}
                    px={3}
                    color='grey.600'
                    fontFamily='Gilroy'
                    fontWeight={600}
                    fontSize={16}
                    lineHeight='20px'
                  >
                    Адрес не найден
                  </Box>
                )}
                {formattedAddressList.map((item, i) => (
                  <Box
                    key={i}
                    display='flex'
                    alignItems='center'
                    width='100%'
                    py={2}
                    px={3}
                    color='grey.600'
                    fontFamily='Gilroy'
                    fontWeight={600}
                    fontSize={16}
                    lineHeight='20px'
                    onClick={() => {
                      const points = [Number(item?.Point?.pos?.split(' ')[1]), Number(item?.Point?.pos?.split(' ')[0])]
                      setAddressData({ name: item.name, points: points })
                      setNewCoords(points)
                      mapRef.current.setCenter(points)
                      mapRef.current.setZoom(18)
                      setAddressSearch('')
                    }}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    {item.name}{' '}
                    <Typography ml={1} color='grey.400'>
                      ({item.description})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <YMaps query={{ load: 'package.full', apikey: import.meta.env.VITE_YANDEX_MAPS_KEY }}>
            <Map
              instanceRef={mapRef}
              state={{ center: newCoords, zoom: 16, controls: ['zoomControl'] }}
              zoom={15}
              onLoad={(e) => {
                ymaps.current = e

                e.geocode(newCoords).then((res) => {
                  const firstGeoObject = res.geoObjects.get(0)
                  const newAddress = [
                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                    firstGeoObject.getPremiseNumber(),
                  ]
                    .filter(Boolean)
                    .join(', ')

                  setAddressData({ name: newAddress, points: defaultValue || center })
                })
              }}
              width='100%'
              height='100%'
              modules={['control.ZoomControl']}
              onClick={(event) => {
                if (!onlyShow) {
                  const points = event.get('coords')
                  setNewCoords(() => points)

                  ymaps.current.geocode(points).then((res) => {
                    const firstGeoObject = res.geoObjects.get(0)
                    const newAddress = [
                      firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                      firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                      firstGeoObject.getPremiseNumber(),
                    ]
                      .filter(Boolean)
                      .join(', ')
                    placemarkRef.current.getMap().hint.open(points, newAddress)
                    setAddressData({ name: newAddress, points: points })
                  })
                }
              }}
            >
              <Placemark
                instanceRef={placemarkRef}
                disabled={onlyShow}
                onDragEnd={() => {
                  if (!onlyShow) {
                    const points = placemarkRef.current.geometry._coordinates
                    setNewCoords(() => points)
                    ymaps.current.geocode(points).then((res) => {
                      const firstGeoObject = res.geoObjects.get(0)
                      const newAddress = [
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                        firstGeoObject.getPremiseNumber(),
                      ]
                        .filter(Boolean)
                        .join(', ')
                      placemarkRef.current.getMap().hint.open(points, newAddress)
                      if (!onlyShow) setAddressData({ name: newAddress, points: points })
                    })
                  }
                }}
                geometry={newCoords}
                options={{
                  iconImageSize: [30, 30],
                  draggable: true,
                  preset: 'islands#greenIcon',
                  hideIconOnBalloonOpen: false,
                  openEmptyHint: true,
                }}
                properties={{
                  iconContent: '',
                  hintContent: addressData?.name || '',
                }}
              />
            </Map>
          </YMaps>
        </Box>
      </Container>
    </>
  )
}
