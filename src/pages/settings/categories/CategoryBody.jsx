import { Box } from '@mui/material'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useFormContext } from 'react-hook-form'
import SelectSimple from '../../../../components/Select/SelectSimple'
import TextField from '../../../../components/Inputs/TextField'
import ImageUpload from '../../../../components/ImageUpload'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import { useEffect } from 'react'

export default function CategoryBody({ categoryData }) {
  const { setValue, watch } = useFormContext()

  const { data: categoriesList } = useQuery('categoriesListCreate', () => requests.getAllCategories())

  useEffect(() => {
    if (categoryData) {
      setValue('dimensional_type', categoryData?.dimensionalType)
      setValue('ICPSCode', categoryData?.ICPSCode)
      setValue('packageCode', categoryData?.packageCode)
      setValue('nameRu', categoryData?.nameRu)
      setValue('nameUz', categoryData?.nameUz)
      setValue('type_category', categoryData?.type)
      setValue('bgColor', categoryData?.bgColor)
      if (categoryData?.parentCategory) {
        setValue('subId', categoryData?.typeCategory)
      }
    }
  }, [categoryData])

  return (
    <>
      <Box width='100%' display='inline-flex'>
        <Box height={192} width={192}>
          <ImageUpload
            type='HASHTAG'
            height={158}
            width={158}
            id='images'
            name='images'
            onChange={(imagesArr) => setValue('images', imagesArr)}
            withoutTextBox
            images={categoryData ? [{ key: categoryData?.icon, name: categoryData?.icon, sequence_number: 1 }] : []}
            label={'Фото'}
          />
        </Box>
        <Box display='flex' rowGap={1.5} flexDirection='column' width='calc(100% - 158px)'>
          <TextField required fullWidth name='nameRu' label='Hазвание (Ru)' placeholder='Введите название категории на русском языке' />
          <TextField required fullWidth name='nameUz' label='Hазвание (Uz)' placeholder='Введите название категории на узбекском языке' />
        </Box>
      </Box>
      {!categoryData && (
        <Box mt={1.5}>
          <SelectSimple
            fullWidth
            name='parentCategory'
            label='Родительская категория'
            placeholder='Выберите родительскую категорию'
            options={categoriesList?.data}
            getOptionLabel={(e) => e.nameRu}
          />
        </Box>
      )}
      <Box display='flex' mt={1.5} flexDirection='column'>
        <TextField required fullWidth name='bgColor' label='Цвет' placeholder='Введите Цвет HEX' bgcolor={watch('bgColor')} autoComplete={'off'} />
      </Box>
      <Box display='flex' mt={1.5} flexDirection='column'>
        <TextField required fullWidth name='ICPSCode' label='ICPS' placeholder='Введите код ICPS1' />
      </Box>
      <Box display='flex' mt={1.5} flexDirection='column'>
        <TextField required fullWidth name='packageCode' label='packageCode' placeholder='Введите код packageCode' />
      </Box>
      <Box mt={1.5}>
        <InputSwitch
          id='type_category'
          name='type_category'
          label='Тип отправки'
          defaultValue={categoryData?.type}
          value
          uncontrolled
          onChange={(e) => setValue('type_category', e)}
          options={[
            { title: 'Buchet', value: 'BUCHET' },
            { title: 'Market', value: 'MARKET' },
          ]}
        />
      </Box>
      <Box mt={1.5}>
        <InputSwitch
          id='dimensional_type'
          name='dimensional_type'
          label='Вид реализации продукции'
          defaultValue={categoryData?.dimensionalType}
          uncontrolled
          onChange={(e) => setValue('dimensional_type', e)}
          options={[
            { title: 'По дате', value: 'DATE' },
            { title: 'По количеству', value: 'QUANTITY' },
          ]}
        />
      </Box>
    </>
  )
}
