import { Box, Typography, Dialog } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CloseIcon from '../src/assets/icons/CloseIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper.MuiDialog-paper': {
      width: '100%',
      maxWidth: 784,
      boxShadow: 'none !important',
      borderRadius: 24,
      position: 'relative',
      zIndex: 1300,
    },
    '& .MuiBackdrop-root': {
      background: 'rgba(0,0,0,0.3)',
    },
    zIndex: 1300,
  },

  content: {
    zIndex: 13,
    padding: '56px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    '& h2': {
      color: theme.palette.black,
      fontSize: '36px',
      lineHeight: '42px',
      marginTop: 24,
      marginBottom: 24,
    },
  },
  desc: {
    fontSize: '16px',
    lineHeight: '19px',
    '& div': {
      color: theme.palette.red[600],
    },
  },
  actions: {
    '& button': {
      height: '56px !important',
      minWidth: '196px',
    },
    '& button:nth-child(1)': {
      marginRight: 32,
    },
  },
}))

const ConfirmDialog = ({ open, setOpen, actions, title = '', icon, desc, descWidth, supDesc, noCloseIcon, setDisableSubmit }) => {
  const handleClose = () => {
    setOpen(false)
    if (setDisableSubmit) {
      setDisableSubmit(false)
    }
  }
  const classes = useStyles()
  return (
    <>
      <Dialog onClose={handleClose} open={open} className={classes.root} disableScrollLock>
        {!noCloseIcon && (
          <Box onClick={handleClose} sx={{ position: 'absolute', top: 32, right: 32, zIndex: 14 }}>
            <CloseIcon />
          </Box>
        )}
        <Box className={classes.content}>
          <Box className={classes.title}>
            {icon}
            <Typography variant='h2'>{title}</Typography>
          </Box>
          <Typography sx={{ width: descWidth ? descWidth : null }} className={classes.desc} mb={5}>
            {typeof desc === 'string' ? desc : desc}
            {supDesc && <Box>{supDesc}</Box>}
          </Typography>
          <Box justifyContent='center' display='flex' className={classes.actions}>
            {actions}
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default ConfirmDialog
