import { CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import BackArrow from '../../src/assets/icons/BackArrow'
import { makeStyles } from '@mui/styles'
import ButtonWithWrapper from '../Buttons/ButtonWithWrapper'
import { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper.MuiDialog-paper': {
      width: (props) => (props.maxWidth ? 'auto' : '100%'),
      maxWidth: (props) => props.maxWidth || 680,
      overflow: ({ overflowVisible }) => (overflowVisible ? 'visible' : 'hidden'),
      boxShadow: 'none !important',
      borderRadius: 20,
      // overflowY: 'scroll !important',
      transition: open ? 'padding 0.3s ease-out' : 'padding 0.1s ease-in',
      zIndex: 15,
    },
  },

  header: {
    height: 80,
    padding: '24px 24px !important',
    '&.MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderBottom: `2px solid ${theme.palette.gray[100]}`,
  },
  border: {
    height: 2,
    borderRadius: 1,
    background: theme.palette.gray[200],
  },
}))

function StyledEmptyDialog({ onClose, open, reset, children, title, customButtons, maxWidth, overflowVisible, titleStyles }) {
  const classes = useStyles({ overflowVisible, maxWidth, open })

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden' // Prevent scrolling
    } else {
      document.body.style.overflow = '' // Restore scrolling
    }

    return () => {
      document.body.style.overflow = '' // Ensure cleanup on unmount
    }
  }, [open])
  const handleClose = () => {
    onClose()
    if (reset) reset()
  }

  return (
    <Dialog disableScrollLock disableRestoreFocus open={open} className={classes.root} onClose={handleClose}>
      <DialogTitle className={classes.header}>
        <Typography fontSize={24} lineHeight={'32px'} fontWeight={'700'} variant='h3' style={titleStyles}>
          {title}
        </Typography>
        {customButtons || <span />}
      </DialogTitle>
      {children}
    </Dialog>
  )
}

export default StyledEmptyDialog
