import { CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import BackArrow from '../../src/assets/icons/BackArrow'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper.MuiDialog-paper': {
      width: (props) => (props.maxWidth ? 'auto' : '100%'),
      maxWidth: (props) => props.maxWidth || 784,
      overflow: ({ overflowVisible }) => (overflowVisible ? 'visible' : 'hidden'),
      boxShadow: 'none !important',
      borderRadius: 20,
      maxHeight: 'calc(100vh - 64px)',
      zIndex: 15,
    },
  },
  back_button: {
    minWidth: '48px !important',
    height: '48px !important',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50% !important',
    backgroundColor: theme.palette.grey[100] + ' !important',
    '&:hover': {
      backgroundColor: theme.palette.grey[101] + ' !important',
    },
    '& svg': {
      fill: theme.palette.green[500] + ' !important',
    },
  },
  header: {
    padding: '24px 56px !important',
    '&.MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderBottom: `2px solid ${theme.palette.grey[100]}`,
  },
  border: {
    height: 2,
    borderRadius: 1,
    background: theme.palette.grey[200],
  },
}))

function StyledDialog({
  onClose,
  open,
  reset,
  children,
  title,
  buttonLabel,
  buttonId,
  disabled,
  isLoading,
  formId,
  customOnSubmit,
  customButtons,
  maxWidth,
  overflowVisible,
  titleStyles,
}) {
  const classes = useStyles({ overflowVisible, maxWidth })

  const handleClose = () => {
    onClose()
    if (reset) reset()
  }

  return (
    <Dialog disableScrollLock disableRestoreFocus open={open} className={classes.root} onClose={handleClose}>
      <DialogTitle className={classes.header}>
        <Button onClick={handleClose} className={classes.back_button}>
          <BackArrow />
        </Button>
        <Typography fontSize={20} variant='h3' style={titleStyles}>
          {title}
        </Typography>
        {customButtons ||
          (buttonLabel ? (
            <Button variant='contained' size='small' type='submit' form={formId} disabled={disabled} onClick={customOnSubmit} id={buttonId}>
              {isLoading ? <CircularProgress size={24} color='inherit' /> : buttonLabel}
            </Button>
          ) : (
            <span />
          ))}
      </DialogTitle>

      {children}
    </Dialog>
  )
}

export default StyledDialog
