import CloseIcon from '@/assets/icons/CloseIcon'
import { Box, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import thousandDivider from '@utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  drawer: {
    maxWidth: '640px',
    '& .MuiDrawer-paper': {
      width: '60%',
      maxWidth: '640px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    height: '80px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Gilroy-Bold, sans-serif',
    fontSize: 24,
    fontWeight: 700,
    color: theme.palette.bunker[950],
    lineHeight: '32px',
  },
}))
export default function TargetDrawer({ openDrawer, closeDrawer }) {
  const classes = useStyles()
  console.log('openDrawer', openDrawer)
  return (
    <Drawer className={classes.drawer} open={openDrawer?.open} onClose={closeDrawer} anchor='right'>
      <Box className={classes.header}>
        <Typography className={classes.title}>Таргет</Typography>
        <CloseIcon color={'black'} onClick={() => closeDrawer(false)} />
      </Box>
      <Box sx={{ padding: '12px 20px', mt: '24px' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '28px', fontWeight: '600', color: 'bunker.950' }}>
          Цель на месяц {thousandDivider(openDrawer?.total, 'сум')}{' '}
        </Typography>
        <Box sx={{ width: '100%', height: '36px', backgroundColor: 'orange.200', borderRadius: '6px', mt: '10px' }}>
          <Box width={openDrawer?.current / openDrawer?.total + '%'} height={36} sx={{ backgroundColor: 'orange.500', borderRadius: '6px' }}>
            {openDrawer?.progress > 10 && (
              <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '500', color: 'white', textAlign: 'center' }}>
                {openDrawer?.progress + '%'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
