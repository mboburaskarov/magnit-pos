import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const styles = {
  width: ({ width }) => width || '100%',
  color: ({ color }) => color || 'inherit',
  '-webkit-line-clamp': ({ lineLimit }) => lineLimit || 1,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

const useStyles = makeStyles(() => ({
  root: {
    ...styles,
    '& *': {
      ...styles,
    },
  },
}))

export default function TruncatedText({ children, fontSize, lineHeight, lineLimit = 1, color, width }) {
  const classes = useStyles({
    fontSize,
    lineHeight,
    color,
    lineLimit,
    width,
  })
  return <Typography className={classes.root}>{children}</Typography>
}
