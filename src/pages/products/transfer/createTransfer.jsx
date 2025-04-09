import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function CreateTransfer({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const { mutate: createAutoOrder, isLoading: iscreateAutoOrder } = useMutation(requests.createAutoOrder, {
    onSuccess: () => {
      setOpen(false)
      success('Создать автозаказ')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать автозаказ!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.id || undefined,
      interval_day: data.interval_day || undefined,
    }
    createAutoOrder(requestBody)
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
      title={'Новая трансфер'}
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
            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='store_id'
              id='store_id'
              name='store_id'
              isMulti={false}
              required
              label={t('input.store.label')}
              placeholder={t('Выберите Магазин')}
              minWidth='auto'
              isClearable={true}
              request={requests.getAllStores}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
            />
            <Box width={'100%'}>
              <NumberFormatInput
                id={`interval_day`}
                name={`interval_day`}
                fullWidth
                required
                defaultValue={0}
                type='number'
                label={'Интервальный день'}
                InputProps={{
                  onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
                }}
                // defaultValue={get(p, 'data.small_quantity')}
                disabled={false}
              />
              <Box display={'flex'} padding={'5px'}>
                <Box
                  onClick={() => methods.setValue('interval_day', 1)}
                  sx={{
                    backgroundColor: '#eee',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    fontSize: '17px',
                  }}
                >
                  День
                </Box>
                <Box
                  onClick={() => methods.setValue('interval_day', 7)}
                  sx={{
                    backgroundColor: '#eee',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    fontSize: '17px',
                    ml: '10px',
                  }}
                >
                  Неделя
                </Box>
              </Box>
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
