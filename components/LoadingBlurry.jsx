import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 200,
    backdropFilter: 'blur(5px)',
    background: `rgba(255, 255, 255, 0.16)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outside: {
    top: -8,
    left: -8,
    width: 'calc(100% + 16px)',
    height: 'calc(100% + 16px)',
  },
}))
export default function LoadingBlurry({ isLoading, outside, width }) {
  const classes = useStyles({ width })
  return (
    <>
      {isLoading ? (
        <Box className={`${classes.root} ${outside ? classes.outside : ''}`}>
          <div className='dot-flashing'>
            <span />
            <span />
            <span />
            <span />
          </div>
        </Box>
      ) : (
        ''
      )}
    </>
  )
}
