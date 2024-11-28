import React, { useState } from 'react'
import InputSearch from '../../../components/Inputs/InputSearch'
import { Box, ListItem, Skeleton, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import UserDrawer from '../Navbar/userDrawer'
import NotificationSmallIcon from '../../assets/icons/NotificationSmallIcon'
import { headerStyles } from './HeaderStyles'
import ArrowDown from '../../assets/icons/ArrowDown'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

function LayoutHeader() {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const [isUserOpen, setIsUserOpen] = useState(null)
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)

  const firstName = userData?.fullName?.split(' ')?.[0]
  const lastName = userData?.fullName?.split(' ')?.[1]
  const classes = headerStyles({ isOpen })

  return (
    <Box
      top={0}
      zIndex={12}
      backgroundColor='white'
      position='sticky'
      // boxShadow='0px 12px 24px 0px rgba(0, 0, 0, 0.02)'
      display={'flex'}
      justifyContent={'space-between'}
      padding={'14px 30px'}
      alignItems={'center'}
    >
      <Box
        sx={{
          width: 381,
          '& svg > path': {
            fill: '#868FAA',
          },
        }}
      >
        <InputSearch fullWidth id='producrs-search' className={classes.searchInput} name='search' placeholder={t('input.search.product')} uncontrolled />
      </Box>
      <Box display={'flex'}>
        <Box mr={'20px'}>
          {!userData?.fullName ? (
            <Box position='relative' marginTop={'auto'}>
              <Box className={classes.fakeImage} />
              <Skeleton className={classes.skeleton} />
            </Box>
          ) : (
            <ListItem className={`${classes.currentUser} drawer_user_avatar`} id='avatar' onClick={() => setIsUserOpen(userData)}>
              <Box mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
                <div className={classes.avatarPlaceholder}>
                  {/* {firstName.charAt(0)}
                  {lastName.charAt(0)} */}
                  <img src='/default-user-img.png' />
                </div>

                <Box maxWidth='73%'>
                  <Typography id='user-username' className={classes.username}>
                    {`${firstName}`}
                  </Typography>
                  <p id='user-shopname' className={`${classes.shopname} shopname`}>
                    {/* {userData.type.toLowerCase()} */}
                    Mirzo Ulugbek filial
                  </p>
                </Box>
              </Box>
              <Box>
                <ArrowDown />
              </Box>
            </ListItem>
          )}
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '50px',
            height: '50px',
            borderRadius: '100%',
            backgroundColor: 'gray.50',
          }}
        >
          <NotificationSmallIcon />
        </Box>
      </Box>

      {/* <UserDrawer isOpen={isUserOpen} userData={userData} closeDrawer={() => setIsUserOpen(null)} /> */}
    </Box>
  )
}

export default LayoutHeader
