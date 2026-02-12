import { useWebView } from '@/layouts/WebviewProvider'
import { Box, CircularProgress } from '@mui/material'

export default function LoadingContainer({ children, height = 'auto', readyState = false, fullHeight = false, noHeight = false }) {
  const { isWebview } = useWebView()
  if (isWebview) {
    return children
  }
  return (
    <Box
      sx={{
        minHeight: fullHeight ? '100vh' : noHeight ? '100%' : 'calc(100vh - 112px)',
        display: 'flex',
        flexGrow: '1',
        height: { height },
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
            height: fullHeight ? '100vh' : noHeight ? '100%' : 'calc(100vh - 112px)',
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
