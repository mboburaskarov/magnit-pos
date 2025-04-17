import { Box, Button, Dialog, Typography } from '@mui/material'
import { get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import TextField from '../../../../components/Inputs/TextField'
import { checkBarcodeWithMarking } from '../../../../utils/checkingMarkingWithBarcode'
import { error } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
function ImplementMarkingDialog({
  open,
  setIsOrderDrower,
  isAllMarkingFill,
  markingCount,
  handleClose,
  setLiteOrder,
  liteOrder,
  cartItems,
  implementMarkingList,
  markingsList,
  setMarkingList,
}) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const inputsRef = useRef([])
  const { t } = useTranslation()
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputsRef.current.filter((a) => a && a.value == '')[0]?.focus()
      }, 100)
    }
  }, [open])
  const addEmptyStringMarkToMarkinglessProduct = (markings, shouldHaveMarkings) => {
    let newMarkingList = { ...markings }
    for (const key in shouldHaveMarkings) {
      const count = shouldHaveMarkings[key]
      const existingValues = markings[key] || {}
      const mergedValues = {}
      for (let i = 0; i < count; i++) {
        mergedValues[i] = existingValues[i] || ''
      }
      newMarkingList[key] = mergedValues
    }
    setMarkingList(newMarkingList)
    if (get(open, 'mode', 'lite') === 'lite') {
      setLiteOrder(true)
    } else {
      setIsOrderDrower(true)
    }
    handleClose()
    setOpenConfirmDialog(null)
  }
  const checkMarkingBarcode = (e, flatIndex, productBarcode) => {
    console.log(checkBarcodeWithMarking(productBarcode, e), e, productBarcode)

    if (!checkBarcodeWithMarking(productBarcode, e)) {
      inputsRef.current[flatIndex].value = ''
      error('Маркировка и штрих-код не поступили.')
      return false
    } else {
      return true
    }
  }
  useEffect(() => {
    if (markingsList.length) {
      if (!isAllMarkingFill()) {
        // Open order drawer or lite mode
        setOpenConfirmDialog(true)
        setLiteOrder(false)
        setIsOrderDrower(false)
      }
    }
  }, [markingsList]) // Replace with actual marking state dependency

  const handleKeyDown = (e, flatIndex, productBarcode, id, childIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (checkMarkingBarcode(e.target.value, flatIndex, productBarcode)) {
        if (implementMarkingList(e.target.value, id, childIndex)) {
        } else {
          inputsRef.current[flatIndex].value = ''
          error('Эта маркировка использовалась.')
          return
        }

        if (inputsRef.current.length - 1 == flatIndex) {
          // if (!isAllMarkingFill()) {
          //   setOpenConfirmDialog(true)

          //   return
          // }
          if (get(open, 'mode', 'lite') === 'lite') {
            setLiteOrder(true)
          } else {
            setIsOrderDrower(true)
          }
          handleClose()
          return
        }
        const currentIndex = Object.keys(inputsRef.current).findIndex((key) => key == flatIndex)
        const nextIndex = Object.keys(inputsRef.current)[currentIndex + 1]
        const nextInput = inputsRef.current[nextIndex]
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  // Calculate flat index from parent and child indexes
  const getFlatIndex = (parentIndex, childIndex, markingCounts) => {
    let flatIndex = 0
    for (let i = 0; i < parentIndex; i++) {
      flatIndex += markingCounts[cartItems[i].id] || 0
    }
    return flatIndex + childIndex
  }

  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '20px',
          position: 'relative !important',
          pb: '10px',
        },
      }}
      onClose={handleClose}
      open={open}
      disableScrollLock
    >
      <Box sx={{ minWidth: '600px', padding: '20px' }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            m: '10px 0px',
            borderRadius: '20px',
          }}
        >
          <Typography color={'#fe5000'} fontWeight={'500'}>
            {t('new_order.marking_dialog_info')}
          </Typography>
        </Box>

        {cartItems.map((item, parentIndex) => {
          if (!Object.keys(markingCount || {}).includes(item.id)) return
          return (
            <Box
              key={item.id}
              sx={{
                display: get(item, 'is_marking') ? 'block' : 'none',

                padding: '5px 10px',
                backgroundColor: '#f3f3f3',
                m: '10px 0px',
                borderRadius: '20px',
              }}
            >
              <Typography fontWeight={'600'} my={'10px'}>
                {item.name}
              </Typography>
              {Array(markingCount[item.id])
                .fill(1)
                .map((_, childIndex) => {
                  const flatIndex = getFlatIndex(parentIndex, childIndex, markingCount)

                  return (
                    <Box
                      key={`${item.id}-${childIndex}`}
                      sx={{
                        mb: '5px',
                        mt: '10px',
                        '.MuiFormControl-root': {
                          backgroundColor: 'transparent !important',
                        },
                        '.input-label': {
                          mb: '0px !important',
                        },
                      }}
                    >
                      <TextField
                        uncontrolled
                        setValue={
                          (e) => {}

                          //  checkMarkingBarcode(e, flatIndex, item.barcode) &&
                        }
                        defaultValue={markingsList?.[item.id]?.[childIndex]}
                        required={get(item, 'is_marking')}
                        onKeyDown={(e) => handleKeyDown(e, flatIndex, item.barcode, item.id, childIndex)}
                        fullWidth
                        inputRef={(el) => get(item, 'is_marking') && (inputsRef.current[flatIndex] = el)}
                        borderRadius={'40px'}
                        name={`${item.id}-${childIndex}`}
                        id={`${item.id}-${childIndex}`}
                        label={t('marking')}
                        placeholder={t('marking.placeholder')}
                        sx={{ mb: 0 }}
                      />
                    </Box>
                  )
                })}
            </Box>
          )
        })}
      </Box>

      {/* Rest of your dialog footer remains the same */}
      <Box
        display={'flex'}
        sx={{
          bottom: 0,
          right: 0,
          backgroundColor: '#fff',
          left: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
        }}
      >
        <Button onClick={handleClose} color='secondary' variant='contained' fullWidth>
          {t('cancel')}
        </Button>
        <Box width={'20px'} />
        <Button
          onClick={() => {
            if (!isAllMarkingFill()) {
              setOpenConfirmDialog(true)
              return
            }
            if (get(open, 'mode', 'lite') === 'lite') {
              setLiteOrder(true)
            } else {
              setIsOrderDrower(true)
            }

            addEmptyStringMarkToMarkinglessProduct(markingsList, markingCount)
            handleClose()
          }}
          fullWidth
        >
          {t('continue')}
        </Button>
      </Box>

      <ConfirmDialog
        open={!!openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningIcon />}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setOpenConfirmDialog(false)
          }
        }}
        title={t('no_marking')}
        desc={t('new_order.empty_marking.dialog_info')}
        actions={
          <>
            <Button
              sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
              fullWidth
              color='secondary'
              variant='contained'
              onClick={() => {
                setOpenConfirmDialog(null)
              }}
            >
              {t('Закрыть диалог')}
            </Button>
            {/* <LoadingButton
              variant='contained'
              type='button'
              onClick={() => {
                addEmptyStringMarkToMarkinglessProduct(markingsList, markingCount)
              }}
            >
              {t('continue')}
            </LoadingButton> */}
          </>
        }
      />
    </Dialog>
  )
}

export default ImplementMarkingDialog
