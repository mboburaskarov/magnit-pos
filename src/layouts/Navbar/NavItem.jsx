import { NavLink as RouterLink, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import BottomArrowIcon from '../../assets/icons/BottomArrowIcon'
import { useTranslation } from 'react-i18next'
function NavItem({ item, classes, handleClickNavItems, isActive }) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <>
      <ListItem
        aria-describedby='popper'
        className={`${classes.listItem} ${item.className || ''} drawer_list_item`}
        style={{ backgroundColor: isActive && palette.orange[500] }}
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
          className={classes.itemLabel}
          id={item.label}
          style={{
            color: isActive && palette.white,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t(item.label)}
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
