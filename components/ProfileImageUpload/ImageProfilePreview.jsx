import { Box, Button, CircularProgress, Typography } from '@mui/material'
import getImageUrl from '../../utils/getImageUrl'
import ImageUploadGallery from './ImageUploadGallery'
import { useState } from 'react'
import { useTheme } from '@mui/styles'
import DeleteIcon from '../../src/assets/icons/DeleteIcon'

const ImagePlaceholder = () => {
  const { mode } = useTheme()
  return (
    <svg width='128' height='128' viewBox='0 0 128 128' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='128' height='128' rx='18' fill={mode === 'dark' ? '#404040' : '#F5F5F5'} />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M45.3333 35.3335C46.4378 35.3335 47.3333 36.2289 47.3333 37.3335V61.3335C47.3333 66.4184 47.3375 70.0308 47.7059 72.7712C48.0667 75.4541 48.7431 76.9999 49.8717 78.1284C51.0002 79.257 52.5459 79.9334 55.2288 80.2941C57.9693 80.6626 61.5817 80.6668 66.6666 80.6668H90.6666C91.7712 80.6668 92.6666 81.5623 92.6666 82.6668C92.6666 83.7714 91.7712 84.6668 90.6666 84.6668H84.6666H80.6666H66.5162C61.6155 84.6669 57.7338 84.6669 54.6959 84.2585C51.5694 83.8381 49.0389 82.9525 47.0432 80.9568C45.0476 78.9612 44.162 76.4307 43.7416 73.3042C43.3332 70.2663 43.3332 66.3846 43.3333 61.4839L43.3333 47.3335V43.3335V37.3335C43.3333 36.2289 44.2287 35.3335 45.3333 35.3335Z'
        fill='#119676'
      />
      <path
        opacity='0.5'
        d='M37.3333 47.3335H43.3333V43.3335H37.3333C36.2287 43.3335 35.3333 44.2289 35.3333 45.3335C35.3333 46.4381 36.2287 47.3335 37.3333 47.3335Z'
        fill='#119676'
      />
      <path
        opacity='0.5'
        d='M84.6667 90.6665V84.6665H80.6667V90.6665C80.6667 91.7711 81.5622 92.6665 82.6667 92.6665C83.7713 92.6665 84.6667 91.7711 84.6667 90.6665Z'
        fill='#119676'
      />
      <path
        opacity='0.5'
        d='M72.771 47.7062C70.0306 47.3377 66.4181 47.3335 61.3333 47.3335H53.3333C52.2287 47.3335 51.3333 46.4381 51.3333 45.3335C51.3333 44.2289 52.2287 43.3335 53.3333 43.3335L61.4837 43.3335C66.3844 43.3335 70.2661 43.3334 73.304 43.7419C76.4304 44.1622 78.961 45.0478 80.9566 47.0435C82.9522 49.0391 83.8379 51.5696 84.2582 54.6961C84.6667 57.734 84.6666 61.6157 84.6666 66.5164V66.5164V74.6668C84.6666 75.7714 83.7712 76.6668 82.6666 76.6668C81.562 76.6668 80.6666 75.7714 80.6666 74.6668V66.6668C80.6666 61.582 80.6623 57.9695 80.2939 55.2291C79.9332 52.5462 79.2567 51.0005 78.1282 49.8719C76.9996 48.7433 75.4539 48.0669 72.771 47.7062Z'
        fill='#119676'
      />
      <path
        d='M54.6667 62.6665C54.6667 58.8953 54.6667 57.0096 55.8383 55.8381C57.0099 54.6665 58.8955 54.6665 62.6667 54.6665H65.3334C69.1047 54.6665 70.9903 54.6665 72.1618 55.8381C73.3334 57.0096 73.3334 58.8953 73.3334 62.6665V65.3332C73.3334 69.1044 73.3334 70.99 72.1618 72.1616C70.9903 73.3332 69.1047 73.3332 65.3334 73.3332H62.6667C58.8955 73.3332 57.0099 73.3332 55.8383 72.1616C54.6667 70.99 54.6667 69.1044 54.6667 65.3332V62.6665Z'
        fill='#119676'
      />
    </svg>
  )
}

export default function ImagePreview({
  uploadedImages,
  isUploadingImage,
  onSortEnd,
  setEditingImage,
  setUploadedImages,
  id,
  getInputProps,
  getRootProps,
  height,
  width,
  withoutTextBox,
}) {
  const [openGallery, setOpenGallery] = useState(false)
  const { mode } = useTheme()

  const deleteImage = (image, ind) => {
    setUploadedImages()
  }
  return (
    <Box position='relative'>
      {isUploadingImage && (
        <Box
          sx={{
            bgcolor: '#ffffff90',
            position: 'absolute',
            width: width || 128,
            height: height || 128,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 12px',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <CircularProgress fill='#fff' />
        </Box>
      )}

      {uploadedImages?.key && withoutTextBox ? (
        <Box display={'flex'} width={'100%'} alignItems={'center'}>
          <Box
            sx={{ cursor: 'pointer', '&:hover': { '#upload-img-preview': { transform: 'rotate(0deg) !important' }, img: { transform: 'rotate(0deg)' } } }}
            position='relative'
            width={width || 128}
            height={height || 228}
          >
            {/* <Box
              id='countBox'
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'white',
                color: 'green.600',
                width: 28,
                height: 28,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                fontWeight: 600,
                zIndex: 7,
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {uploadedImages?.length}
            </Box> */}

            {/* <Button
            onClick={(e) => {
              e.stopPropagation()
              setOpenGallery(true)
            }}
            size='small'
            sx={{ position: 'absolute', bottom: 8, left: 8, zIndex: 8, height: 36, borderRadius: 2, width: `calc(${width || 128}px - 16px)` }}
          >
            просмотр
          </Button> */}
            <input id={id} {...getInputProps()} data-test='upload-photo' />

            <Box
              id={`upload-img-preview`}
              sx={{
                transition: 'all 0.2s ease',
                // zIndex: 5 - ind,
                // transform: `rotate(${ind * 10}deg)`,
                img: { objectFit: 'cover', borderRadius: '50%' },
              }}
              position='absolute'
              key={1}
            >
              <img src={getImageUrl(uploadedImages.key)} alt={`image of ${uploadedImages.key || 'product'}`} width={width || 128} height={height || 128} />
            </Box>
          </Box>
          <Button
            sx={{
              width: '156',
              height: '32px',
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'bunker.100',
              mr: '16px',
              ml: '24px',
            }}
            variant='secondary'
            {...getRootProps()}
          >
            <Typography fontWeight={'600'} fontSize={'14px'} lineHeight={'20px'} color={'orange.500'}>
              Rasimni yangilash
            </Typography>
          </Button>
          <Button
            variant='secondary'
            onClick={(e) => {
              e.stopPropagation()
              // setOpenGallery(true)
              deleteImage()
            }}
            id='countBox'
            sx={{
              // position: 'absolute',
              // top: 40,
              // right: 4,
              width: '123px',
              height: '32px',
              bgcolor: 'red.10',
              color: 'green.600',
              display: 'flex',
              padding: '5px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '40px',
              fontWeight: 600,
              zIndex: 7,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <DeleteIcon />{' '}
            <Typography ml={'12px'} fontWeight={'600'} fontSize={'14px'} lineHeight={'20px'} color={'red.700'}>
              O'chirish
            </Typography>
          </Button>
        </Box>
      ) : (
        withoutTextBox && (
          <Box display={'flex'} alignItems={'center'}>
            <Box
              variant='secondary'
              sx={{
                cursor: 'pointer',
                bgcolor: mode === 'dark' ? 'rgb(64, 64, 64)' : 'rgb(245, 245, 245)',
                borderRadius: '50%',
                display: 'flex',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgb(64, 64, 64)' : 'gray.200',
                  '& > svg > rect': { fill: mode === 'dark' ? 'rgb(64, 64, 64)' : '#eaeaea' },
                },
              }}
              {...getRootProps()}
              height={height || 228}
              width={width || 128}
            >
              <input id={id} {...getInputProps()} data-test='upload-photo' />
              <ImagePlaceholder />
            </Box>
            <Button
              sx={{
                width: '156',
                height: '32px',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'bunker.100',
                mr: '16px',
                ml: '24px',
              }}
              variant='secondary'
              {...getRootProps()}
            >
              <Typography fontWeight={'600'} fontSize={'14px'} lineHeight={'20px'} color={'orange.500'}>
                Rasimni yangilash
              </Typography>
            </Button>
          </Box>
        )
      )}

      {uploadedImages?.key && !withoutTextBox ? (
        <Box
          sx={{
            cursor: 'pointer',
            '&:hover': {
              '#upload-img-preview': {
                transform: 'rotate(0deg) !important',
              },
              img: {
                transform: 'rotate(0deg)',
              },
            },
          }}
          position='relative'
          width={width || 128}
          height={height || 128}
        >
          <Box
            id='countBox'
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'white',
              color: 'green.600',
              width: 28,
              height: 28,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              fontWeight: 600,
              zIndex: 7,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {/* {uploadedImages?.length} */}
          </Box>
          <Button onClick={() => setOpenGallery(true)} size='small' sx={{ position: 'absolute', bottom: 8, left: 8, zIndex: 8, height: 36, borderRadius: 2 }}>
            просмотр
          </Button>
          {/* {uploadedImages.slice(0, 3).map((el, ind) => ( */}
          <Box
            id={`upload-img-preview`}
            sx={{
              transition: 'all 0.2s ease',
              zIndex: 5 - ind,
              transform: `rotate(${ind * 10}deg)`,
              img: { objectFit: 'cover', borderRadius: 4, boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 8px', opacity: ind !== 0 ? 0.4 : 1 },
            }}
            position='absolute'
            key={ind}
          >
            <img src={getImageUrl(uploadedImages.key)} alt={`image of ${uploadedImages.key || 'product'}`} width={128} height={128} />
          </Box>
          {/* ))} */}
        </Box>
      ) : (
        !withoutTextBox && (
          <Box>
            <ImagePlaceholder />
          </Box>
        )
      )}

      {/* <ImageUploadGallery
        onSortEnd={onSortEnd}
        setEditingImage={setEditingImage}
        setUploadedImages={setUploadedImages}
        id={id}
        open={openGallery}
        setOpen={setOpenGallery}
        uploadedImages={uploadedImages}
      /> */}
    </Box>
  )
}
