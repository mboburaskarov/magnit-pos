import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import ArrowDown from '../src/assets/icons/ArrowDown'
import BackArrowIcon from '../src/assets/icons/BackArrow'
import ZipIcon from '../src/assets/icons/ZipIcon'
import downloadImage from '../utils/downloadImage'
import downloadZip from '../utils/downloadZip'
import getImageUrl from '../utils/getImageUrl'
import CustomImg from './CustomImg'
import StyledTooltip from './StyledTooltip'

const ImageGallery = ({ open, setOpen, imagesArr, name }) => {
  const [count, setCount] = useState(0)
  if (!imagesArr?.length) {
    return null
  }
  const currentImageUrl = getImageUrl(imagesArr[count])
  if (!currentImageUrl) {
    console.error('Image URL is undefined or invalid')
    return null
  }
  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        overflow: 'hidden',
        transition: 'opacity .2s ease-in-out',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        columnGap: 4,
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (e.currentTarget === e.target) {
          setOpen(false)
          setCount(0)
        }
      }}
      style={{ opacity: open ? '1' : '0', zIndex: open ? 2000 : -1 }}
    >
      <Box position='relative' display='flex' alignItems='center' flexDirection='column'>
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: 'white', mb: 5 }}>
          <Typography fontSize={20} variant='span' color='white'>
            Фото {name || 'продукта'}:
          </Typography>
          {count + 1}{' '}
          <Typography fontSize={20} variant='span' color='white'>
            из{' '}
          </Typography>
          {imagesArr?.length || 1}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '560px',
            height: '560px',
            background: 'transparent',
            userSelect: 'none',
            borderRadius: '16px',
            backgroundImage: `url(${getImageUrl(imagesArr?.[count])})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 'inherit',
            },
          }}
        >
          <CustomImg style={{ backdropFilter: 'blur(3px)' }} src={getImageUrl(imagesArr?.[count])} alt='image of order' />
        </Box>
        <IconButton
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: '50%',
            left: -100,
            height: 48,
            width: 48,
            padding: 0,

            '& svg': {
              marginLeft: '-2px',
            },
          }}
          onClick={() =>
            setCount((prev) => {
              if (prev <= 0) return imagesArr?.length - 1
              return prev - 1
            })
          }
        >
          <BackArrowIcon style={{ fill: '#000' }} width={12} height={12} />
        </IconButton>
        <IconButton
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: '50%',
            transform: 'rotate(180deg)',
            right: -100,
            height: 48,
            width: 48,
            padding: 0,
            '& svg': {
              marginLeft: '-2px',
            },
          }}
          onClick={() =>
            setCount((prev) => {
              if (prev + 1 >= imagesArr?.length) return 0
              return prev + 1
            })
          }
        >
          <BackArrowIcon style={{ fill: '#000' }} fill='#000' width={12} height={12} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, userSelect: 'none', mt: 3 }}>
          {imagesArr?.length !== 0 &&
            imagesArr?.map((image, idx) => (
              <Box
                key={image?.id}
                sx={{
                  img: {
                    width: count === idx ? 72 : 56,
                    height: count === idx ? 72 : 56,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    transition: 'width .2s ease',
                  },
                }}
                onClick={() => setCount(idx)}
                alt=''
              >
                <CustomImg src={getImageUrl(image)} alt='image of order' />
              </Box>
            ))}
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, bottom: 40, right: 32 }}>
        <StyledTooltip placement='top' title='Скачать фото'>
          <IconButton onClick={() => downloadImage(imagesArr[count])}>
            <ArrowDown style={{ fill: '#000' }} width={18} height={18} />
          </IconButton>
        </StyledTooltip>
        {imagesArr?.length > 1 && (
          <StyledTooltip placement='top' title='Скачать все'>
            <IconButton onClick={() => downloadZip(imagesArr, `Photo: ${count}`)}>
              <ZipIcon fill='#119676' width={18} height={18} />
            </IconButton>
          </StyledTooltip>
        )}
      </Box>
    </Box>
  )
}

export default ImageGallery
