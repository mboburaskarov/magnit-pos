import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import StyledTooltip from './StyledTooltip'
import ArrowDown from '../src/assets/icons/ArrowDown'
import ZipIcon from '../src/assets/icons/ZipIcon'
import downloadImage from '../utils/downloadImage'
import downloadZip from '../utils/downloadZip'
import getImageUrl from '../utils/getImageUrl'
import { error } from '../utils/toast'

const OneSideOfCompare = ({ imagesArr = [], right, backgroundBlack }) => {
  if (!Array.isArray(imagesArr) || imagesArr.length === 0) return null
  const [count, setCount] = useState(0)

  return (
    <>
      <Box position='relative' display='flex' alignItems='center' flexDirection='column'>
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: backgroundBlack ? 'common.white' : 'green.600', mb: 5 }}>
          <Typography fontSize={20} variant='span' color={backgroundBlack ? 'common.white' : 'grey.600'}>
            {right ? 'Фото продукта: ' : 'Фото заказа: '}
          </Typography>
          {count + 1}{' '}
          <Typography fontSize={20} variant='span' color={backgroundBlack ? 'common.white' : 'grey.600'}>
            из{' '}
          </Typography>
          {imagesArr.length}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '560px',
            height: '560px',
            background: 'transparent',
            userSelect: 'none',
            borderRadius: '16px',
            backgroundImage: imagesArr[count] ? `url(${getImageUrl(imagesArr[count])})` : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%, 100%',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 'inherit',
            },
          }}
        >
          {imagesArr[count] && <img style={{ backdropFilter: 'blur(3px)' }} src={getImageUrl(imagesArr[count])} alt='image of order' />}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, userSelect: 'none', mt: 3 }}>
          {imagesArr.map((image, idx) => (
            <Box
              key={image?.id || idx}
              sx={{
                width: count === idx ? 72 : 56,
                height: count === idx ? 72 : 56,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'width .2s ease',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundImage: image ? `url(${getImageUrl(image)})` : 'none',
              }}
              onClick={() => setCount(idx)}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bottom: 40,
          ...(right && { right: 32 }),
          ...(!right && { left: 32 }),
        }}
      >
        {imagesArr[count] && (
          <StyledTooltip placement='top' title='Скачать фото'>
            <IconButton color='primary' onClick={() => downloadImage(imagesArr[count])}>
              <ArrowDown width={18} height={18} />
            </IconButton>
          </StyledTooltip>
        )}
        {imagesArr.length > 1 && (
          <StyledTooltip placement='top' title='Скачать все'>
            <IconButton color='primary' onClick={() => downloadZip(imagesArr, `Photo: ${count}`)}>
              <ZipIcon width={18} height={18} />
            </IconButton>
          </StyledTooltip>
        )}
      </Box>
    </>
  )
}

const CompareImageGallery = ({ open, setOpen, imagesArr = [], imagesToCompareArr = [], backgroundBlack }) => {
  const hasImages = Array.isArray(imagesArr) && imagesArr.length > 0
  const hasImagesToCompare = Array.isArray(imagesToCompareArr) && imagesToCompareArr.length > 0
  useEffect(() => {
    if(!hasImages && !hasImagesToCompare && open) {
      setOpen(false)
      error('Ошибка при открытии')
    }
  }, [open, hasImages, hasImagesToCompare])
  return (
    <Box
      sx={{
        position: 'fixed',
        display: open ? 'flex' : 'none', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundBlack ? 'rgba(0, 0, 0, .8)' : 'rgba(255, 255, 255, .9)',
        overflow: 'hidden',
        transition: 'opacity .2s ease-in-out',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        columnGap: 4,
        opacity: open ? '1' : '0',
        zIndex: open ? 2000 : -1,
      }}
      onClick={(e) => {
        if (e.currentTarget === e.target) setOpen(false)
      }}
    >
      {hasImages && <OneSideOfCompare backgroundBlack={backgroundBlack} imagesArr={imagesArr} />}
      {hasImagesToCompare && <OneSideOfCompare backgroundBlack={backgroundBlack} right imagesArr={imagesToCompareArr} />}
    </Box>
  )
}

export default CompareImageGallery
