import { Box } from '@mui/material'
import { useMemo } from 'react'
import { Map, ObjectManager, Polyline, YMaps } from 'react-yandex-maps'

const center = [41.31123758475188, 69.27976554916285]

export default function UsersLocationsMap({ mapInfo }) {
  console.log('mapInfo', mapInfo)

  const objectManagerDestination = mapInfo?.map((el, ind) => ({
    type: 'Feature',
    id: ind,
    geometry: { type: 'Point', coordinates: [el?.location?.lat || 0, el?.location?.long || 0] },
    properties: {
      balloonContent: 'user_id ' + (el?.userId || 'id'),
      clusterCaption: 'Another one placemark',
      hintContent: el?.location?.name || 'location name',
    },
  }))

  console.log('objectManagerDestination', objectManagerDestination)

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='100%'
      position='relative'
      minHeight={540}
      sx={(theme) => ({ px: 3, py: 2.5, boxShadow: theme.boxShadow['16-8'], borderRadius: 6 })}
    >
      <YMaps minHeight={540} id='yandex' query={{ load: 'package.full', apikey: '7c2347e1-8b10-40d1-b739-a606f5d36f67' }}>
        <Map width='100%' height={540} defaultState={{ center: center, zoom: 10 }}>
          {objectManagerDestination?.length > 0 && (
            <ObjectManager
              id='objectManagerDestination'
              options={{ clusterize: true, gridSize: 1000 }}
              objects={{ openBalloonOnClick: true, preset: 'islands#blueDotIcon' }}
              clusters={{ preset: 'islands#blueClusterIcons' }}
              features={objectManagerDestination}
              defaultFeatures={objectManagerDestination}
              modules={['objectManager.addon.objectsBalloon', 'objectManager.addon.objectsHint']}
            />
          )}
        </Map>
      </YMaps>
    </Box>
  )
}
