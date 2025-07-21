import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import NavBar from '../Navbar'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    width: '100%',
    height: '100%',
  },

  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    padding: '0 0 0 20px',
  },
  contentContainer: {
    flex: '1 1 auto',
  },
  content: {
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
  },
  main: {
    flex: '1 1 100%',
  },
}))

export default function DashboardLayout() {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const classes = useStyles({ isOpen })
  return (
    <Box display='flex' width='100%' minHeight='100%'>
      <div className={classes.root}>
        <NavBar />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              <main className={classes.main}>
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}
