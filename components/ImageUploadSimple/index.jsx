import { Box, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from 'react-query'
import { arrayMove } from 'react-sortable-hoc'
import { requests } from '../../utils/requests'
import { error } from '../../utils/toast'
import ImagePreview from './ImagePreview'

export default function ImageUploadSimple({ id, images, onChange, label, width, height, type, withoutTextBox, margin }) {
  const [uploadedImages, setUploadedImages] = useState(images || [])
  const [editingImage, setEditingImage] = useState(null)

  const filterAndSetImages = (data) => {
    setUploadedImages([
      {
        name: data?.file_name,
        key: data?.file_url,
      },
    ])
  }

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation(requests.imageUpload, {
    onSuccess: ({ data }) => {
      onChange(data)
      filterAndSetImages(data)
      setEditingImage(null)
    },
    onError: (err) => {
      error('Ошибка при добавлении изображения!')
      console.error(err)
    },
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedImages = arrayMove(uploadedImages, oldIndex, newIndex)?.map((el, index) => ({
      ...el,
      sequence_number: index,
    }))

    setUploadedImages(reorderedImages)
  }

  const onDrop = useCallback(
    (files) => {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file, file.name)
        // if (type) formData.append('type', type)
        uploadImage(formData)
      }
    },
    [uploadImage]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' })

  useEffect(() => {
    if (images?.length) {
      setUploadedImages(images)
    }
  }, [images])

  return (
    <Box sx={{ borderRadius: '50%', overflow: 'hidden' }} margin={margin} width={withoutTextBox ? 'auto' : '100%'}>
      <Box sx={{ position: 'relative', display: 'flex', width: '100%', maxWidth: '100%', height: '100%', minHeight: 48, columnGap: 3 }}>
        <ImagePreview
          withoutTextBox={withoutTextBox}
          uploadedImages={uploadedImages}
          isUploadingImage={isUploadingImage}
          onSortEnd={onSortEnd}
          setEditingImage={setEditingImage}
          setUploadedImages={setUploadedImages}
          id={id}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          width={width}
          height={height}
        />
        {!withoutTextBox && (
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              py: 3,
              px: 6,
              paddingBottom: 4,
              borderColor: isDragReject ? 'red.300' : 'grey.300',
              flexDirection: 'column',
              borderRadius: 4,
              height: 128,
              cursor: 'pointer',
              backgroundColor: isDragActive ? theme.palette.grey[200] : theme.palette.grey[100],
              '&:hover': {
                backgroundColor: theme.palette.grey[200],
              },
            })}
            {...getRootProps()}
          >
            <input id={id} {...getInputProps()} data-test='upload-photo' />
            <Box>
              <Typography fontWeight={600}>Перетащите фото в эту область</Typography>
            </Box>
            <Typography color='textSecondary' fontWeight={600}>
              - или -
            </Typography>
            <Typography fontWeight={600} color='green.500'>
              Нажмите для обзора
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
