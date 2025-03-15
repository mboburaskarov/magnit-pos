import { Box, Button, Dialog, Typography } from '@mui/material'
import React, { useState } from 'react'
import TextField from '../../../../components/Inputs/TextField'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import { get } from 'lodash'

function DecreasedCartItemMarkingCheck({
  open,
  isAllMarkingFillById,
  markingCount,
  handleClose,
  cartItems,
  implementMarkingList,
  markingsList,
  refetchcartItemsList,
  setMarkingList,
}) {
  const convertData = (data, input, targetId) => {
    // Create a new object to store the result
    const result = { ...data }

    // Get the values from input that we want to filter out
    const inputValues = Object.values(input)

    // Only modify the target ID
    const currentObj = { ...result[targetId] }
    Object.keys(currentObj).forEach((key) => {
      if (inputValues?.includes(currentObj[key])) {
        delete currentObj[key]
      }
    })
    result[targetId] = currentObj

    return result
  }

  const [removedMark, setRemovedMark] = useState({})
  const { mutate: changeCartItemQuantity } = useMutation(requests.changeCartItemQuantity, {
    onSuccess: ({ data }) => {
      refetchcartItemsList()
    },
    onError: (err) => {
      refetchcartItemsList()
      method.setValue(`quantity_${item?.id}`, item?.quantity)
      method.setValue(`unit_quantity_${item?.id}`, item?.unit_quantity)
      if (get(err, 'response.data.code') === 409) {
        error(`Описание
Редактировать
Введенное количество товара превышает существующее количество. 
Максимальное количество упаковок на складе - ${get(err, 'response.data.data.pack_quantity')},
единичное количество на складе - ${get(err, 'response.data.data.unit_quantity')}.`)
      } else {
        error('Ошибка при получении похожих товаров.')
      }
      console.log('err', err)
    },
  })
  const isValidInput = (evialable, input) => {
    if (!open || !evialable) {
      return
    }

    const inputSet = new Set(input) // Remove duplicates
    const evialableSet = new Set(evialable)

    // Ensure all elements in inputSet exist in evialableSet
    return inputSet.size === input.length && [...inputSet].every((el) => evialableSet.has(el))
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
      <Box
        sx={{
          minWidth: '600px',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            m: '10px 0px',
            borderRadius: '20px',
          }}
        >
          <Typography color={'#fe5000'} fontWeight={'500'}>
            Какой маркирофный продукт вы удалили?
          </Typography>
        </Box>
        {cartItems
          .filter((i) => i.id == open?.id)
          .map((item) => {
            return (
              <Box
                sx={{
                  padding: '5px 10px',
                  backgroundColor: '#f3f3f3',
                  m: '10px 0px',
                  borderRadius: '20px',
                }}
              >
                <Typography fontWeight={'600'} my={'10px'}>
                  {item.name}
                </Typography>
                {Array(Math.abs(open?.diff))
                  .fill(1)
                  .map((unit_item, index) => {
                    return (
                      <Box
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
                          // onBlur={({ target }) => {
                          //   setRemovedMark((p) => [...p, target.value])
                          // }}
                          setValue={(e) => setRemovedMark((p) => ({ ...p, [index]: e }))}
                          // defaultValue={markingsList?.[item.id]?.[index]}
                          required
                          fullWidth
                          borderRadius={'40px'}
                          name={`${item.id}`}
                          label={'Маркировка'}
                          placeholder={'Введите маркировку'}
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
          //   position: 'fixed',
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
          Отмена
        </Button>
        <Box width={'20px'} />
        <Button
          disabled={!isValidInput(get(open, 'available'), Object.values(removedMark))}
          // !Object.values(removedMark).every((el) => get(open, 'available')?.includes(el))}
          onClick={() => {
            if (!Object.values(removedMark).every((el) => get(open, 'available').includes(el))) {
              return
            }
            setMarkingList(convertData(markingsList, removedMark, get(open, 'id')))
            handleClose()
            changeCartItemQuantity(get(open, 'request'))
          }}
          fullWidth
        >
          Продолжать
        </Button>
      </Box>
    </Dialog>
  )
}

export default DecreasedCartItemMarkingCheck
