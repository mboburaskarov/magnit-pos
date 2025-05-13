import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import UploadFile from '../../../../components/UploadFile'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function UploadCV({ open, refetch, setOpen, setHasChange }) {
  const methods = useForm()
  const { reset, control } = methods
  const [file, setFile] = useState(null)

  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const { mutate: uploadCV, isLoading: isUploadingCV } = useMutation(requests.cvUpload, {
    onSuccess: ({ data }) => {
      refetch()
      setHasChange(false)
      setOpen(false)
    },
    onError: (err) => {
      setHasChange(false)

      error(errotTypes[get(err, 'response.data.code', 400)])
      console.error(err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      product_id: data.product.value,
      bonus_amount: data.bonus_amount,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    createBonusProduct(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()

  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Загрузите файл в формате XLSX, XLS или CSV'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <UploadFile
              setFile={setFile}
              file={file}
              onSuccess={(e) => {
                setFile(e)
              }}
            />

            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                disabled={!file}
                onClick={() => {
                  setHasChange(true)
                  uploadCV(file)
                }}
                fullWidth
                variant='contained'
                type='submit'
              >
                Отправлять
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
