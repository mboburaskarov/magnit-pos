import { Box } from '@mui/material'
import { Map, ObjectManager, Polyline, YMaps } from 'react-yandex-maps'

const center = [41.31123758475188, 69.27976554916285]

export default function DeliveryMap({ mapInfo }) {
  const objectManagerSource = mapInfo?.map((el, ind) => ({
    type: 'Feature',
    id: ind,
    geometry: { type: 'Point', coordinates: [el?.source?.lat, el?.source?.long] },
    properties: { balloonContent: 'A-' + 'price: ' + el?.pricing?.price, clusterCaption: 'Another one placemark', hintContent: 'price: ' + el?.pricing?.price },
  }))

  const objectManagerDestination = mapInfo?.map((el, ind) => ({
    type: 'Feature',
    id: ind,
    geometry: { type: 'Point', coordinates: [el?.destination?.lat, el?.destination?.long] },
    properties: {
      balloonContent: 'B-' + 'price: ' + el?.pricing?.price,
      clusterCaption: 'Another one placemark',
      hintContent: 'price: ' + el?.pricing?.price,
    },
  }))

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='100%'
      position='relative'
      minHeight={1080}
      sx={(theme) => ({ px: 3, py: 2.5, boxShadow: theme.boxShadow['16-8'], borderRadius: 6 })}
    >
      <YMaps minHeight={1080} id='yandex' query={{ load: 'package.full', apikey: '7c2347e1-8b10-40d1-b739-a606f5d36f67' }}>
        <Map width='100%' height={1080} defaultState={{ center: center, zoom: 10 }}>
          {objectManagerDestination?.length > 0 && (
            <ObjectManager
              id='objectManagerDestination'
              options={{ clusterize: true, gridSize: 10 }}
              objects={{ openBalloonOnClick: true, preset: 'islands#blueDotIcon' }}
              clusters={{ preset: 'islands#blueClusterIcons' }}
              filter={(object) => object?.id % 2 === 0}
              defaultFeatures={objectManagerDestination}
              features={objectManagerDestination}
              modules={['objectManager.addon.objectsBalloon', 'objectManager.addon.objectsHint']}
            />
          )}
          {objectManagerSource?.length > 0 && (
            <ObjectManager
              id='objectManagerSource'
              options={{ clusterize: true, gridSize: 10 }}
              objects={{ openBalloonOnClick: true, preset: 'islands#redDotIcon' }}
              clusters={{ preset: 'islands#redClusterIcons' }}
              filter={(object) => object?.id % 2 === 0}
              defaultFeatures={objectManagerSource}
              features={objectManagerSource}
              modules={['objectManager.addon.objectsBalloon', 'objectManager.addon.objectsHint']}
            />
          )}

          {mapInfo?.map((el) => (
            <Polyline
              id={el.id}
              geometry={[
                [el?.source?.lat, el?.source?.long],
                [el?.destination?.lat, el?.destination?.long],
              ]}
              options={{
                balloonCloseButton: false,
                strokeColor: '#000',
                strokeWidth: 2,
                strokeOpacity: 0.1,
                hintContent: 'lalal',
                openHintHover: true,
              }}
            />
          ))}
        </Map>
      </YMaps>
    </Box>
  )
}
