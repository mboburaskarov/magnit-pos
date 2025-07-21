import { makeStyles } from '@mui/styles'
import { Outlet } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'white',
    display: 'flex',
    height: '100%',
    width: '100%',
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
    position: 'relative',
  },
}))

export default function MainLayout() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
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
  )
}
