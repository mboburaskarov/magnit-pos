import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import CloseIcon from '../../../assets/icons/CloseIcon'
export default function ChangeQuantityModal({ open, setBarcode, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const [startDate, setStartDate] = useState(0)
  const qtyRef = useRef([])
  const { id } = useParams()

  const [endDate, setEndDate] = useState(0)
  const { mutate: createBonusProduct, isLoading: iscreateBonusProduct } = useMutation(requests.createBonusProduct, {
    onSuccess: () => {
      setOpen(false)
      success('Создать автозаказ')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать автозаказ!')
      console.log('err', err)
    },
  })
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      refetch()
      setOpen(false)
      successScanAudio.play()
      setBarcode('')
      // fetchStatusCountList()
      // setBarcode('')g
    },
    onError: (err) => {
      refetch()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

  useEffect(() => {
    reset({}, { keepDirty: true })
    if (open) {
      setTimeout(() => {
        qtyRef.current?.[0]?.focus()
      }, 200)
    }
  }, [open])
  const theme = useTheme()

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd' || event.code === 'ShiftRight') {
        qtyRef.current[1].focus()
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        setScanedNumber({
          id,
          product_id: get(open, 'data.id'),
          type: 'MANUAL',
          fact_quantity: Number(qtyRef.current[0].value),
          fact_unit: Number(qtyRef.current[1].value),
          barcode: qtyRef.current[2].value,
          retail_price: Number(qtyRef.current[4].value),

          expire_date: qtyRef.current[3].value,
        })
      }
    },
    {
      enabled: Boolean(open),
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  const { t } = useTranslation()
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
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>{get(open, 'data.name')}</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              mb: '20px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Факт УП</Typography>
              <TextField
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']

                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                    return
                  }
                }}
                onFocus={(e) => {
                  qtyRef.current[0].value = ''
                }}
                onBlur={(e) => {
                  if (e.target.value == '') {
                    qtyRef.current[0].value = get(open, 'data.fact_quantity')
                  }
                }}
                defaultValue={get(open, 'data.fact_quantity')}
                name='pack'
                inputRef={(e) => (qtyRef.current[0] = e)}
                type='number'
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Факт кол-во</Typography>

              <TextField
                onFocus={(e) => {
                  qtyRef.current[1].value = ''
                }}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']

                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                    return
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value == '') {
                    qtyRef.current[1].value = get(open, 'data.fact_unit')
                  }
                }}
                defaultValue={get(open, 'data.fact_unit')}
                name='unit'
                inputRef={(e) => (qtyRef.current[1] = e)}
                type='number'
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: '20px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                width: '100%',
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Штрих-код</Typography>

              <TextField
                // onFocus={(e) => {
                //   qtyRef.current[2].value = ''
                // }}
                // onBlur={(e) => {
                //   if (e.target.value == '') {
                //     qtyRef.current[2].value = get(open, 'data.barcode')
                //   }
                // }}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']

                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                    return
                  }
                }}
                sx={{
                  width: '100%',
                }}
                defaultValue={get(open, 'data.barcode')}
                name='barcode'
                inputRef={(e) => (qtyRef.current[2] = e)}
                type='number'
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              mb: '20px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Цена</Typography>

              <TextField
                // onFocus={(e) => {
                //   qtyRef.current[4].value = ''
                // }}
                // onBlur={(e) => {
                //   if (e.target.value == '') {
                //     qtyRef.current[4].value = get(open, 'data.retail_price')
                //   }
                // }}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']

                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                    return
                  }
                }}
                defaultValue={get(open, 'data.retail_price')}
                name='retail_price'
                inputRef={(e) => (qtyRef.current[4] = e)}
                type='number'
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Срок</Typography>

              <TextField
                // onFocus={(e) => {
                //   qtyRef.current[3].value = ''
                // }}
                // onBlur={(e) => {
                //   if (e.target.value == '') {
                //     qtyRef.current[3].value = get(open, 'data.expire_date')
                //   }
                // }}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']

                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault()
                    return
                  }
                }}
                defaultValue={dayjs(get(open, 'data.expire_date')).format('YYYY-MM-DD')}
                name='date'
                inputRef={(e) => (qtyRef.current[3] = e)}
                type='date'
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
