import { Box } from '@mui/material'
import { Map, ObjectManager, YMaps } from 'react-yandex-maps'
import shopMarkIcon from '../../assets/icons/marks/shop_mark.svg'

const center = [41.31123758475188, 69.27976554916285]

export default function DashboardVendorsMap({ vendorsData }) {
  const objectManagerFeatures = vendorsData?.map((el, ind) => ({
    type: 'Feature',
    id: ind,
    geometry: { type: 'Point', coordinates: [el?.location?.lat, el?.location?.long] },
    properties: { balloonContent: el?.location?.name, clusterCaption: 'Another one placemark', hintContent: el?.name },
  }))

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='75%'
      minHeight={540}
      sx={(theme) => ({ px: 3, py: 2.5, border: 0.5, borderColor: '#A4A5AB33', borderRadius: 6 })}
    >
      <YMaps query={{ load: 'package.full' }}>
        <Map width='100%' height='100%' defaultState={{ center: center, zoom: 10 }}>
          <ObjectManager
            options={{ clusterize: true, gridSize: 32 }}
            objects={{ openBalloonOnClick: true, iconImageSize: [43, 43], iconLayout: 'default#image', iconImageHref: shopMarkIcon }}
            clusters={{ preset: 'islands#yellowClusterIcons' }}
            filter={(object) => object.id % 2 === 0}
            defaultFeatures={objectManagerFeatures}
            modules={['objectManager.addon.objectsBalloon', 'objectManager.addon.objectsHint']}
          />
        </Map>
      </YMaps>
    </Box>
  )
}
