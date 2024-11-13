import { Box, Button, Grid, Typography } from '@mui/material'
import SectionTitle from '../../../components/SectionTitle'
import TextField from '../../../components/Inputs/TextField'
import { useIMask } from 'react-imask'
import PhoneNumber from '../../../components/Inputs/PhoneNumber'
import { useEffect, useState } from 'react'
import { countries } from '../../assets/data/countries'
import SelectSimple from '../../../components/Select/SelectSimple'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import { useFormContext } from 'react-hook-form'
import ImageUpload from '../../../components/ImageUpload'
import FileUploadInput from '../../../components/Inputs/FileUploadInput'
import InputDatePicker from '../../../components/Inputs/InputDatePicker'
import MapSelect from '../../../components/MapSelect'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const WeekData = [
  { name: 'понедельник', id: 'Monday' },
  { name: 'вторник', id: 'Tuesday' },
  { name: 'среда', id: 'Wednesday' },
  { name: 'четверг', id: 'Thursday' },
  { name: 'пятница', id: 'Friday' },
  { name: 'суббота', id: 'Saturday' },
  { name: 'воскресенье', id: 'Sunday' },
]

export default function ShopBody({ shopData = null, setShopPhoneNumbers, shopPhoneNumbers }) {
  const { watch, setValue } = useFormContext()
  const [country, setCountry] = useState(countries[0])

  const activityType = watch('activity_type')
  const workingHours = watch('working_hours')

  const { ref: card_number_ref } = useIMask({ mask: '0000 0000 0000 0000', lazy: true, placeholderChar: '0' })
  const { ref: bill_number_ref } = useIMask({ mask: '0000 0000 0000 0000 0000', lazy: true, placeholderChar: '0' })
  const { ref: percent_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '0' })
  const { data: regions } = useQuery('regions', () => requests.getAllRegions({ limit: 1000, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 1000, offset: 0 }))

  useEffect(() => {
    if (shopData) {
      if (regions?.data) {
        setValue('app_type', shopData?.type || 'BUCHET')
        setValue('shop_name', shopData?.name)
        shopPhoneNumbers.map((el, ind) => {
          setValue(`phone_number_${ind}`, String(el)?.replace('998', ''))
        })
        setValue('percent', shopData?.margin)
        setValue(
          'region',
          regions?.data?.regions?.filter((el) => el._id === shopData?.regions?.[0])?.map((el) => ({ value: el.nameRu, name: el.nameRu, id: el._id }))
        )
        setValue('fast_delivery', String(shopData?.isFastDelivery))
        setValue('description', shopData?.description)

        setValue('activity_type', shopData?.contract?.activityType)
        setValue('mfo', shopData?.contract?.mfo)
        setValue('pinfl_or_tin', shopData?.contract?.activityType === 'LEGAL_ENTITY' ? shopData?.contract?.tin : shopData?.contract?.pin)
        setValue(
          'card_or_bill_number',
          String(shopData?.contract?.activityType === 'NATURAL_PERSON' ? shopData?.contract?.cardNumber : shopData?.contract?.billNumber)
            .replace(/(.{4})/g, '$1 ')
            .trim()
        )
        if (!!shopData?.contract?.contractDate) setValue('contract_date', dayjs(shopData?.contract?.contractDate)?.toDate())
        setValue('contract_number', shopData?.contract?.contractNumber)
        setValue('instagram', shopData?.socialNetwork?.instagram)
        setValue('facebook', shopData?.socialNetwork?.facebook)
        setValue('telegram', shopData?.socialNetwork?.telegram)
        setValue('website', shopData?.socialNetwork?.website)
        if (shopData?.categories?.length) {
          setValue(
            'categories',
            shopData?.categories?.map((item) => ({ value: item?.name, name: item?.name, id: item?._id }))
          )
        }
        if (shopData.schedule[0] !== '00:00-23:59' && shopData.schedule[3] !== '00:00-23:59' && shopData.schedule[6] !== '00:00-23:59') {
          setValue('working_hours', 'custom')

          shopData.schedule.map((daySchedule, ind) => {
            const time_start = daySchedule.split('-')[0]
            const time_end = daySchedule.split('-')[1]
            const name = WeekData[ind]?.id
            setValue(`${name}_time_start`, time_start)
            setValue(`${name}_time_end`, time_end)
            return
          })
        }
      }
    }
  }, [shopData, regions])
  useEffect(() => {
    if (!shopData) {
      setValue('app_type', 'BUCHET')
    }
  }, [])
  return (
    <Box rowGap={1} display='flex' flexDirection='column' width='100%'>
      <SectionTitle noWrap withLine>
        Основная информация
      </SectionTitle>
      <>
        <Box display='flex' columnGap={3} width='100%'>
          <TextField required fullWidth name='shop_name' label='Название магазина' placeholder='Введите название магазина' />
        </Box>
        <Box mt={1} display='flex' columnGap={3} width='100%'>
          <ImageUpload
            images={shopData && [{ key: shopData?.mainPicture, name: shopData?.mainPicture, sequence_number: 0 }]}
            label='Oсновную картинку магазина'
            id='main_image'
            name='main_image'
            onChange={(imagesArr) => setValue('main_image', imagesArr)}
          />
          <ImageUpload
            images={shopData?.internalPicture?.map((el, ind) => ({ key: el, name: el, sequence_number: ind }))}
            label='Bнешные картинки магазина'
            id='internal_image'
            name='internal_image'
            onChange={(imagesArr) => setValue('internal_image', imagesArr)}
          />
        </Box>
        <Box mt={0.5} display='flex' columnGap={3} width='100%'>
          <TextField inputRef={percent_ref} required fullWidth name='percent' label='Процент' placeholder='Введите процент' />
          <SelectSimple
            fullWidth
            options={regions?.data?.regions?.map((el) => ({ ...el, name: el.nameRu }))}
            id='region'
            name='region'
            minWidth='auto'
            label='Район'
            required
            placeholder='Выберите регион'
          />
        </Box>
        <Grid container mt={-1} columnSpacing={3} rowSpacing={2}>
          {shopPhoneNumbers.map((el, ind) => (
            <Grid key={ind} xs={6} item>
              <PhoneNumber
                name={`phone_number_${ind}`}
                placeholder='Введите номер телефона'
                label='Номер телефона'
                secondary
                fullWidth
                required
                country={country}
                setCountry={setCountry}
              />
            </Grid>
          ))}
          {shopPhoneNumbers.length < 4 && (
            <Grid xs={6} item>
              <Button
                sx={{ marginTop: 4.2 }}
                fullWidth
                onClick={() => setShopPhoneNumbers((prev) => [...prev, {}])}
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='secondary'
              >
                Добавить доп. номер телефона
              </Button>
            </Grid>
          )}
        </Grid>
        <Box mt={2} display={'flex'} alignItems={'center'} gap={3}>
          <InputSwitch
            id='app_type'
            name='app_type'
            label='Выберите тип приложения'
            options={[
              { title: 'Buchet', value: 'BUCHET' },
              { title: 'Market', value: 'MARKET' },
            ]}
          />
          <SelectSimple
            isMulti
            fullWidth
            id='categories'
            name='categories'
            label='Категории'
            placeholder='Выберите категорию'
            options={categories?.data?.map((el) => ({ value: el.nameRu, name: el.nameRu, id: el._id }))}
          />
        </Box>
        <Box mt={2} display='flex' columnGap={3} width='100%'>
          <InputSwitch
            id='working_hours'
            name='working_hours'
            label='Рабочее время'
            defaultValue='24_7'
            options={[
              { title: 'Настроить', value: 'custom' },
              { title: 'Всегда доступен 24/7', value: '24_7' },
            ]}
          />
          <InputSwitch
            id='fast_delivery'
            name='fast_delivery'
            label='Быстрая доставка'
            defaultValue='false'
            options={[
              { title: 'Да', value: 'true' },
              { title: 'Нет', value: 'false' },
            ]}
          />
        </Box>
        {workingHours === 'custom' && (
          <Box
            rowGap={2}
            display='flex'
            flexDirection='column'
            borderRadius={4}
            width='100%'
            sx={(theme) => ({ bgcolor: theme.palette.grey[100] })}
            p={4}
            mt={2}
            columnGap={3}
          >
            {WeekData?.map((el) => (
              <Box key={el.id} alignItems='center' display='inline_flex'>
                <Typography textTransform='capitalize' minWidth={128} mr={2}>
                  {el.name}:
                </Typography>
                <TextField white required type='time' name={`${el.id}_time_start`} defaultValue='9:00' />
                <Typography mx={2}>-</Typography>
                <TextField white required type='time' name={`${el.id}_time_end`} placeholder='09:00' />
              </Box>
            ))}
          </Box>
        )}

        <MapSelect
          defaultValue={shopData && [shopData?.location?.lat, shopData?.location?.long]}
          label='Адрес магазина'
          onChange={(address) => setValue('address', address)}
        />

        <Box mt={2} display='flex' columnGap={3} width='100%'>
          <TextField required multiline fullWidth name='description' label='Описание' placeholder='Введите описание' />
        </Box>
      </>
      <SectionTitle noWrap withLine>
        Информация о контракте
      </SectionTitle>
      <>
        <Box display='flex' columnGap={3} width='100%'>
          <InputSwitch
            id='activity_type'
            name='activity_type'
            label='Выберите вид деятельности'
            required={true}
            defaultValue='LEGAL_ENTITY'
            options={[
              { title: 'Физическое лицо', value: 'NATURAL_PERSON' },
              { title: 'Юридическое лицо', value: 'LEGAL_ENTITY' },
              { title: 'Индивидуальный предприниматель', value: 'INDIVIDUAL_ENTREPRENEUR' },
            ]}
          />
        </Box>
        <Box mt={2} display='flex' columnGap={3} width='100%'>
          <TextField
            required
            fullWidth
            name='pinfl_or_tin'
            label={activityType === 'LEGAL_ENTITY' ? 'ИНН' : 'ПИНФЛ'}
            placeholder={activityType === 'LEGAL_ENTITY' ? 'Введите ИНН' : 'Введите ПИНФЛ'}
          />
          <TextField
            inputRef={activityType === 'NATURAL_PERSON' ? card_number_ref : bill_number_ref}
            required
            fullWidth
            name='card_or_bill_number'
            label={activityType === 'NATURAL_PERSON' ? 'Номер карты' : 'Расчетный счет'}
            placeholder={activityType === 'NATURAL_PERSON' ? 'Введите номер карты' : 'Введите расчетный счет'}
          />
          {activityType !== 'NATURAL_PERSON' && <TextField required fullWidth name='mfo' label='МФО' placeholder='Введите МФО' />}
        </Box>
      </>
      <SectionTitle noWrap withLine>
        Файлы контрактов
      </SectionTitle>
      <>
        <Box display='flex' columnGap={3} width='100%'>
          <FileUploadInput
            defaultValue={{
              key: shopData?.contract?.contractFile,
              name: shopData?.contract?.contractFile?.substring(25, shopData?.contract?.contractFile?.length),
              size: 5000,
            }}
            label='Файл контракта'
            placeholder='Выбрать файл контракта (PDF)'
            id='contract_file'
            onChange={(file) => setValue('contract_file', file)}
          />
          <InputDatePicker name='contract_date' id='contract_date' label='Дата контракта' placeholder='Выберите дату контракта' />
          <TextField fullWidth name='contract_number' label='Номер контракта' placeholder='Введите номер контракта' />
        </Box>
        <Box mt={2} display='flex' columnGap={3} width='100%'>
          <FileUploadInput
            defaultValue={{
              key: shopData?.contract?.directorPassport,
              name: shopData?.contract?.directorPassport?.substring(25, shopData?.contract?.directorPassport?.length),
              size: 5000,
            }}
            label='Паспорт директора'
            placeholder='Загрузить паспорт директора (PDF)'
            id='passport'
            onChange={(file) => setValue('passport', file)}
          />
          <FileUploadInput
            defaultValue={{
              key: shopData?.contract?.companyCertificate,
              name: shopData?.contract?.companyCertificate?.substring(25, shopData?.contract?.companyCertificate?.length),
              size: 5000,
            }}
            label='Сертификат компании'
            placeholder='Загрузить сертификат компании (PDF)'
            id='certificate'
            onChange={(file) => setValue('certificate', file)}
          />
        </Box>
      </>
      <SectionTitle noWrap withLine>
        Социальные сети
      </SectionTitle>
      <Box display='flex' columnGap={3} width='100%'>
        <TextField fullWidth name='instagram' label='Инстаграм' placeholder='Введите никнейм инстаграме' />
        <TextField fullWidth name='facebook' label='Фейсбук' placeholder='Введите никнейм фейсбука' />
        <TextField fullWidth name='telegram' label='Телеграм' placeholder='Введите никнейм телеграм' />
        <TextField fullWidth name='website' label='Веб сайт' placeholder='Введите ссылку на сайт' />
      </Box>
    </Box>
  )
}
