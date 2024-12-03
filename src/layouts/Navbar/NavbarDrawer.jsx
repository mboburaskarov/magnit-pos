import { Box, List, ListItem, Skeleton, Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import LogoMain from '../../assets/icons/LogoMain'
import LogoLetters from '../../assets/icons/LogoLetters'
import SidebarIcon from '../../assets/icons/SidebarIcon'
import NavItem from './NavItem'
import NavItemMini from './NavItemMini'
import isEqual from '../../../utils/isEqual'
import BackArrowIcon from '../../assets/icons/BackArrow'
import { useTranslation } from 'react-i18next'
import { size } from 'lodash'

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
            </div>
          </div>
        )}
        <Box className='fixed_navlist'>
          {!currentRoutes && isOpen && (
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
          {isOpen && currentRoutes && (
            <div className={`${classes.child} ${classes.activeChild}`}>
              <ListItem className={classes.listItem + ' bottomIcon'} id='back-nav' onClick={() => setCurrentRoutes(null)}>
                <>
                  <BackArrowIcon /> {currentRoutesMemoized?.icon}
                  {t(currentRoutesMemoized.label)}
                </>
              </ListItem>
              {currentRoutesMemoized?.children?.map((item, index) => {
                return (
                  <NavItem isActive={`${location.pathname}` === item?.href} item={item} key={index} classes={classes} handleClickNavItems={setCurrentRoutes} />
                )
              })}
            </div>
          )}
        </Box>
      </List>
      {/* {!userData?.fullName ? (
        <Box position='relative' marginTop={'auto'}>
          <Box className={classes.fakeImage} />
          <Skeleton className={classes.skeleton} />
        </Box>
      ) : (
        <ListItem className={`${classes.currentUser} drawer_user_avatar`} id='avatar' onClick={() => setIsUserOpen(userData)}>
          <Box display='flex' alignItems='center' justifyContent='flex-start'>
            <div className={classes.avatarPlaceholder}>
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </div>

            <Box maxWidth='73%'>
              <Typography id='user-username' className={classes.username}>
                {`${lastName || ''} ${firstName.charAt(0) + '.' || ''}`}
              </Typography>
              <p id='user-shopname' className={`${classes.shopname} shopname`}>
                {userData.type.toLowerCase()}
              </p>
            </Box>
          </Box>
        </ListItem>
      )} */}
    </div>
  )
}

export default memo(NavbarDrawer, (prevProps, nextProps) => isEqual(prevProps, nextProps))
