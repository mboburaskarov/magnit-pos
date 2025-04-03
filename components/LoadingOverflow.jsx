import { Box, CircularProgress } from '@mui/material'

export default function LoadingOverflow({ children, readyState = false, fullHeight = false, noHeight = false }) {
  return (
    <Box>
      {readyState ? (
        children
      ) : (
        <Box
          sx={{
            position: 'fixed',
            zIndex: 99999999,
            height: fullHeight ? '100vh' : noHeight ? '100%' : 'calc(100vh - 112px)',
            display: 'flex',
            left: 0,
            justifyContent: 'center',
            bgcolor: '#0001',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}
