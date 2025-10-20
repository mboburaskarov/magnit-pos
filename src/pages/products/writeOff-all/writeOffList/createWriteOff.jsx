import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import TextField from '../../../../../components/Inputs/TextField'
import Label from '../../../../../components/Label'
import LazySelect from '../../../../../components/Select/LazySelect'
import SelectSimple from '../../../../../components/Select/SelectSimple'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import CloseIcon from '../../../../assets/icons/CloseIcon'
import { LoadingButton } from '@mui/lab'
export const writeOffReason = [
  { name: 'Другое', id: 'other' },
  { name: 'Дефект', id: 'defect' },
  { name: 'Потеря', id: 'loss' },
  { name: 'Списание с каталога', id: 'decommissioning_from_catalog' },
  { name: 'Исправление пересорта', id: 'correction_of_misclassification' },
]
export default function CreateWriteOff({ open, refetch, setOpen }) {
  const methods = useForm()
  const [openWarn, setopenWarn] = useState(false)
  const { reset, control } = methods
  useEffect(() => {
    if (methods.getValues('reason')?.id == 'correction_of_misclassification') {
      setopenWarn(true)
    } else {
      setopenWarn(false)
    }
  }, [methods.watch('reason')])
  const { mutate: createWriteOff, isLoading: iscreateWriteOff } = useMutation(requests.createWriteOff, {
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
      name: data.name || undefined,
      comment: data.reason?.id || undefined,
    }
    createWriteOff(requestBody)
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
      title={'Новое списание'}
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
            <Box width={'100%'}>
              <Label mb='12px'>{t('Назовите списание')}</Label>
              <TextField
                id='client-name'
                name='name'
                control={control}
                fullWidth
                // label='Назовите списание'
                // error={errors?.name}
                placeholder={t('Назовите списание')}
                required
                defaultValue={`Cписание ${dayjs().format('YYYY.MM.DD HH:mm')}`}
                asteriks
              />
            </Box>

            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='store_id'
              id='store_id'
              name='store_id'
              isMulti={false}
              required
              label={t('input.store.label')}
              placeholder={t('Выберите Аптека')}
              minWidth='auto'
              isClearable={true}
              request={requests.getAllStores}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <SelectSimple
              fullWidth
              id='nobarcode'
              white
              name='reason'
              minWidth='auto'
              label={'Причина списания'}
              placeholder={'Bыберите причина'}
              options={writeOffReason}
              getOptionLabel={(el) => el.name}
            />
            {openWarn && (
              <Box
                sx={{
                  border: '2px solid #ECEDF2',
                  borderRadius: '20px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box mr={'10px'}>
                  <svg
                    aria-hidden='true'
                    focusable='false'
                    data-prefix='fas'
                    data-icon='triangle-exclamation'
                    class='svg-inline--fa fa-triangle-exclamation fa-xl jss7266'
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                  >
                    <path
                      fill='#f2c94c'
                      d='M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z'
                    ></path>
                  </svg>
                </Box>

                <Typography>
                  При выборе причины списания “Исправление пересорта”, результаты данного списания не будут отражены в финансовых отчетах в виде расходов
                </Typography>
              </Box>
            )}
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <LoadingButton loading={iscreateWriteOff} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
