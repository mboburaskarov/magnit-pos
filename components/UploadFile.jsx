import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { default as FileIcon, default as RoundedFileIcon } from '../src/assets/icons/ReviewFillIcon'
import paletteLight from '../src/assets/theme/paletteLight'
import useDidUpdate from '../src/hooks/useDidUpdate'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    minHeight: 192,
    border: '1px dashed #CFCFCF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  input: {
    visibility: 'hidden',
    width: 0,
    height: 0,
    margin: 0,
    '&:checked + .radioButton': {
      backgroundColor: theme.palette.primary.main,
    },
    '&:checked + .radioButton svg': {
      fill: '#FFF',
    },
    '&:checked + .radioButton p': {
      color: '#FFF',
    },
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '32px 0',
    paddingBottom: 43,
    flexDirection: 'column',
    textAlign: 'left',
    cursor: 'pointer',
    backgroundColor: theme.palette.gray[100],
    transition: 'all .2s',
    '&:hover': {
      backgroundColor: theme.palette.gray[101],
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
  acceptFile: {
    marginTop: 12,
    color: theme.palette.gray[400],
    textAlign: 'center',
  },
  infoTextOnTop: {
    marginBottom: 24,
  },
  previewFile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '72px 0',
    textAlign: 'left',
    backgroundColor: theme.palette.gray[100],
  },
  replaceBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 196,
    height: 48,
    marginLeft: 32,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    borderRadius: 12,
    transition: 'all .2s',
    '& p': {
      color: theme.palette.blue[500],
    },
    '&:hover': {
      backgroundColor: theme.palette.gray[50],
    },
  },
  fileName: {
    width: 160,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dragActive: {
    '& > div': {
      backgroundColor: theme.palette.gray[200],
    },
  },
  dropzoneReject: {
    border: `1px dashed ${theme.palette.red[300]}`,
  },
}))

export default function UploadFile({ id = 'cv-file-id', name = 'cv-file', onSuccess }) {
  const classes = useStyles()
  const [file, setFile] = useState(null)
  const [fileSize] = useState(null)
  const { t } = useTranslation()
  const { watch } = useFormContext()

  const onChange = async (e) => {
    const sheet = e.target.files[0]
    let isExceedingLimit = false
    if (sheet) {
      // setValue(name, sheet)
      setFile(sheet)

      // await sheetToJSON(sheet).then((res) => {
      //   if (res) {
      //     error('toast.error.exceeding_limit_upload_file')
      //     isExceedingLimit = true
      //   }
      // })
      if (isExceedingLimit) return
      const formData = new FormData()
      formData.append('file', sheet, sheet.name)
      // if (type) formData.append('type', type)
      onSuccess(formData)
      // if (typeof onSuccess === 'function') {
      //   // onSuccess(sheet)
      // }
    }
  }

  useDidUpdate(() => {
    if (watch('file') === null) setFile(null)
  }, [watch('file')])

  const onDrop = useCallback((files) => {
    onChange({ target: { files } })
  }, [])

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  })

  return (
    <>
      <div
        {...getRootProps({
          className: `
          ${classes.root} 
          ${isDragActive && classes.dragActive} 
          ${isDragReject && classes.dropzoneReject}
          `,
        })}
      >
        {file ? (
          <Box className={classes.previewFile}>
            <Box display='flex' justifyContent='space-between'>
              <RoundedFileIcon />
              <Box ml={2}>
                <Typography className={classes.fileName}>{file?.name}</Typography>
                <Typography style={{ color: paletteLight.gray[400] }}>{fileSize}</Typography>
              </Box>
            </Box>
            <label htmlFor={id} className={classes.replaceBtn}>
              <input
                type='file'
                name={name}
                id={id}
                accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                onChange={onChange}
                width='100%'
                data-test='upload-file'
                height={36}
                {...getRootProps({
                  className: `
                  ${classes.input} 
                  `,
                })}
              />
              <Typography>{t('menu.products.import.nav.import_create_main_details.replace')}</Typography>
            </label>
          </Box>
        ) : (
          <label htmlFor={id} className={`${classes.button} radioButton`}>
            <input
              type='file'
              name={name}
              id={id}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              onChange={onChange}
              width='100%'
              height={36}
              className={classes.input}
            />
            <Box>
              <div className={classes.previewIcon}>
                <FileIcon />
              </div>
              <Typography className={classes.previewText}>{t('menu.products.import.nav.import_create_main_details.drag_file')}</Typography>
            </Box>
            <Typography color='textSecondary' className={classes.previewText}>
              {'- '} {t('menu.products.import.nav.import_create_main_details.or')} {' -'}
            </Typography>
            <Typography className={classes.uploadPhotoText}>{t('menu.products.import.nav.import_create_main_details.overview_click')}</Typography>
          </label>
        )}
      </div>

      {/* <Box display='flex' alignItems='center' justifyContent='space-between' mt={4} p={2} border={`1px dashed ${paletteLight.gray[300]}`} borderRadius={6}>
        <Box>
          <Typography
            style={{
              color: paletteLight.blue[500],
              cursor: 'pointer',
            }}
          >
            {t('menu.products.import.nav.import_create_main_details.how_to_fill')}
          </Typography>
          <Typography>{t('menu.products.import.nav.import_create_main_details.download_template_with_example')}</Typography>
        </Box>
        <Box minWidth={196}>
          <Button
            secondary
            fullWidth
            isLoading={isDownloading}
            onClick={() => {
              if (getExcelFile) getExcelFile()
            }}
          >
            {t('titles.download_template')}
          </Button>
        </Box>
      </Box> */}
    </>
  )
}
