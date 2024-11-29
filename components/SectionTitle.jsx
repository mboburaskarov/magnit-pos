import { Box, Typography } from '@mui/material'
import HorizontalLine from './HorizontalLine'

export default function SectionTitle({ children, component = 'h3', small, large, fontSize, gray, color, noWrap, withLine, ...rest }) {
  return (
    <Typography
      component={component}
      sx={{
        fontWeight: 900,
        width: '100%',
        alignItems: 'center',
        display: 'inline-flex',
        whiteSpace: noWrap ? 'nowrap' : 'normal',
        color: color || (gray ? 'gray.600' : 'black'),
        fontSize: fontSize || small ? 16 : large ? 36 : 24,
        lineHeight: '12px',
      }}
      {...rest}
    >
      {children}
      {withLine && (
        <Box width='100%' ml={2}>
          <HorizontalLine />
        </Box>
      )}
    </Typography>
  )
}
