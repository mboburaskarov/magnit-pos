import { Typography, useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import { useTranslation } from 'react-i18next'
import { NavLink as RouterLink } from 'react-router-dom'
import BottomArrowIcon from '../../assets/icons/BottomArrowIcon'
function NavItem({ item, classes, handleClickNavItems, isActive }) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <>
      <ListItem
        aria-describedby='popper'
        className={`${classes.listItem} ${item.className || ''} drawer_list_item`}
        component={RouterLink}
        to={item.href}
        onClick={(event) => {
          if (item.children?.length) {
            event.preventDefault()
            handleClickNavItems(item)
          }
        }}
      >
        {item?.icon && <div className={`${classes.itemIcon} drawer_icon`}>{item.icon}</div>}
        <div
          className={classes.itemLabel + ' ' + 'itemLabel'}
          id={item.label}
          style={{
            color: isActive && palette.white,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t(item.label)}
          {item.soon && (
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
                ml: '20px',
              }}
            >
              soon
            </Typography>
          )}
        </div>

        {item?.icon && !!item?.children && (
          <div className={classes.itemArrow + ' bottomIcon'}>
            <BottomArrowIcon color={isActive ? '#fff' : palette.bunker[400]} />
          </div>
        )}
      </ListItem>
    </>
  )
}

export default NavItem
