import { Box, Button, Typography } from '@mui/material'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import { FormProvider } from 'react-hook-form'
import TextField from '../../../../components/Inputs/TextField'
import InputSwitch from '../../../../components/Inputs/InputSwitch'

export default function PayDialog({ methods, isCouriersDrawerOpen, selectedCourier, setState, availableOrders, setPaymentMethod, onSubmit, paymentMethod }) {
  return (
    <StyledDialog maxWidth open={isCouriersDrawerOpen} title={selectedCourier?.firstName} onClose={() => setState({ isCouriersDrawerOpen: false })}>
      <Box sx={{ p: '24px 56px 56px', width: 500 }}>
        <Typography variant='h2' mb={'24px'}>
          Доступные заказы {availableOrders}
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <TextField fullWidth name='available-orders' placeholder='Введите количество заказов' type={'number'} sx={{ mb: 2 }} />
            <InputSwitch
              name='payment-type'
              value={paymentMethod}
              defaultValue='CASH'
              onChange={(e) => setPaymentMethod(e)}
              options={[
                { title: 'Наличные', value: 'CASH' },
                { title: 'Карта', value: 'UNIPOS' },
              ]}
            />
            <Button variant='contained' type='submit' fullWidth sx={{ mt: '24px' }}>
              Оплатить
            </Button>
          </form>
        </FormProvider>
      </Box>
    </StyledDialog>
  )
}
