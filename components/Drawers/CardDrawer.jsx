import { Box, Drawer, Typography } from '@mui/material'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import LoadingContainer from '../LoadingContainer'
import { useTheme } from '@mui/styles'

const DRAWER_WIDTH = 768

export default function CardDrawer({ isOpen, closeDrawer, actions, children, title, isLoading, width, withoutActions, center, fullWidth }) {
  const onClose = () => {
    closeDrawer()
  }
  const theme = useTheme()
  return (
    <Drawer
      open={!!isOpen}
      onClose={onClose}
      anchor='right'
      elevation={1}
      id={Math.random()}
      sx={{
        '& .MuiDrawer-paper': {
          width: center ? `calc(100vw - 200px)` : width || DRAWER_WIDTH,
          padding: isLoading ? 0 : fullWidth ? 0 : 8,
          overflow: fullWidth ? 'hidden' : 'auto',
          borderRadius: center ? (fullWidth ? '20px' : '40px') : '40px 0 0 40px',
          right: center ? '100px' : '0px',
          backgroundColor: 'background.default',
          boxShadow: 'none',
        },
      }}
    >
      {isLoading ? (
        <LoadingContainer noHeight />
      ) : (
        <Box position='relative'>
          {!fullWidth && (
            <>
              <Box
                width='100%'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                // mb={4}
                sx={{
                  zIndex: 20,
                  pb: 3,
                  pt: 7,
                  top: -68,
                  position: 'fixed',
                  width: width - 128 || DRAWER_WIDTH - 128,
                  backgroundColor: 'background.default',
                  transform: `translateY(64px)`,
                  overflow: 'hidden',
                  // boxShadow: '0px 12px 24px 0px rgba(0, 0, 0, 0.03)',
                  clipPath: 'inset(0px 0px -24px 0px)',
                }}
              >
                <Box display='flex' alignItems='center'>
                  <Typography>{title}</Typography>
                </Box>
                <Box onClick={onClose}>
                  <CloseIcon color={theme.palette.black} />
                </Box>
              </Box>
              <Box height={46} />
            </>
          )}
          {children}
          {!withoutActions && (
            <>
              <Box
                sx={{
                  pt: 3,
                  pb: 6,
                  bottom: 56,
                  position: 'fixed',
                  width: width - 128 || DRAWER_WIDTH - 128,
                  backgroundColor: 'background.default',
                  transform: `translateY(64px)`,
                  overflow: 'hidden',
                  // boxShadow: '0px -12px 24px 0px rgba(0, 0, 0, 0.03)',
                  clipPath: 'inset(-24px 0px 0px 0px)',
                  zIndex: 10,
                }}
              >
                {actions}
              </Box>
              <Box height={72} />
            </>
          )}
        </Box>
      )}
    </Drawer>
  )
}
