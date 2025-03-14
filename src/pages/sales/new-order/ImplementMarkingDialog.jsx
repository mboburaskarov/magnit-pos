import { Box, Button, Dialog, Typography } from '@mui/material'
import React from 'react'
import TextField from '../../../../components/Inputs/TextField'

function ImplementMarkingDialog({ open, isAllMarkingFill, markingCount, handleClose, cartItems, implementMarkingList, markingsList, setMarkingList }) {
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
        <Button disabled={!isAllMarkingFill()} onClick={handleClose} fullWidth>
          Продолжать
        </Button>
      </Box>
    </Dialog>
  )
}

export default ImplementMarkingDialog
