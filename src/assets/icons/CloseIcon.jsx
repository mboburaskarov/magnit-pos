import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    minWidth: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    backgroundColor: 'bg.10',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: `${theme.palette.bunker[100]} !important`,
    },
  },
  closeIcon: {
    fill: theme.palette.gray[400],
    '& > circle': {
      fill: theme.palette.gray[100],
    },
    '&:hover': {
      fill: theme.palette.gray[401],
      '& > circle': {
        fill: theme.palette.gray[101],
      },
    },
  },
}))

const CloseIcon = (props) => {
  const classes = useStyles()
  return (
    <Box
      {...props}
      classes={classes.boxWrapper}
      cursor='pointer'
      className='icon-wrapper'
      sx={{
        minWidth: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        width: '48px',
        backgroundColor: 'bg.10',
        borderRadius: '50%',
        '&:hover': {
          backgroundColor: 'bunker.100',
        },
      }}
    >
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.7128 16.7729C16.0057 17.0658 16.4805 17.0658 16.7734 16.7729C17.0663 16.48 17.0663 16.0052 16.7734 15.7123L13.0611 12L16.7734 8.2877C17.0663 7.99481 17.0663 7.51993 16.7734 7.22704C16.4805 6.93415 16.0057 6.93415 15.7128 7.22704L12.0005 10.9393L8.28815 7.22699C7.99526 6.9341 7.52038 6.9341 7.22749 7.22699C6.9346 7.51989 6.9346 7.99476 7.22749 8.28765L10.9398 12L7.22748 15.7123C6.93459 16.0052 6.93459 16.4801 7.22748 16.773C7.52038 17.0659 7.99525 17.0659 8.28814 16.773L12.0005 13.0606L15.7128 16.7729Z'
          fill={props.color}
        />
      </svg>
    </Box>
  )
}

export default CloseIcon
