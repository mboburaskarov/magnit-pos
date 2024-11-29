import { Box, Drawer as MuiDrawer } from '@mui/material'
import MiniCloseDialog from '../../src/assets/icons/MiniCloseDialog'

const Drawer = ({ open, setOpen, title, content }) => (
  <MuiDrawer
    anchor='bottom'
    open={open}
    onClose={() => setOpen(false)}
    sx={{
      '.MuiBackdrop-root': {
        bgcolor: 'rgba(0, 0, 0, 0.72)',
      },
      '.MuiPaper-root': {
        maxHeight: '90%',
      },
    }}
  >
    <Box fontFamily='Gilroy' fontWeight={500} display='flex' alignItems='center' justifyContent='space-between' fontSize={16} px={2} pt={2} pb={2}>
      {title}
      <Box onClick={() => setOpen(false)}>
        <MiniCloseDialog />
      </Box>
    </Box>
    <Box
      width='100%'
      height='100%'
      sx={{
        overflowY: 'auto',
        pb: 8,
        '& > div, a': {
          p: 2,
          color: 'secondary.main',
          borderBottom: '1px solid',
          borderColor: 'gray.100',
          '&:first-of-type': {
            borderTop: '1px solid',
            borderColor: 'gray.100',
          },
        },
      }}
    >
      {content}
    </Box>
  </MuiDrawer>
)

export default Drawer
