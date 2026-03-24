import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import getImageUrl from '@utils/getImageUrl'
import BackArrowIcon from '../../src/assets/icons/BackArrow'
import { SortableGallery, SortablePhoto } from './ImageUploadComponents'

const ImageUploadGallery = ({ open, setOpen, uploadedImages, onSortEnd, setEditingImage, setUploadedImages, id }) => {
  const [count, setCount] = useState(0)

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
        if (e.currentTarget === e.target) setOpen(false)
      }}
      style={{ opacity: open ? '1' : '0', zIndex: open ? 200 : -1 }}
    >
      <Box position='relative' display='flex' alignItems='center' flexDirection='column'>
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: 'white', mb: 5 }}>
          <Typography fontSize={20} variant='span' color='white'>
            Фото продукта:
          </Typography>
          {count + 1}{' '}
          <Typography fontSize={20} variant='span' color='white'>
            из{' '}
          </Typography>
          {uploadedImages?.length || 1}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '560px',
            height: '560px',
            background: 'transparent',
            userSelect: 'none',
            borderRadius: '16px',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
            },
          }}
        >
          <img src={getImageUrl(uploadedImages?.[count]?.key)} alt='image of order' />
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
              if (prev <= 0) return uploadedImages?.length - 1
              return prev - 1
            })
          }
        >
          <BackArrowIcon fill='#119676' width={12} height={12} />
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
              if (prev + 1 >= uploadedImages?.length) return 0
              return prev + 1
            })
          }
        >
          <BackArrowIcon fill='#119676' width={12} height={12} />
        </IconButton>

        <Box sx={{ flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, userSelect: 'none', mt: 3 }}>
          <SortableGallery onSortEnd={onSortEnd} axis='xy' pressDelay={200}>
            {uploadedImages
              ?.sort((a, b) => a?.sequence_number - b?.sequence_number)
              ?.map(
                (item, i) =>
                  i < 10 && (
                    <SortablePhoto
                      setCount={setCount}
                      setEditingImage={setEditingImage}
                      setUploadedImages={setUploadedImages}
                      id={id}
                      index={i}
                      item={item}
                      key={i}
                      i={i}
                      count={count}
                    />
                  )
              )}
          </SortableGallery>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, userSelect: 'none', mt: 3 }}>
            {uploadedImages?.length !== 0 &&
              uploadedImages?.map((image, idx) => (
                <Box
                  key={image?.id}
                  sx={{
                    img: {
                      width: count === idx ? 72 : 56,
                      height: count === idx ? 72 : 56,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      objectFit: 'cover',
                    },
                  }}
                  onClick={() => setCount(idx)}
                  alt=''
                >
                  <img src={getImageUrl(image.key)} alt='image of order' />
                </Box>
              ))}
          </Box> */}
        </Box>
      </Box>
    </Box>
  )
}

export default ImageUploadGallery
