import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

function NavItemMini({ item, handleClickNavItems, isActive }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)

  return (
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
        if (item.children?.length > 0 && !isOpen) {
          event.preventDefault()
          handleClickNavItems(item)
        }
      }}
    >
      {item.icon}
    </Box>
  )
}

export default NavItemMini
