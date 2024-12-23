import { useState } from 'react'
import { Box, useTheme, Button } from '@mui/material'
import InputDateRangePicker from '../Inputs/InputDatePicker' //change'
import LazySelect from '../Select/LazySelect'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { requests } from '../../utils/requests'
import dayjs from 'dayjs'
import { useQueryParams } from '../../src/hooks/useQueryParams'

export default function OrderFilterMenu({ filterMenu, setDate, setFilterMenu }) {
  const theme = useTheme()
  const { control, formState, reset, handleSubmit } = useForm({
    defaultValues: {
      start_date: '',
      end_date: '',
      client: '',
    },
  })
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { values: queryParams } = useQueryParams()
  const { id } = useParams()
  const [localStartDate, setLocalStartDate] = useState('')
  const [localEndDate, setLocalEndDate] = useState('')

  const onSubmit = (data) => {
    setDate({
      startDate: localStartDate && dayjs(localStartDate).format('YYYY-MM-DD'),
      endDate: localEndDate && dayjs(localEndDate).format('YYYY-MM-DD'),
      clientId: data.client?.id || '',
    })
    setFilterMenu(false)
  }

  const resetFilter = () => {
    setDate({
      startDate: '',
      endDate: '',
      clientId: '',
    })
    setLocalStartDate('')
    setLocalEndDate('')
    reset()
    navigate(`/order/new-order/${id}?order_number=${queryParams?.order_number}`)
  }

  return (
    <Box mt={2} py={3} px={2} borderRadius={4} border={`1px solid ${theme.palette.gray[300]}`} hidden={!filterMenu}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' alignItems='center' mb={3}>
          <Box flex='1 0 30%' mr={2}>
            <InputDateRangePicker
              name='date'
              label={t('menu.products.import.nav.filter_menu_import.data_label')}
              minWidth='auto'
              placeholder={t('menu.products.import.nav.filter_menu_import.data_placeholder')}
              fullWidth
              setStartDate={setLocalStartDate}
              setEndDate={setLocalEndDate}
              startDate={localStartDate}
              endDate={localEndDate}
            />
          </Box>
          <Box flex='1 0 30%'></Box>
        </Box>
        <Box display='flex' width='100%' mt={4}>
          <Button
            secondary
            variant='contained'
            type='button'
            style={{ flex: '1 0 45%', marginRight: 32 }}
            disabled={!formState.isDirty && !localStartDate}
            onClick={resetFilter}
          >
            {t('menu.orders.all.filter_menu_order.reset')}
          </Button>
          <Button variant='contained' style={{ flex: '1 0 45%' }} type='submit' disabled={!formState.isDirty && !localStartDate}>
            {t('menu.orders.all.filter_menu_order.apply')}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
