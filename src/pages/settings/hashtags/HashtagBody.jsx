import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import TextField from '../../../../components/Inputs/TextField'
import ImageUpload from '../../../../components/ImageUpload'
import InputSwitch from '../../../../components/Inputs/InputSwitch'

export default function HashtagBody({}) {
  const { setValue } = useFormContext()

  return (
    <>
      <Box display={'flex'} gap={1.5} mb={1.5}>
        <ImageUpload
          type='HASHTAG'
          height={158}
          width={309.665}
          id='images_ru'
          name='images_ru'
          onChange={(imagesArr) => setValue('images_ru', imagesArr)}
          withoutTextBox
          label={'Фото (Ru)'}
        />
        <ImageUpload
          type='HASHTAG'
          height={158}
          width={309.665}
          id='images_uz'
          name='images_uz'
          onChange={(imagesArr) => setValue('images_uz', imagesArr)}
          withoutTextBox
          label={'Фото (Uz)'}
        />
      </Box>
      <Box display='flex' rowGap={1.5} flexDirection='column' width='100%'>
        <TextField required fullWidth name='nameRu' label='Hазвание (Ru)' placeholder='Введите название хэштега на русском языке' />
        <TextField required fullWidth name='nameUz' label='Hазвание (Uz)' placeholder='Введите название хэштега на узбекском языке' />
      </Box>
      <Box mt={1.5}>
        <InputSwitch
          id='type_category'
          name='type_category'
          label='Тип отправки'
          defaultValue='BUCHET'
          uncontrolled
          onChange={(e) => setValue('type_category', e)}
          options={[{ title: 'Buchet', value: 'BUCHET' }]}
        />
      </Box>
    </>
  )
}
