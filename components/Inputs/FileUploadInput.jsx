import { Box, Typography } from '@mui/material'
import Label from '../Label'
import FileIcon from '../../src/assets/icons/FileIcon'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { requests } from '../../utils/requests'
import { error } from '../../utils/toast'
import getImageUrl from '../../utils/getImageUrl'
import StyledTooltip from '../StyledTooltip'

export default function FileUploadInput({ id, onChange, label, placeholder, defaultValue }) {
  const [file, setFile] = useState(defaultValue || null)

  const { mutate: uploadFile, isLoading: isUploadingFile } = useMutation(requests.fileUpload, {
    onSuccess: ({ data }) => {
      setFile(data?.[0])
      onChange(data?.[0])
    },
    onError: (err) => {
      error('Ошибка при загрузке файла!')
      console.error(err)
    },
  })

  const onHandleChange = (event) => {
    const formData = new FormData()
    formData.append('files', event.target.files[0], event.target.files[0]?.name)
    uploadFile(formData)
  }

  return (
    <Box width='100%'>
      <label htmlFor={id}>
        <Label>{label}</Label>
        <Box
          px={2.5}
          display='flex'
          alignItems='center'
          borderRadius={4}
          mt={1.5}
          width='100%'
          height={56}
          bgcolor='grey.100'
          sx={{ cursor: file?.key && 'pointer', '&:hover': { bgcolor: 'grey.200' } }}
        >
          {file?.key ? (
            <a target='_blank' rel='noreferrer' href={getImageUrl(file?.key)}>
              <StyledTooltip title='Просмотреть'>
                <FileIcon width={20} />
              </StyledTooltip>
            </a>
          ) : (
            <FileIcon width={20} />
          )}
          <Typography whiteSpace='nowrap' color={file?.name ? 'grey.600' : 'grey.400'} ml={1}>
            {isUploadingFile ? 'Файл загружается...' : file?.name ? `${file?.name} ${(file?.size / 1024).toFixed(1)} KB` : placeholder}
          </Typography>
          <input accept='.pdf,.doc,.txt,.docx' onChange={onHandleChange} id={id} style={{ opacity: '0', width: 0 }} type='file' />
        </Box>
      </label>
    </Box>
  )
}
