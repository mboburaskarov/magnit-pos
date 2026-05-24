import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import { makeStyles } from '@mui/styles'
import TickSmallIcon from '../src/assets/icons/TickSmallIcon'
import TimesSmallIcon from '../src/assets/icons/TimesSmallIcon'
import WarningSmallIcon from '../src/assets/icons/WarningSmallIcon'
import DeleteMiddleIcon from '../src/assets/icons/DeleteMiddleIcon'
import NotificationSmallIcon from '../src/assets/icons/NotificationSmallIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: ({ type }) => {
      if (type === 'success') return '#16a34a'
      if (type === 'warning') return '#d97706'
      if (type === 'error') return '#dc2626'
      return '#374151'
    },
    minHeight: 60,
    boxShadow: 'none',
    borderRadius: '0px',
    color: '#ffffff',
    border: 'none',
    '& button': {
      background: 'transparent',
      border: 0,
      width: 24,
      height: 24,
      outline: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& svg': {
      minWidth: 24,
      '& path': {
        fill: '#ffffff !important',
      }
    },
  },
  message: {
    fontWeight: 600,
    fontSize: ({ primary }) => (primary ? 18 : 16),
    lineHeight: '19px',
    display: 'flex',
    fontFamily: theme.fontFamily.Gilroy,
    color: '#ffffff',
    textAlign: 'left',
    '& a': {
      color: '#ffffff',
      textDecoration: 'underline',
      '&:hover': {
        color: '#f3f4f6',
      },
    },
  },
  bodyText: {
    marginTop: 6,
    fontWeight: 500,
    fontSize: 17,
    lineHeight: '20px',
    display: 'flex',
    fontFamily: theme.fontFamily.Gilroy,
    color: ({ primary }) => (primary ? 'white' : theme.palette.gray[400]),
    textAlign: 'left',
    '& a': {
      color: theme.palette.green[500],
      '&:hover': {
        color: theme.palette.green[600],
      },
    },
  },
  timer: {
    color: theme.palette.green[600],
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  layout: {
    padding: '0 16px',
  },
  dataViewer: {
    position: 'relative',
    display: 'flex',
    height: 300,
    overflowY: 'auto',
    overflowX: 'auto',
    width: 400,
    '& > button': {
      border: 0,
      background: 'transparent',
      alignItems: 'flex-start',
      height: 24,
      width: 48,
      cursor: 'pointer',
    },
  },
}))

// eslint-disable-next-line react-refresh/only-export-components
const Notification = ({ closeToast, type, message, icon, body, primary }) => {
  const cls = useStyles({ primary, type })

  return (
    <Box className={cls.root}>
      {icon}
      <div className={cls.layout}>
        <span id='toastify-message' className={cls.message}>
          {message}
        </span>
      </div>
      <button type='button' id='close-toast' onClick={closeToast}>
        <TimesSmallIcon color={primary && 'white'} />
      </button>
    </Box>
  )
}

export const success = (msg) => {
  toast(<Notification type='success' icon={<TickSmallIcon />} message={msg} />)
}
export const warning = (msg) => {
  toast(<Notification type='warning' icon={<WarningSmallIcon />} message={msg} />)
}
export const error = (msg) => {
  toast(<Notification type='error' icon={<DeleteMiddleIcon />} message={msg} />)
}
export const notification = (title, body) => {
  toast(<Notification type='notification' icon={<NotificationSmallIcon color='white' />} message={title} body={body} primary />, { autoClose: false })
}
