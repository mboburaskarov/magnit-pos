import LoadingContainer from '@components/LoadingContainer'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import hasAccess from '@utils/hasAccess'
import { requests } from '@utils/requests'
import { clearAuthSession } from '@utils/session'
import { EPOS_STATUS_PAYLOAD, EPOS_TERMINAL_PAYLOAD, getEposTerminalId, isAllowedTerminal } from '@utils/terminalAccess'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { setUserData } from '../redux-toolkit/userSlice'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: theme.palette.background.default,
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    padding: '32px',
    borderRadius: '24px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 12px 40px 0px rgba(16, 24, 40, 0.08)',
    border: `1px solid ${theme.palette.bunker[100]}`,
  },
  title: {
    margin: '0 0 12px',
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 700,
    color: theme.palette.bunker[950],
  },
  description: {
    margin: '0 0 24px',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.gray[600],
    whiteSpace: 'pre-line',
  },
  storeBadge: {
    margin: '0 0 16px',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    color: theme.palette.orange[500],
  },
}))

const getLocalUserData = () => {
  try {
    return JSON.parse(localStorage.getItem('user_data') || 'null')
  } catch (error) {
    return null
  }
}

const normalizeUserData = (rawUser) => {
  if (!rawUser) {
    return null
  }

  return {
    ...rawUser,
    type: rawUser.type || rawUser.role_type,
    role_actions: rawUser.role_actions || rawUser.permissions || [],
  }
}

export default function TerminalAccessGuard({ children }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userData = useSelector((state) => state.user)
  const validatedKeyRef = useRef(null)
  const [guardState, setGuardState] = useState({
    checked: false,
    blocked: false,
    message: '',
  })

  const accessToken = localStorage.getItem('access_token')
  const isLoginPage = location.pathname === '/login'

  const { data: userInfo, isLoading: isUserInfoLoading, isFetched: isUserInfoFetched } = useQuery('userInfo', () => requests.getUserInfo(), {
    enabled: Boolean(accessToken && !isLoginPage),
    retry: 1,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (userInfo?.data?.data) {
      dispatch(setUserData({ ...userInfo.data.data }))
    }
  }, [dispatch, userInfo?.data?.data])

  const currentUser = useMemo(() => {
    if (userInfo?.data?.data) {
      return normalizeUserData(userInfo.data.data)
    }

    if (userData?.id && userData?.store?.id) {
      return normalizeUserData(userData)
    }

    return normalizeUserData(getLocalUserData())
  }, [userData, userInfo?.data?.data])

  const shouldCheckTerminal = Boolean(accessToken && !isLoginPage && currentUser?.id && currentUser?.store && hasAccess('check-terminal-id', currentUser))
  const validationKey = `${accessToken || 'no-token'}:${currentUser?.id || 'no-user'}:${currentUser?.store?.id || 'no-store'}`

  useEffect(() => {
    if (isLoginPage) {
      setGuardState((prevState) => (prevState.blocked ? prevState : { checked: true, blocked: false, message: '' }))
      return
    }

    if (!accessToken) {
      validatedKeyRef.current = null
      setGuardState((prevState) => (prevState.blocked ? prevState : { checked: true, blocked: false, message: '' }))
      return
    }

    if (isUserInfoLoading || (!currentUser?.id && !isUserInfoFetched)) {
      setGuardState((prevState) => ({ ...prevState, checked: false }))
      return
    }

    if (!currentUser?.id) {
      clearAuthSession()
      navigate('/login', { replace: true })
      return
    }

    if (!shouldCheckTerminal) {
      validatedKeyRef.current = validationKey
      setGuardState({ checked: true, blocked: false, message: '' })
      return
    }

    if (validatedKeyRef.current === validationKey) {
      setGuardState((prevState) => ({ ...prevState, checked: true }))
      return
    }

    let isCancelled = false

    const validateTerminal = async () => {
      setGuardState({ checked: false, blocked: false, message: '' })

      try {
        const statusResponse = await requests.checkEPOSTurnOn(EPOS_STATUS_PAYLOAD)

        if (statusResponse?.data?.error) {
          if (!isCancelled) {
            validatedKeyRef.current = validationKey
            setGuardState({ checked: true, blocked: false, message: '' })
          }
          return
        }

        const terminalResponse = await requests.closeCheckZReport(EPOS_TERMINAL_PAYLOAD)
        const terminalId = getEposTerminalId(terminalResponse?.data)
        const terminalIds = currentUser?.store?.terminal_ids || []
        const allowedTerminal = isAllowedTerminal(terminalId, terminalIds)

        if (!allowedTerminal) {
          const message = `Вы в другом филиале!\nEpos: ${terminalId}\nPharma: ${terminalIds.join(',')}`

          clearAuthSession()

          if (!isCancelled) {
            validatedKeyRef.current = null
            setGuardState({ checked: true, blocked: true, message })
          }
          return
        }

        if (!isCancelled) {
          validatedKeyRef.current = validationKey
          setGuardState({ checked: true, blocked: false, message: '' })
        }
      } catch (error) {
        const isConnectionRefused = error?.code === 'ERR_CONNECTION_REFUSED' || error?.message?.includes('ERR_CONNECTION_REFUSED') || error?.request && !error?.response
        const isSuperAdmin = currentUser?.type === 'SUPERADMIN'

        if (!isCancelled) {
          if (isConnectionRefused && !isSuperAdmin) {
            validatedKeyRef.current = null
            setGuardState({ checked: true, blocked: true, message: 'EPOS terminaliga ulanib bo\'lmadi. Kirish bloklandi.' })
          } else {
            validatedKeyRef.current = validationKey
            setGuardState({ checked: true, blocked: false, message: '' })
          }
        }
      }
    }

    validateTerminal()

    return () => {
      isCancelled = true
    }
  }, [accessToken, currentUser, isLoginPage, isUserInfoFetched, isUserInfoLoading, navigate, shouldCheckTerminal, validationKey])

  if (guardState.blocked && !isLoginPage) {
    return (
      <Box className={classes.root}>
        <Box className={classes.card}>
          <Typography className={classes.title}>Kirish bloklandi</Typography>
          {currentUser?.store?.name ? <Typography className={classes.storeBadge}>Do&apos;kon: {currentUser.store.name}</Typography> : null}
          <Typography className={classes.description}>
            {guardState.message || 'Bu foydalanuvchi uchun terminal mos kelmadi.'}
          </Typography>
          <Button
            variant='contained'
            onClick={() => {
              setGuardState({ checked: true, blocked: false, message: '' })
              navigate('/login', { replace: true })
            }}
          >
            Login sahifasiga qaytish
          </Button>
        </Box>
      </Box>
    )
  }

  if (!guardState.checked) {
    return <LoadingContainer fullHeight />
  }

  return children
}
