import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavBar from '../Navbar'
import { makeStyles } from '@mui/styles'
import LayoutHeader from '../LayoutHeader'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  headerWrapper: {
    width: '100%',

    padding: '0px 0 0 20px',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
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

export default function DashboardLayout({ hasHeader = true }) {
  const classes = useStyles()

  return (
    <Box display='flex' width='100%' minHeight='100%'>
      <div className={classes.root}>
        <NavBar />
        <div className={classes.headerWrapper}>
          {hasHeader ? <LayoutHeader /> : <></>}
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
      </div>
    </Box>
  )
}
