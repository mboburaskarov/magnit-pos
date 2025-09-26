import { ArrowCircleRight } from '@mui/icons-material'
import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import OutLineTextFieldThousand from '../../../../../components/Inputs/OutLineTextFieldThousand'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import errorAudio from '../../../../assets/audio/error.mp3'
import successAudio from '../../../../assets/audio/normal.mp3'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function ChangePriceModal({ open, refetch, setOpen, gridApi }) {
  const methods = useForm()
  const { reset, setValue } = methods
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const qtyRef = useRef([])

  const [newPrice, setNewPrice] = useState('')
  const [newPercent, setNewPercent] = useState('')
  const [isUpdatingFromPercent, setIsUpdatingFromPercent] = useState(false)
  const [isUpdatingFromPrice, setIsUpdatingFromPrice] = useState(false)

  const { mutate: setScanedNumber, isLoading: issetScanedNumber } = useMutation(requests.changePriceNew, {
    onSuccess: ({ data }) => {
      refetch()
      setOpen(false)
      successScanAudio.play()
    },
    onError: () => {
      refetch()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

  // Calculate new price from percentage
  const calculatePriceFromPercent = (percent) => {
    const oldPrice = get(open, 'data.old_supply_price', 0)
    if (percent && oldPrice) {
      return (oldPrice * percent) / 100 + oldPrice
    }
    return ''
  }

  // Calculate percentage from new price
  const calculatePercentFromPrice = (price) => {
    const oldPrice = get(open, 'data.old_supply_price', 0)
    if (price && oldPrice) {
      return ((price - oldPrice) / oldPrice) * 100
    }
    return ''
  }

  // Handle percentage change
  const handlePercentChange = (value) => {
    if (value < 0) {
      setNewPercent('')
      return
    }
    const numValue = value === '' ? '' : Number(value)
    setNewPercent(numValue)

    if (!isUpdatingFromPrice) {
      setIsUpdatingFromPercent(true)
      const calculatedPrice = calculatePriceFromPercent(numValue)
      setNewPrice(Math.ceil(calculatedPrice / 100) * 100)
      setTimeout(() => setIsUpdatingFromPercent(false), 0)
    }
  }

  // Handle price change
  const handlePriceChange = (value) => {
    if (value < 0) {
      setNewPrice('')
      return
    }
    const numValue = value === '' ? '' : Number(value)
    setNewPrice(numValue)
    if (!isUpdatingFromPercent) {
      setIsUpdatingFromPrice(true)
      const calculatedPercent = calculatePercentFromPrice(numValue)
      console.log(calculatedPercent)

      setNewPercent(calculatedPercent)
      setTimeout(() => setIsUpdatingFromPrice(false), 0)
    }
  }

  // Handle preset percentage buttons
  const handlePresetPercent = (percent) => {
    setNewPercent(percent)
    const calculatedPrice = calculatePriceFromPercent(percent)
    setNewPrice(calculatedPrice)
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    reset({}, { keepDirty: true })
    if (open) {
      setNewPrice('')
      setNewPercent('')
      setIsUpdatingFromPercent(false)
      setIsUpdatingFromPrice(false)
      setTimeout(() => {
        qtyRef.current?.[0]?.focus()
      }, 10)
    }
  }, [open, reset])

  // Handle keyboard shortcuts
  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (Number(newPrice) === 0) {
          setOpen(false)
          return
        }

        setScanedNumber({
          id,
          product_id: get(open, 'data.id'),
          new_retail_price: Number(newPrice),
          store_product_id: get(open, 'data.store_product_id'),
        })
      }
    },
    {
      enabled: Boolean(open),
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useEffect(() => {
    const markup = get(open, 'data.new_markup', '')
    if (markup != -100 && markup != 0) {
      setNewPercent(markup)
    }
    setNewPrice(get(open, 'data.new_retail_price', ''))
  }, [open])
  return (
    <StyledEmptyDialog
      overflowVisible
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
        }}
      >
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>{get(open, 'data.name')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', alignItems: 'start', justifyContent: 'space-between' }}>
            {/* Old Price */}
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Цена поставщика</Typography>
              <TextField type='number' name='pack' value={get(open, 'data.old_supply_price', '')} disabled={true} />
            </Box>

            <ArrowCircleRight sx={{ m: '35px 10px 0', fontSize: '25px', color: '#fe5000 !important' }} />

            {/* Percentage */}
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Процент новых продаж</Typography>
              <OutLineTextFieldThousand
                setValue={(e) => handlePercentChange(e)}
                value={Math.round(newPercent)}
                type={'number'}
                fullWidth
                name='percent'
                inputRef={(e) => (qtyRef.current[0] = e)}
                defaultValue={get(open, 'data.new_markup', '')}
                label={''}
                uncontrolled
                placeholder='0'
              />
              {/* <TextField
                type='number'
                name='percent'
                value={newPercent}
                defaultValue={get(open, 'data.new_markup', '')}
                onChange={(e) => handlePercentChange(e.target.value)}
                inputRef={(e) => (qtyRef.current[0] = e)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
                placeholder='0'
              /> */}
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: '10px',
                  '& p': {
                    cursor: 'pointer',
                    padding: '5px 10px',
                    backgroundColor: theme.palette.bg[10],
                    borderRadius: 5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    },
                  },
                })}
              >
                <Typography onClick={() => handlePresetPercent(15)}>15%</Typography>
                <Typography onClick={() => handlePresetPercent(20)}>20%</Typography>
                <Typography onClick={() => handlePresetPercent(25)}>25%</Typography>
              </Box>
            </Box>

            <ArrowCircleRight sx={{ m: '35px 10px 0', fontSize: '25px', color: '#fe5000 !important' }} />

            {/* New Price */}
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Новая цена продажи</Typography>
              <OutLineTextFieldThousand
                setValue={(e) => handlePriceChange(e)}
                value={newPrice}
                type={'number'}
                fullWidth
                defaultValue={get(open, 'data.new_retail_price', '')}
                name='unit'
                label={''}
                inputRef={(e) => (qtyRef.current[1] = e)}
                uncontrolled
                placeholder='0'
              />
              {/* <TextField
                type='number'
                name='unit'
                value={newPrice}
                defaultValue={get(open, 'data.new_retail_price', '')}
                onChange={(e) => handlePriceChange(e.target.value)}
                inputRef={(e) => (qtyRef.current[1] = e)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
                placeholder='0'
              /> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
