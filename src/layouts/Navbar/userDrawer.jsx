import { useState } from 'react'
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material'
import UserLogOutDrawer from './UserLogOutDrawer'
import { makeStyles } from '@mui/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBell } from '@fortawesome/free-solid-svg-icons'

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
  avatarPlaceholder: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
    fontWeight: 600,
    fontSize: 16,
    backgroundColor: theme.palette.green[600],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    transition: '0.3s',
  },
  title: {
    margin: 0,
    fontSize: 36,
    lineHeight: '42px',
    color: theme.palette.black,
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  shopname: {
    marginTop: 2,
    color: theme.palette.gray[400],
  },
  logoutBtn: {
    color: theme.palette.red[500],
  },
  actionBtn: {
    color: theme.palette.gray[600],
    '& svg': {
      color: theme.palette.green[500],
    },
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.palette.gray[100],
    borderRadius: 24,
    cursor: 'pointer',
    transition: 'all .2s',
    '&:hover': {
      backgroundColor: theme.palette.gray[101],
    },
  },
}))

export default function UserDrawer({ isOpen: data, userData, closeDrawer }) {
  const classes = useStyles()
  const [isLogout, setIsLogout] = useState(false)
  const firstName = userData?.fullName?.split(' ')?.[0]
  const lastName = userData?.fullName?.split(' ')?.[1]
  console.log(userData)

  return (
    <>
      <Drawer open={!!data} onClose={closeDrawer} anchor='right' elevation={1} className={classes.drawer}>
        <Box className={classes.wrapper}>
          <Box className={classes.body}>
            <Box>
              <Box width='100%' display='flex' justifyContent='space-between'>
                <Box>
                  <Typography variant='h1' className={classes.title}>
                    Аккаунт
                  </Typography>
                </Box>
                <IconButton onClick={closeDrawer}>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M14 2.00005L2 14M1.99995 2L13.9999 14' stroke='#119676' strokeWidth='2.5' strokeLinecap='round' />
                  </svg>
                </IconButton>
              </Box>
              <Box display='flex' alignItems='center' mt={4}>
                <Box width={40} height={40} borderRadius={2} overflow='hidden'>
                  {!data?.image_url ? (
                    <div className={classes.avatarPlaceholder}>
                      {firstName?.charAt(0)}
                      {lastName?.charAt(0)}
                    </div>
                  ) : (
                    <img src={data?.image_url} alt={data?.first_name} className={classes.avatar} />
                  )}
                </Box>
                <Box ml={1.5}>
                  <Typography>
                    {firstName} {lastName}
                  </Typography>
                  <Typography className={classes.shopname}>{data?.shops?.find((item) => item.shop_id === data?.current_shop_id)?.shop?.name}</Typography>
                </Box>
              </Box>
              <Box mt={4}>
                <Button color='secondary' fullWidth className={classes.logoutBtn} onClick={() => setIsLogout(true)}>
                  Выйти из аккаунта
                </Button>
              </Box>
            </Box>
            <Box>
              <Button color='secondary' fullWidth adornmentEnd={<FontAwesomeIcon icon={faArrowRight} />} className={classes.actionBtn}>
                <FontAwesomeIcon icon={faBell} />
                <Box width={16} />
                Уведомления
              </Button>
              <Box pb={2} />
            </Box>
          </Box>
        </Box>
      </Drawer>

      <UserLogOutDrawer
        isOpen={isLogout}
        closeDrawer={() => {
          setIsLogout(false)
          closeDrawer()
        }}
        goBack={() => setIsLogout(false)}
      />
    </>
  )
}
