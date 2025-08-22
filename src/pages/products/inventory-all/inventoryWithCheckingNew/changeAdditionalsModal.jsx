import { Box, Button, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../../utils/requests'
import thousandDivider from '../../../../../utils/thousandDivider'
import { error } from '../../../../../utils/toast'
import errorAudio from '../../../../assets/audio/error.mp3'
import successAudio from '../../../../assets/audio/normal.mp3'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function ChangeAdditionalsModal({ open, selectedIndex, selectedCellRowId, setshouldICleanSearchQuery, refetch, setOpen }) {
  const methods = useForm()
  const { reset } = methods
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const retilaPirceRef = useRef([])
  const [newRtailPrice, setNewRetailPrice] = useState('')
  const [newBarcode, setNewBarcode] = useState('')
  const [newBarcodeRef, setNewBarcodeRef] = useState(null)

  let currentOffset = Math.floor(selectedIndex / 50) * 50
  const { data: priceOptionList, refetch: refetchInverStatus } = useQuery(
    ['priceOptionList', open],
    () => requests.getPriceOptions({ product_id: get(open, 'data.id'), limit: 5 }),
    { enabled: !!get(open, 'data.id') }
  )

  const { mutate: setScanedNumber, isLoading: issetScanedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      refetch(currentOffset)
      setOpen(false)
      successScanAudio.play()
      setshouldICleanSearchQuery(true)
    },
    onError: () => {
      refetch(currentOffset)
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

  useEffect(() => {
    reset({}, { keepDirty: true })

    if (open) {
      setNewRetailPrice(get(open, 'data.retail_price', 0))
      setNewBarcode(get(open, 'data.barcode', 0))
      setTimeout(() => {
        retilaPirceRef.current?.[0]?.focus()
      }, 0)
    }
  }, [open])

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd' || event.code === 'ShiftRight') {
        newBarcodeRef?.focus()
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        let activElem = document.activeElement.tagName
        if (activElem != 'INPUT') {
          //
          retilaPirceRef?.current?.[0]?.focus()
          //
          return
        }
        if (Number(newRtailPrice) === 0 && Number(newBarcode) === 0) {
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
      barcode: newBarcode,
    })
  }
  return (
    <StyledEmptyDialog
      overflowVisible
      maxWidth='500px'
      onClose={() => setOpen(false)}
      open={open && !selectedCellRowId}
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

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', justifyContent: 'space-between' }}>
            <Box maxWidth={'250px'}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Цена</Typography>
              <TextField
                type='number'
                name='retial_price'
                value={newRtailPrice}
                onChange={(e) => setNewRetailPrice(e.target.value)}
                inputRef={(e) => (retilaPirceRef.current[0] = e)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-', 'ArrowDown']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Штрих-код</Typography>
              <TextField
                type='number'
                name='barcode'
                value={newBarcode}
                onChange={(e) => setNewBarcode(e.target.value)}
                inputRef={(ref) => setNewBarcodeRef(ref)}
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',

              width: '100%',
              mb: '20px',
              flexWrap: 'wrap',
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Предлагаемая цена</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',

                width: '100%',
                m: '15px 0',
                flexWrap: 'wrap',
              }}
            >
              {get(priceOptionList, 'data.data', [])?.map((price) => (
                <Typography
                  onClick={() => {
                    setNewRetailPrice(get(price, 'retail_price', 0))
                  }}
                  sx={{ fontSize: 14, m: '5px 5px', backgroundColor: 'bg.10', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', fontWeight: 600 }}
                >
                  {thousandDivider(get(price, 'retail_price', 0), 'сум')}
                </Typography>
              ))}
            </Box>
          </Box>
          <Button
            sx={{
              height: '46px',
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
