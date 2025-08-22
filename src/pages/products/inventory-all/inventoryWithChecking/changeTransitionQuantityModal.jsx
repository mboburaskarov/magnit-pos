import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import errorAudio from '../../../../assets/audio/error.mp3'
import successAudio from '../../../../assets/audio/normal.mp3'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function ChangeTransitionQuantityModal({ open, setBarcode, refetch, setOpen }) {
  const theme = useTheme()
  const { id } = useParams()
  const { t } = useTranslation()

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)

  const [packQty, setPackQty] = useState('')
  const [unitQty, setUnitQty] = useState('')

  const { mutate: setScanedNumber } = useMutation(requests.sendScannedInventoryFlowNumber, {
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
    if (open) {
      setPackQty('')
      setUnitQty('')
      setTimeout(() => {
        document.getElementById('packQtyInput')?.focus()
      }, 200)
    }
  }, [open])

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        const pack = Number(packQty)
        const unit = Number(unitQty)

        if (pack === 0 && unit === 0) {
          setOpen(false)
          setBarcode('')
          return
        }

        setScanedNumber({
          id,
          product_id: get(open, 'data.id'),
          type: 'MANUAL',
          fact_quantity: pack,
          fact_unit: unit,
        })
      }
    },
    {
      enabled: Boolean(open),
      enableOnFormTags: true,
      enableOnTags: ['INPUT'],
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
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>
          {get(open, 'data.name')} ({get(open, 'data.id')})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', width: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Факт УП</Typography>
              <TextField
                id='packQtyInput'
                type='number'
                value={packQty}
                onChange={(e) => setPackQty(e.target.value)}
                onKeyDown={(e) => {
                  const invalidKeys = ['e', 'E', '+', '-']
                  if (invalidKeys.includes(e.key)) e.preventDefault()
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Факт кол-во</Typography>
              <TextField
                type='number'
                value={unitQty}
                onChange={(e) => setUnitQty(e.target.value)}
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
