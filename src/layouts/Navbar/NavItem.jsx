import { NavLink as RouterLink, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ForwardArrow from '../../assets/icons/ForwardArrow'

function NavItem({ item, classes, handleClickNavItems, isActive }) {
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
          {item.label}
        </div>
        {item?.icon && !!item?.children && (
          <div className={classes.itemArrow}>
            <ForwardArrow />
          </div>
        )}
      </ListItem>
    </>
  )
}

export default NavItem
