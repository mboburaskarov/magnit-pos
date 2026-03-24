import { Typography } from '@mui/material'

export default function Label({ children, required, mb = '12px', ...props }) {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  return (
    <Typography
      sx={{ '&::after': { content: '" *"', color: 'red.500', display: required ? 'block' : 'none', ml: '2px' } }}
      color={prefersDarkMode.matches ? 'bunker.700' : 'bunker.700'}
      fontSize={16}
      fontWeight={600}
      variant='h5'
      whiteSpace={'pre'}
      lineHeight={'24px'}
      mb={mb}
      display='flex'
      type='label'
      className='input-label'
      {...props}
    >
      {children}
    </Typography>
  )
}
