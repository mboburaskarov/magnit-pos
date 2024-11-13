import { Typography } from '@mui/material'

export default function Label({ children, required, ...props }) {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  return (
    <Typography
      sx={{ '&::after': { content: '" *"', color: 'red.500', display: required ? 'block' : 'none', ml: '2px' } }}
      color={prefersDarkMode.matches ? '#fff' : 'rgba(0, 0, 0, 0.38)'}
      fontSize={16.5}
      fontWeight={600}
      variant='h5'
      display='flex'
      type='label'
      {...props}
    >
      {children}
    </Typography>
  )
}
