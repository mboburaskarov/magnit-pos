import { checkBarcodeWithMarking, extractNumbers } from '@utils/checkingMarkingWithBarcode'
import { Box, Button, Dialog, Typography } from '@mui/material'
import { containsCyrillic } from '@utils/convertoRuOrEngToEng'
import ConfirmDialog from '@components/ConfirmDialog'
import TextField from '@components/Inputs/TextField'
import { useEffect, useRef, useState } from 'react'
import BigWarningIcon from '@icons/BigWarningIcon'
import { useTranslation } from 'react-i18next'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
import { useSelector } from 'react-redux'
import { useMutation } from 'react-query'
import hasAccess from '@utils/hasAccess'
import { get } from 'lodash'

import ReChangeMarkingDialog from './ReChangeMarkingDialog'

function ImplementMarkingDialog({
  open,
  setIsOrderDrower,
  refetchcartItemsList,
  isAllMarkingFill,
  markingCount,
  handleClose,
  setLiteOrder,
  cartItems,
  markingsList,
  setMarkingList,
}) {
  const inputsRef = useRef([])
  const { t } = useTranslation()

  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [openRechangeDialog, setOpenRechangeDialog] = useState(false)
  const [changeingMarkingData, setChangeingMarkingData] = useState(false)
  const [changeingBarcodegData, setChangeingBarcodegData] = useState(false)
  const user_data = useSelector((state) => state.user)
const { mutate: saveMarkingToCartItem } = useMutation(requests.saveMarkingToCartItem, {
    onSuccess: () => {
     success('Маркировка обновлена')
      
    },
    onError: () => {
      error('Ошибка при сохранении маркировки')
    },
  })
  const implementMarkingList = (marking, id, index) => {
    if(get(open,'cashBoxDetails.data.data.sale_type','SALE') != 'RETURN'){
        saveMarkingToCartItem({
      id,
      data: {
        marking,
      },
    })
      }
    setMarkingList((prev) => ({ ...prev, [id]: { ...prev[id], [index]: marking } }))
  }

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

  useEffect(() => {
    if (markingsList.length && open) {
      if (!isAllMarkingFill()) {
        setOpenConfirmDialog(true)
        setLiteOrder(false)

        setIsOrderDrower(false)
      }
    }
  }, [markingsList])

  const handleKeyDown = (e, flatIndex, productBarcode, id, childIndex, item) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (containsCyrillic(e.target.value)) {
        inputsRef.current[flatIndex].value = ''
        error('Кириллица не поддерживается (uz: krilcha qabul qilinmaydi)')
        return
      }
      if (e.target.value.length == 0) {
        if (markingsList?.[id]?.[childIndex]?.length != 0) {
          //demak u markirofkani tozlamoqchi

          implementMarkingList(e.target.value, id, childIndex)
          return
        }

        //input bo'sh holatda enter bosildi
        inputsRef.current[flatIndex].value = markingsList?.[id]?.[childIndex]
        error("Заполните маркировку (uz: bo'sh joyni to'ldiring)")
        return
      }
      let validLength = [83, 37, 53, 94, 93, 51, 81]
      if (!validLength.includes(e.target.value.length)) {
        // markirofka uzunligi mos emas

        inputsRef.current[flatIndex].value = ''
        error("Неверная маркировка (uz: noto'g'ri uzunlikdagi markirovka)")
        return
      }

      if (Object.values(markingsList[id] || {}).includes(e.target.value) && markingsList?.[id]?.[childIndex]?.length == 0) {
        // ikki martta bir xil markirofka kiritildi
        inputsRef.current[flatIndex].value = ''

        error('Повторение маркировки (uz: takrorlangan markirovka)')
        return
      }
      if (!checkBarcodeWithMarking(productBarcode, e.target.value)) {
        //markirofkadagi barcode mahsulotniki bilan mos kelmadi
        //markirofkadagi barcode mahsulotniki bilan mos kelmadi
        if (!hasAccess('can-change-markings-barcode-onsale2', user_data)) {
          error(`Маркировка и штрих-код не поступили. (uz: markirovka va barcode mos emas. (Asl: ${productBarcode} | Sizniki:  ${e.target.value} ))`)
          inputsRef.current[flatIndex].value = ''
          return
        } else {
           const markingBarcode = extractNumbers(e.target.value)
          setChangeingBarcodegData({ value: e.target.value, id,markingBarcode, childIndex, flatIndex, item })
          // setChangeingMarkingData({ value: e.target.value, id, childIndex, flatIndex, item })

          // error(`Маркировка и штрих-код не поступили. (uz: markirovka va barcode mos emas. (Asl: ${productBarcode} | Sizniki:  ${e.target.value} ))`)
          return
        }
      }
      //hammasi ok
      if(get(open,'cashBoxDetails.data.data.sale_type','SALE') == 'RETURN'){
        if(!get(item,'markings',[]).includes(e.target.value)){
            error('Bu savdo qilingan dori markirofkasi emas!')
            return
        }
      }
      implementMarkingList(e.target.value, id, childIndex)
    }
  }

  useEffect(() => {
    if ((markingsList, cartItems.length) && open) {
      if (!isAllMarkingFill()) {
        inputsRef.current.filter((a) => a && a.value == '')[0]?.focus()

        return
      } else {
        if (get(open, 'mode', 'lite') === 'lite') {
          setLiteOrder(true)
        } else {
          setIsOrderDrower(true)
        }

        handleClose()
        return
      }
    }
  }, [markingsList])

  useEffect(() => {
    if (changeingMarkingData) {
      checkingAslName({
        markirovka: changeingMarkingData?.value,
        productId: changeingMarkingData?.item?.product_id,
        productName: changeingMarkingData?.item?.name,
      })
    }
  }, [changeingMarkingData])

    useEffect(() => {
    if (changeingBarcodegData) {
      checkingBarcode({
        barcode: changeingBarcodegData?.markingBarcode,
        product_id: changeingBarcodegData?.item?.product_id,
        cart_item_id: changeingBarcodegData?.item?.id
      })
    }
  }, [changeingBarcodegData])

  const saveNewChangedMarking = () => {
    const value = changeingMarkingData?.value
    const id = changeingMarkingData?.id
    const childIndex = changeingMarkingData?.childIndex
    
    implementMarkingList(value, id, childIndex)
  }

    const saveNewChangedBarcode = () => {
    const value = changeingBarcodegData?.value
    const id = changeingBarcodegData?.id
    const childIndex = changeingBarcodegData?.childIndex
    implementMarkingList(value, id, childIndex)
  }

  const getFlatIndex = (parentIndex, childIndex, markingCounts) => {
    let flatIndex = 0
    for (let i = 0; i < parentIndex; i++) {
      flatIndex += markingCounts[cartItems[i].id] || 0
    }
    return flatIndex + childIndex
  }
const { mutate: checkingBarcode } = useMutation(requests.checkingBarcode, {
    onSuccess: ({ data }) => {
      if(get(data, 'data.found',false)) {
        saveNewChangedBarcode()
        success('Штрих-код oбновлён. (uz: barcode yangilandi)')
      }else{
        
      inputsRef.current[changeingBarcodegData?.flatIndex].value = ''
      error(`Штрих-код не поступил. (uz: barcode mos emas. (Asl: ${changeingBarcodegData?.item?.barcode} | Sizniki:  ${changeingBarcodegData?.markingBarcode} ))`)
      }
      
    },
    onError: (err) => {
      inputsRef.current[changeingBarcodegData?.flatIndex].value = ''
      if (get(err, 'response.data.data') == 'similarity.not.enough') {
        error('Недостаточно сходств')
      } else {
        error('err: Asl belgi')
      }

      console.error('err', err)
    },
  })
  const { mutate: checkingAslName, isLoading: ischeckingAslName } = useMutation(requests.checkingAslName, {
    onSuccess: ({ data }) => {
      if (data?.data?.status == 'pending') {
        setOpenRechangeDialog(data?.data)
      } else {
        saveNewChangedMarking()
        success('Маркировка обновлён.')
      }
    },
    onError: (err) => {
      inputsRef.current[changeingMarkingData?.flatIndex].value = ''
      if (get(err, 'response.data.data') == 'similarity.not.enough') {
        error('Недостаточно сходств')
      } else {
        error('err: Asl belgi')
      }

      console.error('err', err)
    },
  })

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
                        setValue={(e) => {}}
                        onBlur={(e) => {}}
                        defaultValue={markingsList?.[item.id]?.[childIndex]}
                        required={get(item, 'is_marking')}
                        onKeyDown={(e) => handleKeyDown(e, flatIndex, item.barcode, item.id, childIndex, item)}
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
          </>
        }
      />
      <ReChangeMarkingDialog
        saveNewChangedMarking={saveNewChangedMarking}
        refetchcartItemsList={refetchcartItemsList}
        open={openRechangeDialog}
        handleClose={() => setOpenRechangeDialog(false)}
      />
    </Dialog>
  )
}

export default ImplementMarkingDialog
