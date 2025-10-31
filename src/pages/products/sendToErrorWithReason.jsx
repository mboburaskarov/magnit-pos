import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import OutLineTextField from '../../../components/Inputs/OutLineTextField'
import SelectSimple from '../../../components/Select/SelectSimple'
import { requests } from '../../../utils/requests'
import { error, success } from '../../../utils/toast'
import CloseIcon from '../../assets/icons/CloseIcon'
import { useQueryParams } from '../../hooks/useQueryParams'

export default function SendToErrorWithReason({ refetch, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods
  const [unit, setUnit] = useState(0)
  const [showReason, setShowReason] = useState(false)
  const { mutate: photoAlert, isLoading: isphotoAlert } = useMutation(requests.photoAlert, {
    onSuccess: () => {
      setOpen(false)

      success('Продукт успешно изменен!')
    },
    onError: (err) => {
      error('Ошибка при редактировании товара!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      category: Number(get(data, 'error_type.value')),
      reason: get(data, 'reason'),
      product_id: open?.id,
    }
    photoAlert(requestBody)
  }

  const onError = (err) => {
    console.error('err', err)
  }
  useEffect(() => {
    if (methods.getValues('error_type')?.value == 4) {
      setShowReason(true)
    } else {
      setShowReason(false)
    }
  }, [methods.watch('error_type')])
  const theme = useTheme()

  const { t } = useTranslation()

  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      title={'Сообщить об ошибке'}
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
            <Box padding={'0 2px'} maxHeight={'calc(100vh - 280px)'} width={'100%'} overflow={'scroll'}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center', my: '30px' }}>{open?.name}</Typography>

              <SelectSimple
                fullWidth
                id='error_type'
                name='error_type'
                white
                minWidth='auto'
                label={'Тип ошибки'}
                placeholder={t('Выберите тип ошибки')}
                defaultValue={'4'}
                getOptionLabel={(el) => el.name}
                options={[
                  { name: 'Мл/доза неверна', value: '1' },
                  { name: 'Ошибка производителя', value: '2' },
                  { name: 'Ошибка изображения', value: '3' },
                  { name: 'Другой', value: '4' },
                ]}
              />
              <Box height={'20px'} />
              {showReason && (
                <OutLineTextField
                  endAdornmentText={''}
                  type='text'
                  fullWidth
                  InputProps={{
                    disabled: true,
                  }}
                  borderRadius={'40px'}
                  name='reason'
                  value={get(open, 'measurement_value')}
                  label={'Причина ошибки'}
                  placeholder={''}
                />
              )}
            </Box>
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
