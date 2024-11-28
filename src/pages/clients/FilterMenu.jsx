import { Box, Button } from '@mui/material'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../hooks/useQueryParams'
import SelectSimple from '../../../components/Select/SelectSimple'
import InputRange from '../../../components/Inputs/InputRange'
import getOptionsFromUrlParam from '../../../utils/getOptionsFromUrlParam'
import * as qs from 'qs'
import { client_groups } from '../../assets/data/client-groups'
import InputDatePicker from '../../../components/Inputs/InputDatePicker'
import dayjs from 'dayjs'
import Label from '../../../components/Label'

export default function FilterMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods

  const onSubmit = (data) => {
    const requestBody = {
      group_id: data.groups?.id || undefined,
      from_order_count: data.from_orders_count || undefined,
      to_order_count: data.to_orders_count || undefined,
      from_average_cheque: data.from_average_cheque || undefined,
      to_average_cheque: data.to_average_cheque || undefined,
      from_last_order_time: dayjs(data.from_last_order_time).format('YYYY-MM-DD') || undefined,
      to_last_order_time: dayjs(data.to_last_order_time).format('YYYY-MM-DD') || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/clients/all${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { group_id, from_order_count, to_order_count, to_last_order_time, from_last_order_time, to_average_cheque, from_average_cheque } = values
    // console.log('from_last_order_time', from_last_order_time)
    reset(
      {
        groups: group_id ? getOptionsFromUrlParam(group_id, client_groups?.data, 'id') : null,
        from_order_count: from_order_count,
        to_order_count: to_order_count,
        from_average_cheque: from_average_cheque,
        to_average_cheque: to_average_cheque,
        from_last_order_time: dayjs(from_last_order_time).toDate(),
        to_last_order_time: dayjs(to_last_order_time).toDate(),
      },
      { keepDirty: true }
    )
  }, [values.group_id, values.from_order_count, values.to_order_count])

  const resetFilter = () => {
    reset()
    navigate(`/clients/all?offset=0&limit=${values?.limit || 5}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: open ? 4 : 0,
        border: `1px solid`,
        borderColor: 'gray.200',
        borderRadius: 4,
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        transition: open ? 'padding 0.3s ease-out' : 'padding 0.1s ease-in',
        marginTop: open ? 4 : 0,
      }}
    >
      <FormProvider {...methods}>
        <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <Box columnGap={3} display='inline-flex' width='100%'>
            <SelectSimple
              fullWidth
              id='groups'
              name='groups'
              minWidth='auto'
              label='Группы'
              placeholder='Выберите группу'
              options={client_groups}
              getOptionLabel={(el) => el.id}
            />
            <InputRange
              fullWidth
              id='orders_count'
              label='Кол-во заказов'
              name1='from_orders_count'
              name2='to_orders_count'
              placeholder1='от'
              placeholder2='до'
            />
          </Box>
          <Box columnGap={3} display='inline-flex' width='100%'>
            <InputRange
              fullWidth
              id='average_cheque'
              label='Средний чек'
              name1='from_average_cheque'
              name2='to_average_cheque'
              placeholder1='от'
              placeholder2='до'
            />
            <Box display={'block'} gap={1} width={'100%'}>
              <Label required={false} mb={1.5}>
                Дата последнего заказа
              </Label>
              <Box display={'flex'} gap={1} width={'100%'}>
                <InputDatePicker
                  placeholder={'Выберите дату от'}
                  maxDate={Date.now()}
                  name='from_last_order_time'
                  id='from_last_order_time'
                  noMarginTop
                  defaultValue={new Date()}
                />
                <InputDatePicker
                  placeholder={'Выберите дату до'}
                  maxDate={dayjs().add(1, 'day').valueOf()}
                  name='to_last_order_time'
                  id='to_last_order_time'
                  noMarginTop
                  defaultValue={dayjs().add(1, 'day').toDate()}
                />
              </Box>
            </Box>
          </Box>
          <Box columnGap={2} display='flex' width='100%' mt={4}>
            <Button fullWidth color='secondary' variant='contained' disabled={!formState.isDirty} onClick={resetFilter}>
              Сбросить фильтры
            </Button>
            <Button fullWidth variant='contained' type='submit'>
              Применить фильтры
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  )
}
