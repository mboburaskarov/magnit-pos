import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useState } from 'react'
import CustomImg from '../../../components/CustomImg'
import CloseIcon from '../../assets/icons/CloseIcon'
import UserLogOutDrawer from './UserLogOutDrawer'

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
  const firstName = userData?.first_name
  const lastName = userData?.last_name

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
                <CloseIcon color={'#111217'} onClick={closeDrawer} />
              </Box>
              <Box display='flex' alignItems='center' mt={4}>
                <Box width={70} height={70} borderRadius={2} overflow='hidden'>
                  {!userData?.photo ? (
                    <div className={classes.avatarPlaceholder}>
                      {firstName?.charAt(0)}
                      {lastName?.charAt(0)}
                    </div>
                  ) : (
                    <CustomImg src={userData?.photo} alt={data?.first_name} className={classes.avatar} />
                  )}
                </Box>
                <Box ml={1.5}>
                  <Typography>
                    {firstName} {lastName}
                  </Typography>
                  <Box maxWidth='100%'>
                    <Typography id='user-username' sx={{ flexWrap: 'nowrap', fontSize: '14px', width: '100%' }}>
                      {get(userData, 'store.name')}
                    </Typography>
                    <Typography sx={{ flexWrap: 'nowrap', fontSize: '14px', width: '100%' }}>
                      ({localStorage.getItem('leftZreportCount')}) {get(userData, 'cashbox.name', '-')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box mt={4}>
                <Button color='secondary' fullWidth className={classes.logoutBtn} onClick={() => setIsLogout(true)}>
                  Выйти из аккаунта
                </Button>
              </Box>
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
