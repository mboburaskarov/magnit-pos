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
import UserFilledIcon from '../../assets/icons/UserFilledIcon'
import LogOutIcon from '../../assets/icons/logOutIcon'
import { headerStyles } from './HeaderStyles'

const DialogRowBox = ({ children, onClick }) => (
  <Box
    sx={{
      display: 'flex',
      p: '8px 10px',
      alignItems: 'center',
      fontWeight: 500,
      fontSize: 15,
      mt: '10px',
      borderRadius: '20px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'gray.10',
      },
    }}
    onClick={onClick}
  >
    {children}
  </Box>
)
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
            <Box>
              <ButtonWithPopup
                id={'user-info'}
                noArrow
                endIcon={<ArrowDown />}
                noMarginSvg
                sx={{
                  width: '100%',
                  padding: '4px 5px',
                  height: 48,
                  justifyContent: 'start',
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
                  <Box width={'100%'} mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
                    <div className={classes.avatarPlaceholder}>
                      <img src={get(userData, 'photo')} />
                    </div>

                    <Box width={'100%'}>
                      <Typography textAlign={'start'} id='user-username' className={classes.username}>
                        {`${firstName}`}
                      </Typography>
                      <p id='user-shopname' className={`${classes.shopname} shopname`}>
                        {get(userData, 'type') == 'FOUNDER'
                          ? 'Учредитель'
                          : get(userData, 'type') == 'DIRECTOR'
                          ? 'Генеральный директор '
                          : get(userData, 'store.name')}
                      </p>
                    </Box>
                  </Box>
                }
                popperContentProps={{}}
                PopperContent={({ close }) => (
                  <Box
                    sx={{
                      minWidth: '350px',
                      backgroundColor: '#fff',
                      borderRadius: '20px',
                      mt: '5px',
                      padding: '10px 10px',
                      // '&:hover': {
                      //   backgroundColor: '#eee',
                      // },
                    }}
                  >
                    <Box>
                      <Box sx={{ alignItems: 'center' }} display={'flex'}>
                        <Box width={40} height={40} mr={'10px'} borderRadius={2} overflow='hidden'>
                          {!userData?.photo ? (
                            <div className={classes.avatarPlaceholder}>
                              {firstName?.charAt(0)}
                              {lastName?.charAt(0)}
                            </div>
                          ) : (
                            <img src={userData?.photo} alt={userData?.first_name} className={classes.avatar} />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography fontWeight={'600'} fontSize={18}>
                            {get(userData, 'first_name')}
                            {get(userData, 'last_name')}
                          </Typography>

                          <Typography color={'bunker.400'} fontWeight={'500'} fontSize={14}>
                            {get(userData, 'type') == 'FOUNDER'
                              ? 'Учредитель'
                              : get(userData, 'type') == 'DIRECTOR'
                              ? 'Генеральный директор '
                              : get(userData, 'store.name')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <DialogRowBox
                      onClick={() => {
                        navigate('/settings/profile')
                        close()
                      }}
                    >
                      <UserFilledIcon />
                      <Typography sx={{ fontSize: '17px', lineHeight: '20px', fontWeight: '500', ml: '8px' }}>Профиль</Typography>
                    </DialogRowBox>
                    {/* <DialogRowBox onClick={() => navigate('/settings/profile')}>
                      <SettingsIcon /> <Typography sx={{ fontSize: '17px', lineHeight: '20px', fontWeight: '500', ml: '8px' }}>Настройки</Typography>
                    </DialogRowBox> */}
                    <DialogRowBox onClick={() => logout()}>
                      <LogOutIcon /> <Typography sx={{ fontSize: '17px', lineHeight: '20px', fontWeight: '500', ml: '8px' }}>Выйти из системы</Typography>
                    </DialogRowBox>
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
            position: 'relative',
            backgroundColor: 'gray.50',
          }}
        >
          <NotificationSmallIcon />
          <Typography
            sx={{
              width: '40px',
              height: '20px',
              backgroundColor: '#A53EFF',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: '5px',
              position: 'absolute',
              top: '-6px',
              right: '-10px',
            }}
          >
            soon
          </Typography>
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
