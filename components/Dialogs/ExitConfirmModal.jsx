import { useTranslation } from 'react-i18next'
import { Box, Button, Dialog, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import BigWarningCircleIcon from '../../src/assets/icons/BigWarningCircleIcon'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    boxShadow: '0 24px 60px rgba(17,18,23,0.22)',
    fontFamily: theme.fontFamily.Gilroy,
  },
  content: {
    padding: '40px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(255,70,57,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    '& svg': {
      width: 34,
      height: 34,
    },
  },
  title: {
    fontSize: 22,
    lineHeight: '28px',
    fontWeight: 700,
    color: theme.palette.black,
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: 28,
  },
  actions: {
    display: 'flex',
    width: '100%',
    gap: 12,
  },
  stayButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'none',
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.black,
      boxShadow: 'none',
    },
  },
  exitButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'none',
    color: theme.palette.red,
    borderColor: 'rgba(255,70,57,0.35)',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: theme.palette.red,
      backgroundColor: 'rgba(255,70,57,0.06)',
    },
  },
}))

// Shared by the automatic back-button guard (useExitConfirm) and any in-app "Chiqish" button.
export default function ExitConfirmModal({ open, onConfirm, onCancel }) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={onCancel} disableScrollLock disableRestoreFocus classes={{ paper: classes.paper }}>
      <Box className={classes.content}>
        <Box className={classes.iconWrap}>
          <BigWarningCircleIcon />
        </Box>
        <Typography className={classes.title}>{t('pos.exit_confirm_title')}</Typography>
        <Typography className={classes.desc}>{t('pos.exit_confirm_desc')}</Typography>
        <Box className={classes.actions}>
          <Button className={classes.stayButton} onClick={onCancel}>
            {t('pos.exit_confirm_cancel')}
          </Button>
          <Button className={classes.exitButton} variant='outlined' onClick={onConfirm}>
            {t('pos.exit_confirm_confirm')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
