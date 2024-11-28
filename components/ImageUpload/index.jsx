import { useState, useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { arrayMove } from 'react-sortable-hoc'
import { useMutation } from 'react-query'
import { useDropzone } from 'react-dropzone'
import { requests } from '../../utils/requests'
import { error } from '../../utils/toast'
import ImagePreview from './ImagePreview'
import Label from '../Label'

export default function ImageUpload({ id, images, onChange, label, width, height, type, withoutTextBox }) {
  const [uploadedImages, setUploadedImages] = useState(images || [])
  const [editingImage, setEditingImage] = useState(null)

  const filterAndSetImages = (data) => {
    setUploadedImages((oldImages) => {
      const newImages = editingImage
        ? oldImages.map((el) => {
            if (el.name === editingImage) {
              el.name = data?.[0].name
              el.key = data?.[0].key
            }
            return el
          })
        : [...oldImages, data?.[0]].map((el, ind) => ({
            ...el,
            sequence_number: ind,
          }))

      return newImages
    })
  }

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation(requests.imageUpload, {
    onSuccess: ({ data }) => {
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
        formData.append('files', file, file.name)
        if (type) formData.append('type', type)
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

  useEffect(() => {
    onChange(uploadedImages)
  }, [uploadedImages])

  return (
    <Box width={withoutTextBox ? 'auto' : '100%'}>
      <Label mb={1.5}>{label || 'Фото'}</Label>
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
              borderColor: isDragReject ? 'red.300' : 'gray.300',
              flexDirection: 'column',
              borderRadius: 4,
              height: 128,
              cursor: 'pointer',
              backgroundColor: isDragActive ? theme.palette.gray[200] : theme.palette.gray[100],
              '&:hover': {
                backgroundColor: theme.palette.gray[200],
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
