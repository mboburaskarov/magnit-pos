import { Box, Button, Typography } from '@mui/material'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import { FormProvider } from 'react-hook-form'
import Body from './Body'

export default function Edit({ methods, state, selectedCourier, setState, onSubmit }) {
  return (
    <StyledDialog maxWidth open={state?.isEditDrawerOpen} title={selectedCourier?.firstName} onClose={() => setState({ isEditDrawerOpen: false })}>
      <Box sx={{ p: '24px 56px 56px', width: 500 }}>
        <Typography variant='h2' mb={'24px'}>
          Изменить курьера
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Body {...{ state }} />
            <Button variant='contained' type='submit' fullWidth sx={{ mt: '24px' }}>
              Сохранить
            </Button>
          </form>
        </FormProvider>
      </Box>
    </StyledDialog>
  )
}
