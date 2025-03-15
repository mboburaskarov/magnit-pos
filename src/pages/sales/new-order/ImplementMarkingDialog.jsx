import { Box, Button, Dialog, Typography } from '@mui/material'
import React, { useState } from 'react'
import TextField from '../../../../components/Inputs/TextField'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'

function ImplementMarkingDialog({
  open,
  setIsOrderDrower,
  isAllMarkingFill,
  markingCount,
  handleClose,
  cartItems,
  implementMarkingList,
  markingsList,
  setMarkingList,
}) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
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
    setIsOrderDrower(true)
    handleClose()
    setOpenConfirmDialog(null)
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
            Не все добавленные продукты содержат маркер. Введите все теги для торговли.
          </Typography>
        </Box>
        {cartItems.map((item) => {
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
              {Array(markingCount[item.id])
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
                        setValue={(e) => implementMarkingList(e, item?.id, index)}
                        defaultValue={markingsList?.[item.id]?.[index]}
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
          // disabled={!isAllMarkingFill()}
          onClick={() => {
            if (!isAllMarkingFill()) {
              setOpenConfirmDialog(true)

              return
            }

            setIsOrderDrower(true)
            handleClose()
          }}
          fullWidth
        >
          Продолжать
        </Button>
      </Box>
      <ConfirmDialog
        open={!!openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningIcon />}
        title={'Без маркировки'}
        desc={
          'Вы не ввели наценку для всех товаров. Продажа без маркировки юридически невозможна. Нажимая «Продолжить», вы принимаете на себя всю ответственность.'
        }
        // supDesc={openConfirmDialog.type === 'deleteAll' ? '' : openConfirmDialog?.name}
        actions={
          <>
            <Button
              sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
              fullWidth
              color='secondary'
              variant='contained'
              onClick={() => setOpenConfirmDialog(null)}
            >
              Нет
            </Button>
            <LoadingButton
              variant='contained'
              type='button'
              onClick={() => {
                addEmptyStringMarkToMarkinglessProduct(markingsList, markingCount)
              }}
            >
              Продолжить
            </LoadingButton>
          </>
        }
      />
    </Dialog>
  )
}

export default ImplementMarkingDialog
