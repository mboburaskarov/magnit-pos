import { faChevronLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '456px',
      padding: '64px 32px',
      borderRadius: '40px 0 0 40px',
      boxShadow: 'none',
      backgroundColor: theme.palette.background.default,
    },
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    margin: 0,
    fontSize: 24,
    lineHeight: '28px',
    color: theme.palette.black,
  },
  shopBtn: {
    marginBottom: 8,
    color: theme.palette.gray[600],
    '& svg': {
      display: 'none',
    },
  },
  red: {
    color: theme.palette.red[500],
  },
  gray: {
    color: theme.palette.gray[600],
  },
  backBtn: {
    width: 48,
    height: 48,
  },
  warningIcon: {
    marginBottom: 24,
    color: theme.palette.red[500],
    fontSize: 36,
  },
}))

export default function UserLogOutDrawer({ isOpen, closeDrawer, goBack }) {
  const classes = useStyles()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    window.location.replace('/login')
    navigate('/login')
  }

  return (
    <>
      <Drawer open={isOpen} onClose={closeDrawer} anchor='right' elevation={1} className={classes.drawer}>
        <Box className={classes.wrapper}>
          <Box className={classes.body}>
            <Box width='100%' display='flex' alignItems='center'>
              <IconButton onClick={goBack}>
                <FontAwesomeIcon fontSize={16} icon={faChevronLeft} />
              </IconButton>
              <Box ml={2}>
                <Typography variant='h1' className={classes.title}>
                  Выйти из аккаунта
                </Typography>
              </Box>
            </Box>
            <Box textAlign='center' px={8}>
              <Box className={classes.warningIcon}>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </Box>
              <Typography>Вы уверены что хотите выйти из аккаунта?</Typography>
            </Box>
            <Box>
              <Button color='secondary' fullWidth className={classes.red} onClick={logout}>
                Да, выйти
              </Button>
              <Box pb={2} />
              <Button color='secondary' fullWidth onClick={goBack} className={classes.gray}>
                Отмена
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
