import { Drawer, Hidden } from '@mui/material'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { requests } from '../../../utils/requests'
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect'
import { sidebarToggle } from '../../redux-toolkit/sidebarSettingsSlice'
import { setUserData } from '../../redux-toolkit/userSlice'
import { filterNavData } from '../../Routes'
import { navbatRouteData } from '../../routes/navbatRouteData'
import NavbarDrawer from './NavbarDrawer'
import { navbarStyles } from './NavbarStyles'
import UserDrawer from './userDrawer'

export default function Navbar() {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const user_data = useSelector((state) => state.user)
  const classes = navbarStyles({ isOpen })
  const dispatch = useDispatch()
  const { data: userInfo } = useQuery('userInfo', () => requests.getUserInfo())
  const [currentRoutes, setCurrentRoutes] = useState(null)
  const [isUserOpen, setIsUserOpen] = useState(null)
  const currentRoutesRef = useRef(currentRoutes)

  const handleDrawerToggle = useCallback(() => {
    dispatch(sidebarToggle(!isOpen))
  }, [isOpen, dispatch])
  useDeepCompareEffect(() => {
    if (currentRoutes) currentRoutesRef.current = currentRoutes
  }, [currentRoutes])
  useEffect(() => {
    if (userInfo?.data) {
      dispatch(setUserData({ ...userInfo?.data?.data }))
    }
  }, [userInfo?.data])
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
    </>
  )
}
