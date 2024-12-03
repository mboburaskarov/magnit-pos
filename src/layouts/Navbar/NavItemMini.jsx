import { Box, ListItem } from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink as RouterLink, useNavigate } from 'react-router-dom'

function NavItemMini({ item, handleClickNavItems, isActive }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)

  return (
    <ListItem
      // aria-describedby='popper'
      // className={`${classes.listItem} ${item.className || ''} drawer_list_item`}
      // style={{ backgroundColor: isActive && palette.orange[500] }}
      component={RouterLink}
      to={item.href}
      sx={{ p: 0, m: 0 }}
      onClick={(event) => {
        if (item.children?.length) {
          event.preventDefault()
          handleClickNavItems(item)
        }
      }}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          marginLeft: 4,
          marginBottom: 2,
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: isActive && theme.palette.orange[500],
          '&:hover': {
            backgroundColor: theme.palette.orange[500],
          },
          '&:hover svg > .stroke-icon': {
            stroke: theme.palette.white,
          },
          '&:hover svg > .fill-icon': {
            fill: theme.palette.white,
          },
          '& svg > .stroke-icon': {
            stroke: isActive && theme.palette.white,
          },
          '& svg > .fill-icon': {
            fill: isActive && theme.palette.white,
          },
        })}
        onMouseOver={(event) => {
          console.log(item.children?.length)

          if (item.children?.length > 0 && !isOpen) {
            event.preventDefault()
            handleClickNavItems(item)
          } else if (!item.children?.length) {
            event.preventDefault()
            handleClickNavItems([])
          }
        }}
      >
        {item.icon}
      </Box>
    </ListItem>
  )
}

export default NavItemMini
