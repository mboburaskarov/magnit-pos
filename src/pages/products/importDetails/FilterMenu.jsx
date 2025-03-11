import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputRange from '../../../../components/Inputs/InputRange'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import SelectSimple from '../../../../components/Select/SelectSimple'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
const barcodeFilterList = [
  { name: 'Без штрих-кода', value: true },
  { name: 'Со штрих-кодом', value: false },
]
export default function FilterMenu({ open, id, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods

  const onSubmit = (data) => {
    const requestBody = {
      no_barcode: data.no_barcode.value || undefined,
      received_amount_from: data.received_amount_from || undefined,
      received_amount_to: data.received_amount_to || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products/imports/${id}${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { received_amount_to, no_barcode, received_amount_from } = values
    // console.log(getOptionsFromUrlParam(no_barcode, barcodeFilterList, 'name')[0])

    reset(
      {
        received_amount_to: received_amount_to || null,
        received_amount_from: received_amount_from || null,
        // no_barcode: getOptionsFromUrlParam(no_barcode, barcodeFilterList, 'name') || null,
      },
      { keepDirty: true }
    )
  }, [values?.received_amount_to, values?.received_amount_from, values?.no_barcode])
  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/products/imports/${id}?offset=0&limit=${values?.limit || 5}`)
  }
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog open={open} title={t('filter_dialog.label')} customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}>
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
            <InputRange
              fullWidth
              id='prixwce'
              label={t('table_columns.retail_price')}
              name1='received_amount_from'
              name2='received_amount_to'
              placeholder1={t('input.price.from')}
              placeholder2={t('input.price.to')}
            />
            <SelectSimple
              fullWidth
              id='nobarcode'
              white
              name='no_barcode'
              minWidth='auto'
              label={'Штрих-код'}
              placeholder={'Bыберите статус'}
              options={barcodeFilterList}
              getOptionLabel={(el) => el.name}
            />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                sx={{ bgcolor: `${theme.palette.background.gray} !important`, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                disabled={!formState.isDirty}
                onClick={resetFilter}
              >
                <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                  {t('filter_dialog.reset.label')}
                </Typography>
              </Button>
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
