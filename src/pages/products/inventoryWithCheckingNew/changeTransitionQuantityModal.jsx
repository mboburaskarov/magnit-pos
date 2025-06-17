import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ChangeTransitionQuantityModal({ open, setBarcode, refetch, setOpen }) {
  const theme = useTheme()
  const { id } = useParams()
  const methods = useForm()

  const { reset } = methods

  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const qtyRef = useRef([])

  const [factQuantity, setFactQuantity] = useState('')
  const [factUnit, setFactUnit] = useState('')
  const [factUnitRef, setFactUnitRef] = useState(null)

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
      setFactQuantity('')
      setFactUnit('')
      setTimeout(() => {
        qtyRef.current?.[0]?.focus()
      }, 0)
    }
  }, [open])

  useHotkeys(
    '*',
    (event) => {
      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd' || event.code === 'ShiftRight') {
        factUnitRef?.focus()
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        let activElem = document.activeElement.tagName
        if (activElem != 'INPUT') {
          //
          qtyRef?.current?.[0]?.focus()
          //
          return
        }
        if (Number(factQuantity) === 0 && Number(factUnit) === 0) {
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
          type: 'MANUAL',
          fact_quantity: Number(factQuantity),
          fact_unit: Number(factUnit),
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
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <Typography sx={{ m: 'auto', width: '100%', textAlign: 'center', mb: '20px', fontWeight: '600' }}>
          {get(open, 'data.name')} ({get(open, 'data.id')}) flow
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', mb: '20px', width: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Факт УП</Typography>
              <TextField
                id='packQtyInput'
                type='number'
                value={factQuantity}
                onChange={(e) => setFactQuantity(e.target.value)}
                inputRef={(e) => (qtyRef.current[0] = e)}
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
                value={factUnit}
                onChange={(e) => setFactUnit(e.target.value)}
                inputRef={(ref) => setFactUnitRef(ref)}
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
