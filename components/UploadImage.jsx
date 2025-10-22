import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import DeleteIcon from '../src/assets/icons/DeleteIcon'
import PreviewIcon from '../src/assets/icons/PreviewIcon'
import StarFilledIcon from '../src/assets/icons/StarFilledIcon'
import StarOutlinedIcon from '../src/assets/icons/StarOutlinedIcon'
import useDidUpdate from '../src/hooks/useDidUpdate'
import { requests } from '../utils/requests'
import CustomImg from './CustomImg'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    minHeight: 48,
    marginTop: 4,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '32px 0',
    paddingBottom: 43,
    border: `1px dashed ${theme.palette.gray[300]}`,
    flexDirection: 'column',
    borderRadius: 24,
    textAlign: 'left',
    cursor: 'pointer',
    backgroundColor: theme.palette.gray[100],
    '&:hover': {
      backgroundColor: theme.palette.gray[200],
    },
  },
  dragActive: {
    backgroundColor: theme.palette.gray[200],
  },
  dropzoneReject: {
    border: `1px dashed ${theme.palette.red[300]}`,
  },
  img: {
    objectFit: 'contain',
  },
  img_item: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 16,
    cursor: 'move',
    '&:hover + .visible': {
      display: 'flex',
    },
  },
  img_list: {
    width: '100%',
    display: 'flex',
    marginBottom: 16,
  },
  img_box: {
    position: 'relative',
    height: 120,
    width: 120,
    marginRight: 16,
    border: `1px solid ${theme.palette.gray[200]}`,
    borderRadius: 16,
    '&:hover': {
      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    },
  },
  icon_box: {
    width: 24,
    height: 24,
    backgroundColor: theme.palette.white,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    top: 4,
    right: 4,
    borderRadius: 10,
    zIndex: '9',
    '& svg': {
      transform: 'scale(0.85)',
    },
  },
  guide_list: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  guide_list_item: {
    padding: '8px 16px',
    border: `1px dashed ${theme.palette.gray[300]}`,
    borderRadius: 32,

    width: '100%',
    color: theme.palette.gray[600],
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:nth-child(1)': {
      marginRight: 16,
    },
    '& span': {
      marginLeft: 8,
    },
  },
  preview_actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'center',
    width: '100%',
    padding: '8px',
    borderRadius: 16,
    color: theme.palette.common.white,
    cursor: 'move',
    '&.visible:hover': {
      display: 'flex',
    },
  },
  preview_icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    backgroundColor: `#FFF`,
    borderRadius: 10,
    cursor: 'pointer',
  },
  preview_text: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 600,
    color: theme.palette.common.white,
    margin: 0,
    minWidth: 0,
    padding: '4px',
    height: 'auto',
    cursor: 'pointer',
  },
  preview_btn: {
    marginLeft: '8px',
    maxWidth: 32,
    height: 32,
    padding: '8px',
    borderRadius: 8,
    backgroundColor: theme.palette.white,
    color: theme.palette.common.white,
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 600,
    pointerEvents: 'all',
    '&:hover': {
      backgroundColor: theme.palette.bunker[100],
    },
  },
  previewText: {
    fontWeight: 600,
  },
  uploadPhotoText: {
    fontWeight: 600,
    color: theme.palette.blue[500],
  },
  previewIcon: {
    textAlign: 'center',
    marginBottom: 24,
  },
}))

export default function UploadImage({ id, images, onChange, showGuideList = true }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const [uploadedImages, setUploadedImages] = useState(images || [])

  const [editingImage, setEditingImage] = useState(null)
  const setActiveImage = (file_name) => {
    const newImages = uploadedImages.map((el) => {
      if (el?.file_name === file_name) {
        el.is_main = true
        return el
      }
      return { ...el, is_main: false }
    })
    setUploadedImages(newImages)
  }

  const deleteImage = (image) => {
    const newImages = uploadedImages.filter((el) => el?.file_name !== image?.file_name)
    if (image?.is_main && newImages?.length > 0) newImages[0].is_main = true
    setUploadedImages(newImages)
  }

  const SortablePhoto = SortableElement(({ item, i }) => (
    <div key={i} className={classes.img_box}>
      <CustomImg src={item.file_url} {...item} alt={item.file_name} className={classes.img_item} />
      <div className={`${classes.preview_actions} visible`}>
        {item.is_main ? (
          <div className={classes.preview_icon} key={i}>
            <StarFilledIcon fill='#2558FF' />
          </div>
        ) : (
          <div key={i} className={classes.preview_icon} onClick={() => setActiveImage(item.file_name)}>
            <StarOutlinedIcon />
          </div>
        )}

        <Button onClick={() => deleteImage(item)} className={classes.preview_btn}>
          <DeleteIcon width='24px' />
        </Button>
      </div>
      {item.is_main && (
        <div className={classes.icon_box} key={i}>
          <StarFilledIcon fill='#2558FF' />
        </div>
      )}
    </div>
  ))

  const SortableGallery = SortableContainer(({ children }) => <Box className={classes.img_list}>{children} </Box>)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedImages = arrayMove(uploadedImages, oldIndex, newIndex)?.map((el, index) => ({
      ...el,
      sequence_number: index,
    }))

    setUploadedImages(reorderedImages)
  }

  const { mutate: uploadImage, isLoading } = useMutation(requests.imageUpload, {
    onSuccess: ({ data }) => {
      data.is_main = false
      setUploadedImages((oldImages) => {
        const newImages = editingImage
          ? oldImages?.map((el) => {
              if (el.file_name === editingImage) {
                el.file_name = data.file_name
                el.file_url = data.file_url
              }
              return el
            })
          : oldImages
          ? [...oldImages, data].map((el, ind) => ({
              ...el,
              sequence_number: ind,
            }))
          : [data].map((el, ind) => ({
              ...el,
              sequence_number: ind,
            }))

        const hasActiveImage = !!oldImages?.filter((el) => el?.is_main === true)?.length

        const allImages = hasActiveImage
          ? newImages
          : newImages.map((el, index) => ({
              ...el,
              is_main: index === 0,
            }))
        return allImages
      })
      setEditingImage(null)
    },
    onError: (err) => console.error(err),
  })

  const onDrop = useCallback(
    (files) => {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        uploadImage(formData)
      }
    },
    [uploadImage]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 2,
    maxSize: 5242880,
    accept: {
      'image/png': ['.png', '.jpg', '.jpeg'],
    },
  })

  useEffect(() => {
    if (uploadedImages.length === 0 && !!images?.length) {
      setUploadedImages(images)
    }
    if (uploadedImages.length !== images?.length) {
      setUploadedImages(images)
    }
  }, [images])

  useDidUpdate(() => {
    onChange(uploadedImages)
  }, [uploadedImages])

  return (
    <div className={classes.root}>
      {uploadedImages?.length ? (
        <>
          <SortableGallery onSortEnd={onSortEnd} axis='xy' pressDelay={200}>
            {uploadedImages
              ?.sort((a, b) => a?.sequence_number - b?.sequence_number)
              ?.map((item, i) => i < 10 && <SortablePhoto index={i} item={item} key={i} i={i} />)}
          </SortableGallery>
        </>
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        ''
      )}
      <div
        {...getRootProps({
          className: `
          ${classes.button} 
          ${isDragActive && classes.dragActive} 
          ${isDragReject && classes.dropzoneReject}
          `,
        })}
      >
        <input
          {...getInputProps({
            accept: 'image/jpeg, image/png, image/jpg',
          })}
          id={id}
          // {...getInputProps()}
          data-test='upload-photo'
        />
        <Box>
          <div className={classes.previewIcon}>
            <PreviewIcon />
          </div>
          <Typography className={classes.previewText}>{t('create_new_product.products_set_section.photo_first')}</Typography>
        </Box>
        <Typography color='textSecondary' className={classes.previewText}>
          {t('create_new_product.products_set_section.photo_second')}
        </Typography>
        <Typography className={classes.uploadPhotoText}>{t('create_new_product.products_set_section.photo_third')}</Typography>
      </div>
    </div>
  )
}
