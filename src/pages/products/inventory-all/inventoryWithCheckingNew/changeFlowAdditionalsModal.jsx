import { Box, Button, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import errorAudio from '../../../../assets/audio/error.mp3'
import successAudio from '../../../../assets/audio/normal.mp3'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function ChangeFlowAdditionalsModal({ open, setBarcode, refetch, setOpen }) {
  const theme = useTheme()
  const { id } = useParams()
  const methods = useForm()

  const { reset } = methods

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const qtyRef = useRef([])

  const [newRtailPrice, setNewRtailPrice] = useState('')
  const [newExpiredDate, setNewExpiredDate] = useState('')
  const [newExpiredDateRef, setNewExpiredDateRef] = useState(null)

  const { mutate: setScanedNumber, isLoading: issetScanedNumber } = useMutation(requests.sendScannedInventoryFlowNumber, {
    onSuccess: () => {
      refetch()
      setOpen(false)
      successScanAudio.play()
      setBarcode('')
    },
    onError: () => {
      refetch()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

  useEffect(() => {
    reset({}, { keepDirty: true })

    if (open) {
      setNewRtailPrice(get(open, 'data.retail_price', 0))
      setNewExpiredDate(get(open, 'data.expire_date', 0))
      setTimeout(() => {
        qtyRef.current?.[0]?.focus()
      }, 0)
    }
  }, [open])

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd' || event.code === 'ShiftRight') {
        newExpiredDateRef?.focus()
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        let activElem = document.activeElement.tagName
        if (activElem != 'INPUT') {
          //
          qtyRef?.current?.[0]?.focus()
          //
          return
        }
        if (Number(newRtailPrice) === 0 && Number(newExpiredDate) === 0) {
          setOpen(false)
          return
        }
        if (issetScanedNumber) {
          setOpen(false)
          return
        }
      }
    },
    {
      enabled: Boolean(open),
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  const onSubmit = () => {
    setScanedNumber({
      id,
      product_id: get(open, 'data.id'),
      type: 'MANUAL',
      retail_price: Number(newRtailPrice),
      expire_date: dayjs(newExpiredDate, 'YYYY.MM.DD').format('YYYY-MM-DD'),
    })
  }
  return (
    <StyledEmptyDialog
      overflowVisible
      maxWidth='500px'
      onClose={() => setOpen(false)}
      open={open}
      noHeader
      title={'Создать бонусный продукт'}
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
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>
          {get(open, 'data.name')} ({get(open, 'data.id')}) flow
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', justifyContent: 'space-between' }}>
            <Box width={'100%'}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Цена</Typography>
              <TextField
                type='number'
                name='retial_price'
                value={newRtailPrice}
                onChange={(e) => setNewRtailPrice(e.target.value)}
                inputRef={(e) => (qtyRef.current[0] = e)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-', 'ArrowDown']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
              />
            </Box>

            <Box width={'100%'}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Срок</Typography>
              <TextField
                sx={{ width: '100%' }}
                type='date'
                name='expire_date'
                value={newExpiredDate}
                inputRef={(ref) => setNewExpiredDateRef(ref)}
                onChange={(e) => setNewExpiredDate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.code == 'Enter') {
                    onSubmit()
                  }
                  const invalidKeys = ['e', 'E', '+', '-', 'ArrowDown']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
              />
            </Box>
          </Box>

          <Button
            sx={{
              height: '46px',
              mt: '20px',
            }}
            onClick={() => onSubmit()}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
