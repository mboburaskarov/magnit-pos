import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    fill: theme.palette.grey[400],
    '& > circle': {
      fill: theme.palette.grey[100],
    },
    '&:hover': {
      fill: theme.palette.grey[401],
      '& > circle': {
        fill: theme.palette.grey[101],
      },
    },
  },
}))

const CloseIcon = (props) => {
  const classes = useStyles()
  return (
    <Box cursor='pointer'>
      <svg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' className={classes.closeIcon} {...props}>
        <circle cx='24' cy='24' r='24' />
        <path
          d='M26.3203 24.25L29.8359 20.7344C30.293 20.3125 30.293 19.6094 29.8359 19.1875L29.0625 18.4141C28.6406 17.957 27.9375 17.957 27.5156 18.4141L24 21.9297L20.4492 18.4141C20.0273 17.957 19.3242 17.957 18.9023 18.4141L18.1289 19.1875C17.6719 19.6094 17.6719 20.3125 18.1289 20.7344L21.6445 24.25L18.1289 27.8008C17.6719 28.2227 17.6719 28.9258 18.1289 29.3477L18.9023 30.1211C19.3242 30.5781 20.0273 30.5781 20.4492 30.1211L24 26.6055L27.5156 30.1211C27.9375 30.5781 28.6406 30.5781 29.0625 30.1211L29.8359 29.3477C30.293 28.9258 30.293 28.2227 29.8359 27.8008L26.3203 24.25Z'
          fill='inherit'
        />
      </svg>
    </Box>
  )
}

export default CloseIcon
