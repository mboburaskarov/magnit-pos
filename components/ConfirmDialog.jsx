import { Box, Typography, Dialog } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CloseIcon from '../src/assets/icons/CloseIcon'
// import { theme } from '../src/assets/theme'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper.MuiDialog-paper': {
      width: '100%',
      maxWidth: 784,
      boxShadow: 'none !important',
      borderRadius: 16,
      position: 'relative',
      zIndex: 1300,
    },
    '& .MuiBackdrop-root': {
      background: 'rgba(0,0,0,0.3)',
    },
    zIndex: 1300,
  },
  dialogHeader: {
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
  },
  content: {
    zIndex: 13,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    '& svg': {
      height: '64px',
      width: '64px !important',
    },
    '& h2': {
      color: theme.palette.black,
      fontSize: '36px',
      lineHeight: '42px',
      marginTop: 24,
      marginBottom: 24,
    },
  },
  desc: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '600',
    '& div': {
      color: theme.palette.orange[500],
      marginRight: '10px',
    },
  },
  actions: {
    width: '100%',

    '& button': {
      height: '56px !important',
      width: '100%',

      // minWidth: '196px',
    },
    '& button:nth-child(1)': {
      marginRight: 32,
      color: theme.palette.bunker[950],
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
          <Box onClick={() => setOpen(false)} className={classes.dialogHeader}>
            <Typography variant='h2' fontWeight={'700'} fontSize={'24px'} lineHeight={'32px'}>
              {title}
            </Typography>
            <Box>
              <CloseIcon />
            </Box>
          </Box>
        )}
        <Box className={classes.content}>
          <Box className={classes.title}>
            {icon}
            {/* <Typography variant='h2'>{title}</Typography> */}
          </Box>
          <Typography sx={{ display: 'flex', width: descWidth ? descWidth : null }} className={classes.desc} mb={5}>
            {supDesc && <Box>{supDesc}</Box>}
            {typeof desc === 'string' ? desc : desc}
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
