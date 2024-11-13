import { Box } from '@mui/material'
import ProductImagePlaceholder from '../../../src/assets/icons/ProductImagePlaceholder'
import getImageUrl from '../../../utils/getImageUrl'

export default function ImageCell({ imageArr, rowIndex, setImages, width, height }) {
  if (!imageArr?.length && !Array.isArray(imageArr)) {
    return null
  }
  return (
    <Box
      sx={{
        position: 'relative',
        width: width || '48px',
        height: height || '48px',
        borderRadius: 2,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {imageArr?.[0] ? (
        <img
          id={`image-${rowIndex || 1}`}
          src={getImageUrl(imageArr?.[0])}
          alt={''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <ProductImagePlaceholder />
      )}
      {imageArr?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: imageArr?.[0]?.includes('avatar') ? '50%' : 2,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'green.600',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => {
            if (imageArr?.length && Array.isArray(imageArr)) {
              setImages({ data: imageArr })
            }
          }}
        />
      )}
    </Box>
  )
}
