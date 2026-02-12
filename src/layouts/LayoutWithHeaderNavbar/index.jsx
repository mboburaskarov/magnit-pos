import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import LayoutHeader from '../LayoutHeader'
import NavBar from '../Navbar'
import { useWebView } from '../WebviewProvider'

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
    maxWidth: ({ isOpen, isWebview }) => (isWebview ? '100vw' : isOpen ? 'calc(100vw - 292px)' : 'calc(100vw - 20px)'),
  },
  main: {
    flex: '1 1 100%',
  },
}))

export default function DashboardLayout({ hasHeader = true }) {
  const { isWebview } = useWebView()
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const classes = useStyles({ isOpen, isWebview })
  return (
    <Box display='flex' width='100%' minHeight='100%'>
      <div className={classes.root}>
        {isWebview ? null : <NavBar />}
        <div className={classes.headerWrapper}>
          {hasHeader ? isWebview ? null : <LayoutHeader /> : <></>}
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
