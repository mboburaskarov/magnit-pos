import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import ArrowDown from '../src/assets/icons/ArrowDown'
import ArrowUp from '../src/assets/icons/ArrowUp'

function HeaderWithDashboardWrapper({ title, component }) {
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)

  return (
    <>
      <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {title}
        </Typography>
        <Box
          sx={{
            m: 'auto 0',
            userSelect: 'none !important',
            cursor: 'pointer',
            '& > p': {
              cursor: 'pointer',
              userSelect: 'none !important',
            },
          }}
          display={'flex'}
          onClick={() => setIsOpenStatDashboard((p) => !p)}
        >
          {isOpenStatDashboard ? <ArrowUp color='#111217' /> : <ArrowDown />}
          <Typography sx={{ fontWeight: '600', whiteSpace: 'pre' }}>{isOpenStatDashboard ? 'Скрыть статистику' : 'Показать статистику'}</Typography>
        </Box>
      </Box>
      {isOpenStatDashboard && component}
    </>
  )
}

export default HeaderWithDashboardWrapper
