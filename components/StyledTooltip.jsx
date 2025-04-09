import { Button, Tooltip } from '@mui/material'

export default function StyledTooltip({ title, children, placement, hide = false, sx }) {
  return hide ? (
    children
  ) : (
    <Tooltip title={title} placement={placement} arrow={true}>
      <Button
        variant='text'
        sx={{ padding: '0 !important', height: '100% !important', display: 'flex', textAlign: 'start', background: 'transparent !important', ...sx }}
      >
        {children}
      </Button>
    </Tooltip>
  )
}
