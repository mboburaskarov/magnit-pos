import NavbarDrawer from './NavbarDrawer'
import clsx from 'clsx'
import { Drawer, Hidden } from '@mui/material'
import { navbarStyles } from './NavbarStyles'
import { useDispatch, useSelector } from 'react-redux'
import { sidebarToggle } from '../../redux-toolkit/sidebarSettingsSlice'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { navbatRouteData } from '../../routes/navbatRouteData'
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect'
import UserDrawer from './userDrawer'
import { filterNavData } from '../../Routes'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { setUserData } from '../../redux-toolkit/userSlice'

export default function Navbar() {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const user_data = useSelector((state) => state.user)
  const classes = navbarStyles({ isOpen })
  const dispatch = useDispatch()
  const access_token = localStorage.getItem('access_token')
  // const { data: userInfo } = useQuery('userInfo', () => requests.getUserInfo(), { enabled: !!access_token })
  // const { data: rolesData } = useQuery('rolesData', () => requests.getAllRoles(), { enabled: !!userInfo })
  // const findRole = rolesData?.data?.orders?.find((item) => item?.name === userInfo?.data?.type)
  // const { data: roleActions } = useQuery('roleActions', () => requests.getSingleRoleActions({ roleId: findRole?._id }), {
  // enabled: !!findRole,
  // })
  const [currentRoutes, setCurrentRoutes] = useState(null)
  const [isUserOpen, setIsUserOpen] = useState(null)
  const currentRoutesRef = useRef(currentRoutes)
  const handleDrawerToggle = useCallback(() => {
    dispatch(sidebarToggle(!isOpen))
  }, [isOpen, dispatch])
  useDeepCompareEffect(() => {
    if (currentRoutes) currentRoutesRef.current = currentRoutes
  }, [currentRoutes])
  // useEffect(() => {
  //   if (userInfo?.data && roleActions?.data) {
  //     dispatch(setUserData({ ...userInfo?.data, role_actions: roleActions?.data[0]?.actions }))
  //   }
  // }, [roleActions?.data, userInfo?.data])
  const currentRoutesMemoized = useMemo(() => currentRoutes || currentRoutesRef?.current, [currentRoutesRef, currentRoutes])
  const routeString = []
  user_data?.role_actions?.forEach((item) => {
    if (item.route) {
      routeString.push(item.route)
    }
  })
  return (
    <>
      <div className={classes.root}>
        <nav>
          <Hidden xsDown implementation='css'>
            <Drawer
              variant='permanent'
              className={`${classes.drawer} ${isOpen ? classes.drawerOpen : classes.drawerClose}`}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: isOpen,
                  [classes.drawerClose]: !isOpen,
                }),
              }}
            >
              <NavbarDrawer
                classes={classes}
                isOpen={isOpen}
                handleDrawerToggle={handleDrawerToggle}
                currentRoutesMemoized={currentRoutesMemoized}
                currentRoutes={currentRoutes}
                setCurrentRoutes={setCurrentRoutes}
                drawerData={filterNavData(navbatRouteData, routeString, user_data)}
                setIsUserOpen={setIsUserOpen}
              />
            </Drawer>
          </Hidden>
        </nav>
      </div>

      <UserDrawer isOpen={isUserOpen} closeDrawer={() => setIsUserOpen(null)} />

      {/* <ConfirmDialog
        open={showDialog}
        setOpen={setShowDialog}
        icon={<BigWarningIcon />}
        title={t('alerts.save_changes_postpone')}
        desc={t('alerts.save_changes_postpone_desc')}
        actions={
          <>
            <Button
              secondary
              id='stopOrderPostpone'
              onClick={() => {
                setShowDialog(false)
                navigate(nextHref)
                window.sessionStorage.removeItem('disableRoute')
                window.sessionStorage.removeItem('expiredDatePostpone')
              }}
            >
              {t('buttons.dont_save')}
            </Button>
            <Button
              size='medium'
              variant='contained'
              onClick={onSubmitPostpone}
              isLoading={creatingPostpone}
            >
              {t('buttons.save_changes')}
            </Button>
          </>
        }
      /> */}
    </>
  )
}
