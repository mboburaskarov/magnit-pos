import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import LazySelect from '@components/Select/LazySelect'
import SelectSimple from '@components/Select/SelectSimple'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'

export default function EditBonusProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { reset, control } = methods
  const { t } = useTranslation()

  const { mutate: createMinMax } = useMutation(requests.editMinMax, {
    onSuccess: () => {
      setOpen(false)
      refetch()
      success('Редактировать Мин-Макс')
    },
    onError: (err) => {
      error('Ошибка Редактировать Мин-Макс!')
      console.error('err', err)
    },
  })

  useEffect(() => {
    if (open) {
      const { product_id, is_active, min_quantity, max_quantity, kvant } = open
      reset(
        {
          product: { name: open.name, value: product_id },
          is_active: { name: is_active ? 'Активный' : 'Неактивный', id: String(is_active) },
          min_quantity: min_quantity || 0,
          max_quantity: max_quantity || 0,
          kvant: kvant || 0,
        },
        { keepDirty: true }
      )
    }
  }, [open])

  const onSubmit = (data) => {
    const requestBody = {
      product_id: data.product.value,
      is_active: data.is_active.id == 'true',
      min_quantity: data.min_quantity,
      max_quantity: data.max_quantity,
      kvant: data.kvant,
    }
    createMinMax({ id: open?.id, data: requestBody })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])

  const minMaxStatusSelect = [
    { name: 'Неактивный', id: 'false' },
    { name: 'Активный', id: 'true' },
  ]
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Редактировать Мин-Макс'}
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
              slug='product'
              id='product'
              name='product'
              isMulti={false}
              required
              label={t('Продукт')}
              placeholder={t('Выберите Продукт')}
              minWidth='auto'
              isClearable={true}
              request={requests.getProductListForSelect}
              filters={{ limit: 10 }}
              defaultValue={{ name: open?.name, value: open?.product_id }}
              control={control}
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />

            <SelectSimple
              fullWidth
              id='is_active'
              white
              name='is_active'
              minWidth='auto'
              label={'Статус'}
              defaultValue={{ name: minMaxStatusSelect.find((a) => a.id == String(open.is_active))?.name, id: open?.is_active ? 'true' : 'false' }}
              placeholder={'Bыберите статус'}
              options={minMaxStatusSelect}
              getOptionLabel={(el) => el.name}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <NumberFormatInput
                label={'Квант'}
                id={`kvant`}
                name={`kvant`}
                fullWidth
                required
                type='number'
                defaultValue={get(open, 'kvant', 0)}
                disabled={false}
              />
              <Box width={'40px'} />
              <NumberFormatInput
                label={'Мин'}
                id={`min_quantity`}
                name={`min_quantity`}
                fullWidth
                required
                type='number'
                defaultValue={get(open, 'min_quantity', 0)}
                disabled={false}
              />
              <Box width={'40px'} />
              <NumberFormatInput
                label={'Макс'}
                id={`max_quantity`}
                name={`max_quantity`}
                fullWidth
                required
                type='number'
                defaultValue={get(open, 'max_quantity', 0)}
                disabled={false}
              />
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
