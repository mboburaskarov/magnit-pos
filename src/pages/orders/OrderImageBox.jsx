import { Box } from '@mui/material'
import ImagePlaceholder from '../../assets/icons/ImagePlaceholder'
import getImageUrl from '../../../utils/getImageUrl'

export default function OrderImageBox({ url, count = 0, setOpenCompareGallery, small }) {
  const BOX_HEIGHT = small ? 72 : 164
  const BOX_WIDTH = small ? 72 : 128

  return (
    <Box
      onClick={() => url && count && setOpenCompareGallery(true)}
      sx={{
        position: 'relative',
        height: BOX_HEIGHT,
        width: BOX_WIDTH,
        mt: small ? 0 : 3.5,

        '&:hover': url &&
          count && {
            transition: 'all 0.2s ease-in-out',
            '#background': { opacity: 0.4 },
            '#countBox': { right: 4, top: 4 },
            '#compareBtn': { height: 40, opacity: 1 },
          },
        cursor: 'pointer',
        img: {
          borderRadius: 4,
          objectFit: 'cover',
          zIndex: 2,
        },
      }}
    >
      {count !== 0 && !small && (
        <Box
          id='countBox'
          sx={{
            position: 'absolute',
            top: -14,
            right: -14,
            bgcolor: 'green.600',
            color: 'white',
            width: 32,
            height: 32,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            zIndex: 2,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {count}
        </Box>
      )}
      <Box
        id='background'
        sx={{
          transition: 'all 0.2s ease-in-out',
          position: 'absolute',
          top: 0,
          right: 0,
          bgcolor: 'green.600',
          color: 'white',
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
          borderRadius: 4,
          opacity: 0,
          zIndex: 1,
        }}
      />
      {url ? <img src={getImageUrl(url)} alt={`image of ${url || 'order'}`} width={BOX_WIDTH} height={BOX_HEIGHT} /> : <ImagePlaceholder small={small} />}

      {url && !small && (
        <Box
          id='compareBtn'
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'green.600',
            color: 'white',
            width: BOX_WIDTH,
            height: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '0 0 16px 16px',
            zIndex: 2,
            opacity: 0,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Сравнить
        </Box>
      )}
    </Box>
  )
}
