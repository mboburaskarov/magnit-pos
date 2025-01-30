import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import OutLineTextField from '../../../components/Inputs/OutLineTextField'
import { error } from '../../../utils/toast'
import CloseIcon from '../../assets/icons/CloseIcon'

export default function MeasurementValueDialog({ open, setValue, setOpen }) {
  const [sum, setSum] = useState(0)

  const onSubmit = (data) => {
    if (sum <= 0) return error('Введите цену поставки')
    setValue(`${open?.name}.measurement_value`, open?.measurement_value)
    setValue(`${open?.name}.supply_price`, Number(sum))
    setOpen(false)
    setSum(0)
  }
  const closeBox = () => {
    setValue(`${open?.name}.pack_quantity`, open?.oldValue)

    setOpen(false)
  }

  const theme = useTheme()

  return (
    <StyledEmptyDialog open={open} title={'Добавить поступление?'} customButtons={<CloseIcon color={theme.palette.black} onClick={() => closeBox()} />}>
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
        <Box rowGap={3} flexWrap='wrap' display='flex' component='form'>
          <Typography fontSize={'17px'} fontWeight={'500'} m={'auto'}>
            Введите цену прихода и поставщика для добавленных продуктов
          </Typography>
          <Box my={'40px'} px={'20px'} display={'flex'}>
            <OutLineTextField
              endAdornmentText={'шт'}
              type='number'
              fullWidth
              disabled={true}
              InputProps={{
                disabled: true,
              }}
              uncontrolled
              borderRadius={'40px'}
              name='markupa'
              value={get(open, 'measurement_value')}
              label={'Кол-во'}
              placeholder={'0'}
            />
            <Box width={'40px'} />
            <OutLineTextField
              endAdornmentText={'сум'}
              required
              uncontrolled
              onBlur={({ target }) => {
                setSum(get(target, 'value'))
              }}
              type='number'
              fullWidth
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              borderRadius={'40px'}
              name='markup'
              label={'Цена прихода'}
              placeholder={'0'}
            />
          </Box>

          <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
            <Button
              sx={{ bgcolor: `${theme.palette.background.gray} !important`, border: '1px solid #ECEDF2' }}
              fullWidth
              onClick={() => closeBox()}
              color='secondary'
              variant='contained'
            >
              <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                Отменить
              </Typography>
            </Button>
            <Button onClick={() => onSubmit()} fullWidth variant='contained'>
              Добавить
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
