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
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ChangePriceModal({ open, refetch, setOpen, gridApi }) {
  const methods = useForm()
  const { reset } = methods
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const qtyRef = useRef([])
  const [newPrice, setNewPrice] = useState(0)

  const { mutate: setScanedNumber, isLoading: issetScanedNumber } = useMutation(requests.changePriceNew, {
    onSuccess: ({ data }) => {
      if (gridApi) {
        gridApi.refreshCells({ force: true })
        // Alternative: Refresh specific rows if you have the row ID
        // gridApi.getRowNode(get(open, 'data.id'))?.setData(updatedRowData)
      }
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

  useEffect(() => {
    reset({}, { keepDirty: true })
    if (open) {
      setNewPrice('')
      setTimeout(() => {
        qtyRef.current?.[0]?.focus()
      }, 10)
    }
  }, [open])

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (Number(newPrice) === 0) {
          setOpen(false)
          return
        }
        if (issetScanedNumber) {
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
            // fill: '#868FAA',
            // stroke: '#868FAA',
          },
        }}
      >
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>{get(open, 'data.name')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Старая цена продажи</Typography>
              <TextField type='number' name='pack' value={get(open, 'data.old_retail_price')} disabled={true} />
            </Box>
            <ArrowCircleRight sx={{ m: '20px 10px 0', fontSize: '25px', color: '#fe5000 !important' }} />

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Новая цена продажи</Typography>
              <TextField
                type='number'
                name='unit'
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                inputRef={(e) => (qtyRef.current[0] = e)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
