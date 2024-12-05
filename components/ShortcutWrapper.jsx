import { Typography } from '@mui/material'
import {
  ArrowBackRounded,
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '24px',
    width: '24px',
    borderRadius: '8px',
    color: theme.palette.gray[400],
    border: `2px solid ${theme.palette.gray[300]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 1,
    color: theme.palette.gray[400],
  },
}))

export default function ShortcutWrapper({ shortcut, margin = '0', color }) {
  const classes = useStyles()

  return (
    <div
      style={{
        margin: margin,
        width: shortcut === 'Enter' && '56px',
        border: color && `2px solid ${color}80`,
      }}
      className={classes.wrapper}
    >
      {shortcut === 'bottom' ? (
        <ArrowDownwardRounded />
      ) : shortcut === 'top' ? (
        <ArrowUpwardRounded />
      ) : shortcut === 'left' ? (
        <ArrowBackRounded />
      ) : shortcut === 'right' ? (
        <ArrowForwardRounded />
      ) : (
        <Typography
          style={{
            color: color || '',
          }}
          className={classes.text}
        >
          {shortcut}
        </Typography>
      )}
    </div>
  )
}
