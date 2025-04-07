import { Box, List, ListItem, Typography } from '@mui/material'
import { get, size } from 'lodash'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import isEqual from '../../../utils/isEqual'
import BackArrowIcon from '../../assets/icons/BackArrow'
import LogoLetters from '../../assets/icons/LogoLetters'
import LogoMain from '../../assets/icons/LogoMain'
import SidebarIcon from '../../assets/icons/SidebarIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import NavItem from './NavItem'
import NavItemMini from './NavItemMini'
function NavbarDrawer({
  classes,
  isOpen,
  handleDrawerToggle,
  currentRoutesMemoized,
  currentRoutes,
  setCurrentRoutes,
  setShowDialog,
  setNextHref,
  drawerData,
  setIsUserOpen,
}) {
  const { t } = useTranslation()
  const location = useLocation()
  const { values } = useQueryParams()
  const isNewSalePage = location?.pathname?.split('new-sale/')[0] == '/sales/'
  const userData = useSelector((state) => state.user)
  const firstName = userData?.fullName?.split(' ')?.[0]
  const lastName = userData?.fullName?.split(' ')?.[1]

  return (
    <div id='navbar' className={classes.container}>
      <div className={classes.logo}>
        {isOpen && (
          <Box
            display='flex'
            sx={{
              '& a': {
                padding: '2px 6px',
              },
            }}
          >
            <Link to='/dashboard' className={classes.brandLogo}>
              <span className={classes.logo_main}>{<LogoMain />}</span>
              <span className={classes.logo_letter_main}> {<LogoLetters />}</span>
            </Link>
          </Box>
        )}

        <button type='button' className={classes.close_icon} onClick={handleDrawerToggle}>
          <span className={isOpen ? classes.right_faced : classes.left_faced}>
            <SidebarIcon withoutBoxLine={false} />
          </span>
        </button>
      </div>
      <List className={classes.list}>
        {!isOpen && size(currentRoutesMemoized, 0) != 0 && (
          <div className={`${classes.popperParent} popper`}>
            <div className={`${classes.popper}`}>
              <ListItem className={classes.listItemPopper}>
                {currentRoutesMemoized?.icon}
                {t(currentRoutesMemoized?.label)}
              </ListItem>
              <div className={classes.hr} />
              <Box p={'20px'}>
                {currentRoutesMemoized?.children?.map((item, index) => {
                  return (
                    <NavItem
                      item={item}
                      key={index}
                      classes={classes}
                      handleClickNavItems={setCurrentRoutes}
                      handleShowDialog={setShowDialog}
                      setNextHref={setNextHref}
                      isActive={`/${location.pathname.split('/')[1]}` === item?.href}
                    />
                  )
                })}
              </Box>
            </div>
          </div>
        )}
        <Box className='fixed_navlist'>
          {!size(currentRoutes) && isOpen && (
            <div className={classes.parent}>
              {drawerData?.map((item, index) => (
                <NavItem
                  isActive={`/${location.pathname.split('/')[1]}` === item?.href}
                  item={item}
                  key={index}
                  classes={classes}
                  handleClickNavItems={setCurrentRoutes}
                />
              ))}
            </div>
          )}
          {!isOpen && (
            <div className={`${classes.parent}`}>
              {drawerData?.map((item, index) => (
                <NavItemMini item={item} isActive={`/${location.pathname.split('/')[1]}` === item?.href} key={index} handleClickNavItems={setCurrentRoutes} />
              ))}
            </div>
          )}
          {isOpen && size(currentRoutes, 0) != 0 && (
            <div className={`${classes.child} ${classes.activeChild}`}>
              <ListItem className={classes.listItem} id='back-nav' onClick={() => setCurrentRoutes(null)}>
                <>
                  <div className=' bottomIcon'>
                    <BackArrowIcon />
                  </div>
                  {currentRoutesMemoized?.icon}
                  {t(currentRoutesMemoized.label)}
                </>
              </ListItem>
              {currentRoutesMemoized?.children?.map((item, index) => {
                return (
                  <NavItem isActive={`${location.pathname}` == item?.href} item={item} key={index} classes={classes} handleClickNavItems={setCurrentRoutes} />
                )
              })}
            </div>
          )}
        </Box>
      </List>
      {isNewSalePage && (
        <ListItem onClick={() => setIsUserOpen(true)} width={'100% !important'} className={`${classes.currentNavBarUser} drawer_user_avatar`} id='avatar'>
          <Box mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
            <Box className={classes.avatarPlaceholder}>
              <img src={get(userData, 'photo')} />
            </Box>

            {isOpen && (
              <Box maxWidth='73%'>
                <Typography id='user-username' className={classes.username}>
                  {get(userData, 'store.name')}
                </Typography>
                <p id='user-shopname' className={`${classes.shopname} shopname`}>
                  {get(userData, 'store.store_code')}
                </p>
              </Box>
            )}
          </Box>
          {/* <Box display={'flex'} alignItems={'center'}>
              <ArrowDown />
            </Box> */}
        </ListItem>
      )}
    </div>
  )
}

export default memo(NavbarDrawer, (prevProps, nextProps) => isEqual(prevProps, nextProps))
