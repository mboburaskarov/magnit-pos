import { Box, Typography } from '@mui/material'
import HorizontalLine from './HorizontalLine'

export default function SectionTitle({ children, component = 'h3', small, large, fontSize, gray, color, noWrap, withLine, ...rest }) {
  return (
    <Typography
      component={component}
      sx={{
        fontWeight: 700,
        width: '100%',
        alignItems: 'center',
        display: 'inline-flex',
        whiteSpace: noWrap ? 'nowrap' : 'normal',
        color: color || (gray ? 'gray.600' : 'black'),
        fontSize: '24px',
        lineHeight: '32px',
      }}
      {...rest}
    >
      {children}
      {withLine && (
        <Box width='100%' ml={2}>
          {/* <HorizontalLine /> */}
        </Box>
      )}
    </Typography>
  )
}
