import { Box, Skeleton, Typography } from '@mui/material'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ButtonWithPopup from '../../../components/Buttons/ButtonWithPopup'
import CustomImg from '../../../components/CustomImg'
import InputSearch from '../../../components/Inputs/InputSearch'
import ArrowDown from '../../assets/icons/ArrowDown'
import NotificationSmallIcon from '../../assets/icons/NotificationSmallIcon'
import UserFilledIcon from '../../assets/icons/UserFilledIcon'
import LogOutIcon from '../../assets/icons/logOutIcon'
import { headerStyles } from './HeaderStyles'
import useGlobalWebSocket from '@/hooks/useGlobalWebSocket'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { requests } from '@utils/requests'
import notificationAudio from '@/assets/audio/notification.mp3'
import MessagesDrawer from './Messages'
import { success } from '@utils/toast'
import RamadanIcon from '@/assets/icons/RamadanIcon'
import { getCurrentEvent } from '@utils/ramadanTime'
import RamadanDrawer from './RamadanDrawer'

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
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [openMessage, setOpenMessage] = useState(false)
  const [openRamadan, setOpenRamadan] = useState(false)
  const [ramadanTime, setRamadanTime] = useState(getCurrentEvent(0))
  const firstName = userData?.first_name
  const lastName = userData?.last_name
  const NotificationAudio = new Audio(notificationAudio)

  // Recalculate ramadan time every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRamadanTime(getCurrentEvent(0))
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const {
    data: noorOrderCount,
    refetch: refetchNoorOrderCount,
    isLoading,
  } = useQuery(['noorOrderCount'], () => requests.getNoorOrderCount({}), {
    onSuccess: ({ data }) => {
      setMessage(get(data, 'data.count', 0))
      if (message > 0) {
        NotificationAudio.play()
      }
    },
  })
  useGlobalWebSocket({
    onMessage: (data) => {
      if (data?.event == 'noor_order' || data?.event == 'noor_order_cancel') {
        refetchNoorOrderCount()

        if (data?.event == 'noor_order_cancel') {
          success(`${data?.data?.header_ru} - ${data?.data?.content_ru}`)
          return
        }
        if (data?.event == 'noor_order') {
          success(`${data?.data?.header_ru} - ${data?.data?.content_ru}`)
          return
        }
      }
    },
  })
  const classes = headerStyles({ isOpen })
  const logout = () => {
    localStorage.removeItem('access_token')
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
        <Box
          onClick={() => setOpenRamadan(true)}
          sx={{
            m: '0 20px 0 20px',
            backgroundColor: '#f9f9fa',
            display: 'flex',
            borderRadius: '32px',
            padding: '2px 20px 2px 5px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#eefcf3',
            },
          }}
        >
          <Box
            sx={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#1a6d33ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: '10px',
              svg: {
                width: '34px',
                height: '34px',
              },
            }}
          >
            <RamadanIcon color='#ffffffff' />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '13px', lineHeight: '21px', color: 'gray.600', fontWeight: 'bold' }}>
              {ramadanTime?.label || 'Iftorlik vaqti'}
            </Typography>
            <Typography sx={{ fontSize: '18px', lineHeight: '20px', color: 'bunker.950', fontWeight: 'bold' }}>{ramadanTime?.time || '--:--'}</Typography>
          </Box>
        </Box>
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
                }}
                placement='bottom-end'
                buttonLabel={
                  <Box width={'100%'} mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
                    <div className={classes.avatarPlaceholder}>
                      <CustomImg src={get(userData, 'photo')} />
                    </div>

                    <Box width={'100%'}>
                      <Typography textAlign={'start'} id='user-username' className={classes.username}>
                        {`${firstName}`}
                      </Typography>

                      <p id='user-shopname' className={`${classes.shopname} shopname`}>
                        {get(userData, 'position') == '' ? get(userData, 'store.name') : get(userData, 'position')}
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
                            <CustomImg src={userData?.photo} alt={userData?.first_name} className={classes.avatar} />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography fontWeight={'600'} fontSize={18}>
                            {get(userData, 'first_name')} {get(userData, 'last_name')}
                          </Typography>

                          <Typography color={'bunker.400'} fontWeight={'500'} fontSize={14}>
                            {get(userData, 'position') == '' ? get(userData, 'store.name') : get(userData, 'position')}
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
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: 'gray.50',
          }}
          onClick={() => setOpenMessage(true)}
        >
          <NotificationSmallIcon />
          {message ? (
            <Typography
              sx={{
                width: '20px',
                height: '20px',
                backgroundColor: '#fe5000',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '600',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ml: '5px',
                position: 'absolute',
                top: '-4px',
                right: '-7px',
              }}
            >
              {message}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <MessagesDrawer isLoading={isLoading} messagesCount={message} open={openMessage} onClose={setOpenMessage} />
      <RamadanDrawer open={openRamadan} onClose={setOpenRamadan} />
    </Box>
  )
}

export default LayoutHeader
