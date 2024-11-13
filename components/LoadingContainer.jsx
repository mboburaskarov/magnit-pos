import { Box, CircularProgress } from '@mui/material'

export default function LoadingContainer({ children, readyState = false, fullHeight = true, noHeight = false }) {
  return (
    <Box
      sx={{
        minHeight: fullHeight ? '100vh' : noHeight ? '100%' : 'calc(100vh - 112px)',
        display: 'flex',
        flexGrow: '1',
        '& > div': {
          width: '100%',
        },
        flexDirection: 'column',
        background: 'transparent',
      }}
    >
      {readyState ? (
        children
      ) : (
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
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
