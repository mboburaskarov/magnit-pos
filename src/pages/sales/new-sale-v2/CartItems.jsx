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
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <TableContainer>
        <Table
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <TableHead sx={{ borderRadius: '6px', overflow: 'hidden' }}>
            <TableRow
              sx={{
                '& .table-cell': {
                  border: 'none',
                  bgcolor: 'bg.10',
                  fontWeight: 600,
                  color: 'bunker.300',
                  fontSize: '14px',
                  lineHeight: '20px',
                  textAlign: 'left',
                  padding: '2px',
                },
              }}
            >
              <TableCell
                className='table-cell'
                sx={{
                  borderTopLeftRadius: '6px',
                  borderBottomLeftRadius: '6px',
                  pl: '44px !important',
                  display: 'flex',
                }}
              >
                Название лекарства
              </TableCell>
              <TableCell className='table-cell' sx={{}}>
                Остаток
              </TableCell>
              <TableCell className='table-cell' sx={{}}>
                Уп
              </TableCell>
              <TableCell className='table-cell' sx={{}}>
                Шт
              </TableCell>
              <TableCell className='table-cell' sx={{ textAlign: 'left !important' }}>
                Цена
              </TableCell>
              <TableCell
                sx={{
                  borderTopRightRadius: '6px',
                  borderBottomRightRadius: '6px',
                }}
                className='table-cell'
              ></TableCell>
            </TableRow>
          </TableHead>
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
      </TableContainer>
    </Box>
  )
}
