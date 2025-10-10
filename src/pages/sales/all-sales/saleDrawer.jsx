import { Box, Button, Drawer } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CheckAccess from '../../../../components/CheckAccess'
import SaleChildDrawer from './saleChildDrawer'
import { get, size } from 'lodash'
import { error } from '../../../../utils/toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { requests } from '../../../../utils/requests'

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    left: 'auto !important',
    '& .MuiDrawer-paper': {
      width: '600px',
      height: '100vh',

      borderRadius: '24px 0 0 24px',
      boxShadow: '4px -5px 20px 0px #ccc !important',

      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '80px',
    padding: '16px 10px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))
function SaleDrawer({ open, setOpen, ids }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const childRef = useRef()
  const navigate = useNavigate()

  const printNoProductCheque = () => {
    childRef.current.printChildCheque()
  }
  const { mutate: saleMoveToPending, isLoading: isSaleMoveToPending } = useMutation(requests.saleMoveToPending, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
    },
    onError: (err) => {
      console.log(err)
      error('Ошибка: Продажа переведена в режим ожидания!')
    },
  })
  console.log(open)

  return (
    <Drawer
      ModalProps={{
        hideBackdrop: true, // Optional: Removes the overlay
        keepMounted: true, // Keeps drawer in the DOM for better performance
        'aria-hidden': false, // ✅ Prevents MUI from blocking other elements
        disableScrollLock: true, // Prevents MUI from adding `overflow: hidden` to `body`
      }}
      sx={{ height: '100vh !important' }}
      open={open}
      onClose={() => setOpen(false)}
      anchor='right'
      elevation={1}
      className={classes.drawer}
    >
      <SaleChildDrawer childRef={childRef} ids={ids} open={open} setOpen={setOpen} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '20px',
        }}
      >
        <CheckAccess id='can-reprint'>
          <Button sx={{ minHeight: '56px', flex: '1', ml: '20px' }} onClick={() => printNoProductCheque()}>
            Повторный чек
          </Button>
        </CheckAccess>
        {size(get(open, 'data.fiscal_sign')) < 2 ? (
          <CheckAccess id='can-sale-to-change-pending'>
            <Button sx={{ minHeight: '56px', flex: '1', ml: '10px', mr: '20px' }} onClick={() => saleMoveToPending(get(open, 'id'))}>
              Повторно отправить продажу
            </Button>
          </CheckAccess>
        ) : (
          ''
        )}
      </Box>
    </Drawer>
  )
}

export default SaleDrawer
