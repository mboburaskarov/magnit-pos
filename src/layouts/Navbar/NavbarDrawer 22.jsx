import { Box, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import LogoMain from '../../assets/icons/LogoMain'
import LogoLetters from '../../assets/icons/LogoLetters'
import SidebarIcon from '../../assets/icons/SidebarIcon'
import BackArrowIcon from '../../assets/icons/BackArrow'
import NavItem from './NavItem'
import NavItemMini from './NavItemMini'
import isEqual from '../../../utils/isEqual'
import { useTranslation } from 'react-i18next'
import { size } from 'lodash'

function NavbarDrawer({ classes, isOpen, handleDrawerToggle, currentRoutesMemoized, currentRoutes, setCurrentRoutes, setShowDialog, setNextHref, drawerData }) {
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
              <span className={classes.logo_letter_main}>{<LogoLetters />}</span>
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
        <Box>
          {drawerData?.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                <Typography className={classes.accordionTitle} sx={{ fontWeight: 'bold' }}>
                  {item.icon} {t(item.label)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {item.children?.map((child, childIndex) => (
                  <NavItem
                    key={childIndex}
                    item={child}
                    classes={classes}
                    handleClickNavItems={setCurrentRoutes}
                    isActive={`${location.pathname}` === child.href}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </List>
    </div>
  )
}

export default memo(NavbarDrawer, (prevProps, nextProps) => isEqual(prevProps, nextProps))
