import { Box, Button } from '@mui/material'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import { FormProvider } from 'react-hook-form'
import Body from './Body'

export default function Create({ methods, state, setState, onSubmit }) {
  return (
    <StyledDialog maxWidth open={state?.isCreateDrawerOpen} title={'Добавить курьера'} onClose={() => setState({ isCreateDrawerOpen: false })}>
      <Box sx={{ p: '24px 56px 56px', width: 500 }}>
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
