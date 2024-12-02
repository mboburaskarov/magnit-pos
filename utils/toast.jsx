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
    padding: '16px',
    backgroundColor: ({ primary }) => (primary ? theme.palette.green[600] : theme.palette.green[10]),
    minHeight: 60,
    boxShadow: theme.boxShadow['32-12'],
    borderRadius: '32px',
    color: theme.palette.green[700],
    border: '1px solid ',
    borderColor: theme.palette.green[700],
    '& button': {
      background: 'transparent',
      border: 0,
      width: 24,
      height: 24,
      outline: 0,
      cursor: 'pointer',
    },
    '& svg': {
      minWidth: 24,
    },
  },
  message: {
    fontWeight: 600,
    fontSize: ({ primary }) => (primary ? 18 : 16),
    lineHeight: '19px',
    display: 'flex',
    fontFamily: theme.fontFamily.Gilroy,
    color: ({ primary }) => (primary ? 'white' : theme.palette.green[700]),
    textAlign: 'left',
    '& a': {
      color: theme.palette.green[500],
      '&:hover': {
        color: theme.palette.green[600],
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
const Notification = ({ closeToast, message, icon, body, primary }) => {
  const cls = useStyles({ primary })

  return (
    <Box className={cls.root}>
      {icon}
      <div className={cls.layout}>
        <span id='toastify-message' className={cls.message}>
          {message}
        </span>
        {/* <span id='toastify-message-body' className={cls.bodyText}>
          {body}
        </span> */}
      </div>
      <button type='button' id='close-toast' onClick={closeToast}>
        <TimesSmallIcon color={primary && 'white'} />
      </button>
    </Box>
  )
}

export const success = (msg) => {
  toast(<Notification icon={<TickSmallIcon />} message={msg} />)
}
export const warning = (msg) => {
  toast(<Notification icon={<WarningSmallIcon />} message={msg} />)
}
export const error = (msg) => {
  toast(<Notification icon={<DeleteMiddleIcon />} message={msg} />)
}
export const notification = (title, body) => {
  toast(<Notification icon={<NotificationSmallIcon color='white' />} message={title} body={body} primary />, { autoClose: false })
}
