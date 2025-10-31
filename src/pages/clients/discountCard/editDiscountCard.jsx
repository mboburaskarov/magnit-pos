import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'

export default function EditDiscountCard({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { t } = useTranslation()
  const { reset } = methods

  const { mutate: editDiscountCard } = useMutation(requests.editDiscountCard, {
    onSuccess: () => {
      setOpen(false)
      success('Редактировать дисконтная карта успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Редактировать дисконтная карта успешно!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      percent: data.percent,
    }
    editDiscountCard({ data: requestBody, id: get(open, 'id', 0) })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset(
      {
        percent: get(open, 'percent', 0),
      },
      { keepDirty: true }
    )
  }, [open])

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Редактировать дисконтная карта'}
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
            <NumberFormatInput label={'Процент'} id={`percent`} name={`percent`} fullWidth required type='number' defaultValue={0} disabled={false} />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
