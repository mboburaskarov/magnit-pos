import { Box, Skeleton, Typography } from '@mui/material'
import { get } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ButtonWithPopup from '../../../components/Buttons/ButtonWithPopup'
import InputSearch from '../../../components/Inputs/InputSearch'
import ArrowDown from '../../assets/icons/ArrowDown'
import NotificationSmallIcon from '../../assets/icons/NotificationSmallIcon'
import { headerStyles } from './HeaderStyles'
function LayoutHeader() {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const [isUserOpen, setIsUserOpen] = useState(null)
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const firstName = userData?.first_name
  const lastName = userData?.last_name
  const [isLogout, setIsLogout] = useState(false)

  const classes = headerStyles({ isOpen })
  const logout = () => {
    localStorage.clear()
    window.location.replace('/login')
    navigate('/login')
  }
  return (
    <Box
      top={0}
      zIndex={12}
      backgroundColor='white'
      position='sticky'
      display={'flex'}
      justifyContent={'space-between'}
      padding={'20px 20px 0px 20px'}
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
        <InputSearch fullWidth id='producrs-search' name='search' placeholder={t('input.search.product')} uncontrolled />
      </Box>
      <Box display={'flex'} height={'48px'}>
        <Box mr={'17px'} width={'240px'}>
          {!userData?.first_name ? (
            <Box position='relative' marginTop={'auto'}>
              <Box className={classes.fakeImage} />
              <Skeleton className={classes.skeleton} />
            </Box>
          ) : (
            <Box minWidth={163}>
              <ButtonWithPopup
                id={'user-info'}
                noArrow
                endIcon={<ArrowDown />}
                noMarginSvg
                sx={{
                  padding: '4px 5px',
                  height: 48,
                  border: '0px solid #ECEDF2 !important',
                  // maxWidth: '200px',
                  // backgroundColor: '#fe5000 !important',
                  // '&:hover': {
                  //   backgroundColor: '#fb923c !important',
                  // },
                  // '& p': {
                  //   color: '#fff !important',
                  // },
                  // '& path': {
                  //   fill: '#fff !important',
                  // },
                  // minHeight: '56px',
                }}
                placement='bottom-end'
                buttonLabel={
                  <Box mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
                    <div className={classes.avatarPlaceholder}>
                      <img src={get(userData, 'photo')} />
                    </div>

                    <Box maxWidth='73%'>
                      <Typography textAlign={'start'} id='user-username' className={classes.username}>
                        {`${firstName}`}
                      </Typography>
                      <p id='user-shopname' className={`${classes.shopname} shopname`}>
                        {get(userData, 'store.name')}
                      </p>
                    </Box>
                  </Box>
                }
                popperContentProps={{}}
                PopperContent={() => (
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      mt: '5px',
                      padding: '5px 10px',
                      '&:hover': {
                        backgroundColor: '#eee',
                      },
                    }}
                  >
                    <Typography fontWeight={'500'} fontSize={15} onClick={() => logout()}>
                      Выйти из системы
                    </Typography>
                  </Box>
                )}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '48px',
            height: '48px',
            borderRadius: '100%',
            backgroundColor: 'gray.50',
          }}
        >
          <NotificationSmallIcon />
        </Box>
      </Box>
      {/* <UserLogOutDrawer
        isOpen={isLogout}
        closeDrawer={() => {
          setIsLogout(false)
        }}
        goBack={() => setIsLogout(false)}
      /> */}
      {/* <UserDrawer isOpen={isUserOpen} userData={userData} closeDrawer={() => setIsUserOpen(null)} /> */}
    </Box>
  )
}

export default LayoutHeader
