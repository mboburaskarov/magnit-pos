import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import getImageUrl from '@utils/getImageUrl'
import { Box, Button } from '@mui/material'

export const SortablePhoto = SortableElement(({ item, i, setEditingImage, setUploadedImages, id, setCount, count }) => {
  const deleteImage = (image, ind) => {
    setUploadedImages((uploadedImages) => uploadedImages.filter((el) => el?.sequence_number !== ind)?.map((el, index) => ({ ...el, sequence_number: index })))
  }
  return (
    <Box
      onClick={() => setCount(i)}
      key={i}
      sx={{
        position: 'relative',
        height: count === i ? 128 : 96,
        width: count === i ? 128 : 96,
        transition: 'width .2s ease',
        marginRight: 2,
        border: `1px solid`,
        borderColor: 'grey.200',
        borderRadius: 4,
        '& > img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 4,
          cursor: 'move',
          '&:hover + .visible': {
            display: 'flex',
          },
        },
      }}
    >
      <img src={getImageUrl(item.key)} {...item} alt={getImageUrl(item.key)} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: 1,
          borderRadius: 4,
          color: 'common.white',
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
          cursor: 'move',
          '#label-image-upload': {
            fontSize: 14,
            lineHeight: '17px',
            fontWeight: 600,
            color: 'common.white',
            margin: 0,
            minWidth: 0,
            padding: '4px',
            height: 'auto',
            cursor: 'pointer',
          },
          '&.visible:hover': {
            display: 'flex',
          },
        }}
        className='visible'
      >
        <label htmlFor={id} onClick={() => setEditingImage(item.name)} id='label-image-upload'>
          Заменить
        </label>
        <Button
          onClick={() => deleteImage(item, i)}
          sx={{
            minWidth: 80,
            maxWidth: 80,
            height: 24,
            padding: '4px 10px',
            borderRadius: 2,
            backgroundColor: 'red.500',
            color: 'common.white',
            fontSize: 14,
            lineHeight: '17px',
            fontWeight: 600,
            pointerEvents: 'all',
            '&:hover': {
              backgroundColor: 'red.501',
            },
          }}
        >
          Удалить
        </Button>
      </Box>
    </Box>
  )
})

export const SortableGallery = SortableContainer(({ children }) => <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>{children} </Box>)
