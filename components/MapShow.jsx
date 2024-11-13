import { Box, Container, IconButton, TextField } from '@mui/material'
import { useRef } from 'react'
import { Map, Placemark, YMaps } from 'react-yandex-maps'
import driverMarkIcon from '../src/assets/icons/marks/driver_mark.svg'
import shopMarkIcon from '../src/assets/icons/marks/shop_mark.svg'
import receiverMarkIcon from '../src/assets/icons/marks/receiver_mark.svg'
import Reload from '../src/assets/icons/Reload'

export default function MapShow({ name, height, points: referencePoints, refetchData, onlyTwoPoint }) {
  const mapRef = useRef()
  const ymaps = useRef(null)

  const addRoute = (e_ymaps) => {
    ymaps.current = e_ymaps

    const multiRoute = new e_ymaps.multiRouter.MultiRoute(
      {
        referencePoints: referencePoints,
        params: { ...(!onlyTwoPoint && { viaIndexes: [1] }), routingMode: 'auto', mapStateAutoApply: true },
      },
      {
        routeActiveStrokeWidth: 4,
        routeActiveStrokeStyle: 'solid',
        routeActiveStrokeColor: '#119676',
        boundsAutoApply: true,
      }
    )
    var wayPoints = multiRoute.getWayPoints()

    wayPoints.options.set({
      iconLayout: 'default#image',
      iconImageHref: '',
    })

    mapRef.current.geoObjects.add(wayPoints)
    mapRef.current.geoObjects.add(multiRoute)
  }

  return (
    <Container>
      <Box overflow='hidden' borderRadius={4} boxShadow='0 0 64px rgba(0, 0, 0, 0.08)' mt={1.5} position='relative' height={height || 500}>
        <Box ml={1} width='calc(100% - 16px)' zIndex={1} position='absolute'>
          <Box position='relative' mt={1}>
            <TextField disabled={true} sx={{ boxShadow: '0 0 64px rgba(0, 0, 0, 0.45)', borderRadius: 4 }} white value={name} uncontrolled fullWidth />
            {refetchData && (
              <IconButton
                onClick={refetchData}
                sx={{ p: '1px', borderRadius: 4, position: 'absolute', zIndex: 12, top: 4, right: 4, svg: { fill: 'transparent' } }}
              >
                <Reload />
              </IconButton>
            )}
          </Box>
        </Box>
        <YMaps query={{ load: 'package.full', apikey: import.meta.env.VITE_YANDEX_MAPS_KEY }}>
          <Map
            instanceRef={mapRef}
            state={{ center: referencePoints[0], zoom: 13.5 }}
            zoom={15}
            onLoad={addRoute}
            width='100%'
            height='100%'
            modules={['control.ZoomControl']}
          >
            <Placemark
              geometry={referencePoints[0]}
              options={{
                iconImageSize: [43, 43],
                draggable: false,
                iconLayout: 'default#image',
                iconImageHref: driverMarkIcon,
                hideIconOnBalloonOpen: true,
                openEmptyHint: true,
              }}
              properties={{ iconContent: '', hintContent: name || '' }}
            />
            {!onlyTwoPoint && (
              <Placemark
                geometry={referencePoints[1]}
                options={{
                  iconImageSize: [43, 43],
                  draggable: false,
                  iconLayout: 'default#image',
                  iconImageHref: shopMarkIcon,
                  hideIconOnBalloonOpen: true,
                  openEmptyHint: true,
                }}
                properties={{ iconContent: '', hintContent: name || '' }}
              />
            )}
            <Placemark
              geometry={onlyTwoPoint ? referencePoints[1] : referencePoints[2]}
              options={{
                iconImageSize: [43, 43],
                draggable: false,
                iconLayout: 'default#image',
                iconImageHref: receiverMarkIcon,
                hideIconOnBalloonOpen: true,
                openEmptyHint: true,
              }}
              properties={{ iconContent: '', hintContent: name || '' }}
            />
          </Map>
        </YMaps>
      </Box>
    </Container>
  )
}
