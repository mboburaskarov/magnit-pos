import { Box, Table, TableBody } from '@mui/material'
import { get } from 'lodash'

import CartItem from './CartItem'
import { t } from 'i18next'

export default function CartItems({
  searchRef,
  cartItemRef,
  setOpenProductDrawer,
  cartItemsList,
  refetchcartItemsList,
  method,
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
          padding: '2px 0',
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
          {t('name')}
        </Box>
        <Box className='table-cell' sx={{ width: '100px' }}>
          {t('leftover')}
        </Box>
        <Box className='table-cell' sx={{ width: '72px' }}>
          {t('pack_short')}
        </Box>
        <Box className='table-cell' sx={{ width: '96px' }}>
          {t('unit_short')}
        </Box>
        <Box className='table-cell' sx={{ textAlign: 'left !important', width: '150px' }}>
          {t('price')}
        </Box>
        <Box className='table-cell' sx={{ textAlign: 'left !important', width: '40px', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}></Box>
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
            {get(cartItemsList, 'data.data.data', []).map((el, index) => (
              <CartItem
                markingsList={markingsList}
                removeMarking={removeMarking}
                searchRef={searchRef}
                setOpenProductDrawer={setOpenProductDrawer}
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
