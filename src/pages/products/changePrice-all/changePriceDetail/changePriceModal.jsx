import { ArrowCircleRight, WarningAmber } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import OutLineTextFieldThousand from '@components/Inputs/OutLineTextFieldThousand'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import errorAudio from '@/assets/audio/error.mp3'
import successAudio from '@/assets/audio/normal.mp3'
import CloseIcon from '@icons/CloseIcon'
import thousandDivider from '@utils/thousandDivider'

export default function ChangePriceModal({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset } = methods
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const qtyRef = useRef([])

  const [openMaxPriceDialog, setOpenMaxPriceDialog] = useState(false)
  const [newPrice, setNewPrice] = useState('')
  const [newPercent, setNewPercent] = useState('')
  const [isUpdatingFromPercent, setIsUpdatingFromPercent] = useState(false)
  const [isUpdatingFromPrice, setIsUpdatingFromPrice] = useState(false)

  const { mutate: setScanedNumber } = useMutation(requests.changePriceNew, {
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

  const calculatePriceFromPercent = (percent) => {
    const oldPrice = get(open, 'data.old_supply_price', 0)
    if (percent && oldPrice) {
      return (oldPrice * percent) / 100 + oldPrice
    }
    return ''
  }

  const calculatePercentFromPrice = (price) => {
    const oldPrice = get(open, 'data.old_supply_price', 0)
    if (price && oldPrice) {
      return ((price - oldPrice) / oldPrice) * 100
    }
    return ''
  }

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

      setNewPercent(calculatedPercent)
      setTimeout(() => setIsUpdatingFromPrice(false), 0)
    }
  }

  const handlePresetPercent = (percent) => {
    setNewPercent(percent)
    const calculatedPrice = calculatePriceFromPercent(percent)
    setNewPrice(calculatedPrice)
  }

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

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (Number(newPrice) === 0) {
          setOpen(false)
          return
        }
        if (get(open, 'data.max_price', 0) != 0 && get(open, 'data.max_price', 0) < Number(newPrice)) {
          setOpenMaxPriceDialog({
            open: true,
            data: get(open, 'data'),
            newPrice,
          })
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
    },
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
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Цена поставщика</Typography>
              <OutLineTextFieldThousand
                type={'number'}
                fullWidth
                name='pack'
                defaultValue={get(open, 'data.old_supply_price', '')}
                label={''}
                uncontrolled
                disabled={true}
                placeholder='0'
              />
            </Box>

            <ArrowCircleRight sx={{ m: '35px 10px 0', fontSize: '25px', color: '#fe5000 !important' }} />

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
            </Box>
          </Box>
        </Box>
      </Box>
      <StyledEmptyDialog
        overflowVisible
        onClose={() => setOpenMaxPriceDialog(false)}
        open={openMaxPriceDialog.open}
        noHeader
        maxWidth={'500px'}
        title={'Создать бонусный продукт'}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpenMaxPriceDialog(false)} />}
      >
        <Box sx={{ padding: '24px' }}>
          {/* warning and confirmation for max price */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '10px' }}>
            <WarningAmber sx={{ fontSize: '60px' }} color='warning' />
            <Typography sx={{ ml: '5px', mb: '10px', fontWeight: '600', color: 'bunker.950', textAlign: 'center' }}>
              Belgilangan Feferent narxga togri kelmaydi!
            </Typography>
            <Typography sx={{ ml: '5px', mb: '10px', color: 'bunker.950', textAlign: 'center' }}>
              Kiritilgan narx belgilangan ({`${thousandDivider(openMaxPriceDialog?.data?.max_price,'сум')}`}) maksimal narxdan oshib ketdi!
            </Typography>
          </Box>
          {/* confirmation buttons */}
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <Button
              onClick={() => {
                ;(setScanedNumber({
                  id,
                  product_id: get(open, 'data.id'),
                  new_retail_price: Number(newPrice),
                  store_product_id: get(open, 'data.store_product_id'),
                }),
                  setOpen(false),
                  setOpenMaxPriceDialog(false))
              }}
              sx={(theme) => ({ width: '100%', padding: '8px 12px', borderRadius: '28px', background: theme.palette.background.default })}
              variant='outlined'
            >
              Ha
            </Button> */}
            <Box width={'10px'} />
            <Button
              onClick={() => {
                (setOpen(false), setOpenMaxPriceDialog(false))
              }}
              sx={{ width: '100%' }}
            >
              Tushundim
            </Button>
          </Box>
        </Box>
      </StyledEmptyDialog>
    </StyledEmptyDialog>
  )
}
