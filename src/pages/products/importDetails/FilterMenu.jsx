import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { requests } from '../../../../utils/requests'
import SelectSimple from '../../../../components/Select/SelectSimple'
import InputRange from '../../../../components/Inputs/InputRange'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
import * as qs from 'qs'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { theme } from '../../../assets/theme'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/styles'

export default function FilterMenu({ open, id, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods
  const [isExpress, setIsExpress] = useState(false)

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 20, offset: 0 }))
  const { data: producers } = useQuery('producers', () => requests.getAllProducer({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
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
    const { received_amount_to, received_amount_from } = values

    reset(
      {
        received_amount_to: received_amount_to,
        received_amount_from: received_amount_from,
      },
      { keepDirty: true }
    )
  }, [values?.received_amount_to, values?.received_amount_from])
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
              label={'Полученная сумма'}
              name1='received_amount_from'
              name2='received_amount_to'
              placeholder1={t('input.price.from')}
              placeholder2={t('input.price.to')}
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
