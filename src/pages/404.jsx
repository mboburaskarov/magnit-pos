import { Box, Typography } from '@mui/material'

export default function NotFoundPage({ full }) {
  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
      {...(full && { position: 'fixed', top: 0, left: 0, zIndex: 9999 })}
    >
      <Box>
        <Typography variant='h1' color='primary' style={{ fontSize: 48, lineHeight: '56px' }}>
          404
        </Typography>
      </Box>
      <Box>
        <Typography variant='h1'>Page not found</Typography>
      </Box>
    </Box>
  )
}
