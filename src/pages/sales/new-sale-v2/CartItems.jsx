import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CartItem from './CartItem'
import { get } from 'lodash'

export default function CartItems({
  index,
  searchRef,
  cartItemRef,
  packRef = () => {},
  setOpenProductDrawer,
  unitRef,
  cartItemsList,
  refetchcartItemsList,
  method,
  item,
  markingsList,
  setOpenConfirmDialog,
  removeMarking,
}) {
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 290px)' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          '& .table-cell': {
            border: 'none',
            bgcolor: 'bg.10',
            fontWeight: 600,
            color: 'bunker.300',
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'left',
            flexShrink: 0,
            px: '16px',
          },
        }}
      >
        <Box
          className='table-cell'
          sx={{
            borderTopLeftRadius: '6px',
            borderBottomLeftRadius: '6px',
            pl: '44px !important',
            display: 'flex',
            flex: 1,
          }}
        >
          Название лекарства
        </Box>
        <Box className='table-cell' sx={{ width: '100px' }}>
          Остаток
        </Box>
        <Box className='table-cell' sx={{ width: '72px' }}>
          Уп
        </Box>
        <Box className='table-cell' sx={{ width: '96px' }}>
          Шт
        </Box>
        <Box className='table-cell' sx={{ textAlign: 'left !important', width: '150px' }}>
          Цена
        </Box>
        <Box className='table-cell' sx={{ textAlign: 'left !important', width: '40px' }}></Box>
      </Box>
      <Box
        sx={{
          maxHeight: 'calc(100vh - 415px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Table
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            borderRadius: '6px',
            overflow: 'hidden',
            '.table-row:not(:last-child) > td': { border: 'none', borderBottom: '1px solid', borderColor: 'bunker.100' },
          }}
        >
          <TableBody sx={{ overflowY: 'auto', height: '100px' }}>
            {console.log(get(cartItemsList, 'data.data.data', []))}
            {get(cartItemsList, 'data.data.data', []).map((el, index) => (
              <CartItem
                markingsList={markingsList}
                removeMarking={removeMarking}
                searchRef={searchRef}
                setOpenProductDrawer={setOpenProductDrawer}
                // onKeyDown={(e) => handleTabSwitch(e, el?.id)}
                refetchcartItemsList={refetchcartItemsList}
                method={method}
                setOpenConfirmDialog={setOpenConfirmDialog}
                item={el}
                packRef={(els) => (cartItemRef.current[index] = els)}
                unitRef={(els) => (cartItemRef.current[el.id + 'unit'] = els)}
                key={el?.id}
                index={el?.id}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}
