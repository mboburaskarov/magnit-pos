import { Box, Button, Typography } from '@mui/material'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { useForm } from 'react-hook-form'
import SelectSimple from '../../../components/Select/SelectSimple'
import { FormProvider } from 'react-hook-form'
import { error, warning } from '../../../utils/toast'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { SocketProvider } from '../../../utils/SocketContext'

export default function BillzDrawer({ isOpen: data, setOpenBillzDialog }) {
  const methods = useForm()
  const storedSocketData = JSON.parse(localStorage.getItem('socketData'))
  const socketData = useContext(SocketProvider)
  const [socketArr, setSocketArr] = useState(storedSocketData)
  const { reset, setValue, getValues } = methods
  // eslint-disable-next-line no-unused-vars
  const { data: billz } = useQuery(['billz-categories', data?.id], () => requests.getCategoryBillz({ shopId: data?.id }), {
    enabled: !!data?.id && !Array.isArray(socketArr),
    onSuccess: () => {
      warning('Идет процесс получения данных. Пожалуйста, подождите.')
    },
  })
  const { data: buchetCategories } = useQuery(['buchet-categories', data?.id], () => requests.getAllCategoriesBuchet(), {
    enabled: !!data?.id && Array.isArray(socketArr),
  })
  const { mutate: createBillz } = useMutation(requests.createBillzCategory, {
    onSuccess: () => {
      warning('Идет процесс обновления данных. Пожалуйста, подождите!')
    },
    onError: () => {
      error('Что то пошло не так!')
    },
  })
  const transformedOptions = socketArr?.map((item) => ({
    label: item,
    value: item,
  }))

  const onSubmit = (values) => {
    if (!values?.buchet_categories || !values?.billz_categories) {
      error('Нужно выбрать оба категории!')
    } else {
      const { buchet_categories, billz_categories } = values
      createBillz({ shopId: data?.id, categories: [{ billzCategoryName: billz_categories?.value, categoryId: buchet_categories?._id }] })
      reset()
    }
  }

  const onClose = () => {
    setOpenBillzDialog({ id: data?.id, isOpen: false })
  }

  useEffect(() => {
    if (socketData && socketData !== socketArr) {
      setSocketArr(socketData)
      console.log('Socket data updated', socketData)
    } else if (!socketArr?.length && storedSocketData && storedSocketData !== socketArr) {
      setSocketArr(storedSocketData)
      console.log('Stored data loaded', storedSocketData)
    }
  }, [socketData, storedSocketData, socketArr])

  return (
    <CardDrawer
      closeDrawer={onClose}
      width={1000}
      title={
        <Box display='inline-flex'>
          <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
            Категории Billz
          </Typography>
        </Box>
      }
      isOpen={data?.isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex' onClick={() => onSubmit(getValues())}>
          <Button fullWidth disabled={!socketArr?.length}>
            Подтвердить
          </Button>
        </Box>
      }
    >
      <Box>
        {socketArr?.length ? (
          <FormProvider {...methods}>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <SelectSimple
                id='billz_categories'
                name='billz_categories'
                label={'Выберите категорию billz'}
                minWidth='auto'
                fullWidth
                placeholder={
                  <Typography ml={4} color='#bdbdbd'>
                    Выберите категорию billz
                  </Typography>
                }
                options={transformedOptions || []}
                getOptionLabel={(option) => {
                  return (
                    <Typography maxHeight={48} display='inline-flex' color='grey.600' onClick={() => setValue('billz-categories', option)}>
                      {option?.label}
                    </Typography>
                  )
                }}
                filterOption={(option, inputValue) => {
                  return option?.value?.includes(inputValue)
                }}
              />
              <SelectSimple
                id='buchet_categories'
                name='buchet_categories'
                minWidth='auto'
                label={'Выберите категорию'}
                fullWidth
                placeholder={
                  <Typography ml={4} color='#bdbdbd'>
                    Выберите категорию
                  </Typography>
                }
                options={buchetCategories?.data}
                getOptionLabel={(option) => {
                  return (
                    <Typography maxHeight={48} display='inline-flex' color='grey.600' onClick={() => setValue('buchet-categories', option)}>
                      {option?.nameRu}
                    </Typography>
                  )
                }}
                filterOption={(option, inputValue) => {
                  return option?.data?.nameRu.includes(inputValue)
                }}
              />
            </Box>
          </FormProvider>
        ) : (
          <Box>
            <Typography variant='h3'>Идет процесс получения данных. Пожалуйста, подождите.</Typography>
            <Box className='loading-container'>
              <Box className='loading-bar'>
                <Box className='animated-bar'></Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </CardDrawer>
  )
}
