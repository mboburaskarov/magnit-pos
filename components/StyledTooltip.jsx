import { Button, Tooltip } from '@mui/material'

export default function StyledTooltip({ title, children, placement, hide = false }) {
  return hide ? (
    children
  ) : (
    <Tooltip title={title} placement={placement} arrow={true}>
      <Button
        variant='text'
        sx={{ padding: '0 !important', height: '100% !important', display: 'inline-block', textAlign: 'start', background: 'transparent !important' }}
      >
        {children}
      </Button>
    </Tooltip>
  )
}
