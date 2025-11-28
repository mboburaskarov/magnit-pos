import { Box, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
const ProgressPoint = ({ hasWay = true }) => (
  <Box sx={{ flex: 1, display: 'flex', position: 'relative', justifyContent: 'center', padding: '16px 12px' }}>
    <Box
      sx={{
        backgroundColor: 'orange.500',
        borderRadius: '50%',
        zIndex: 9,
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    ></Box>
    {hasWay && (
      <Box
        sx={{
          width: '10px',
          height: '50px',
          position: 'absolute',
          top: 24,
          background: `repeating-linear-gradient(
        45deg,
        #FFE9D4
      )`,
        }}
      />
    )}
  </Box>
)

export default function LoyaltyLevel() {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: 700,
          color: 'bunker.950',
          padding: '16px 25px 12px',
        }}
      >
        Уровень лояльности
      </Typography>
      <Box
        sx={{
          m: '20px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'bunker.100',
          '& .body-cell': {
            flex: 1,
            padding: '16px 12px',
            '& p': {
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '600',
              color: 'bunker.950',
            },
          },
          '& .body-cell-wrapper': {
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 0,
            '&:hover': { backgroundColor: 'orange.100' },
            cursor: 'pointer',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',

            '& .header-cell': {
              width: '100%',
              flex: 1,
              minHeight: '56px',
              bgcolor: 'bg.10',
              padding: '16px 12px',
              '& p': {
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '600',
                color: 'bunker.950',
              },
            },
          }}
        >
          <Box className='header-cell'>
            <Typography></Typography>
          </Box>

          <Box className='header-cell'>
            <Typography>Название</Typography>
          </Box>
          <Box className='header-cell'>
            <Typography>Сумма покупок</Typography>
          </Box>
          <Box className='header-cell'>
            <Typography>Кэшбек</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <Box className='body-cell-wrapper'>
            <ProgressPoint />

            <Box className='body-cell'>
              <Typography>silver</Typography>
            </Box>
            <Box className='body-cell'>
              <Typography>{thousandDivider(1000, 'сум')}</Typography>
            </Box>

            <Box className='body-cell'>
              <Typography>1%</Typography>
            </Box>
          </Box>

          <Box className='body-cell-wrapper'>
            <ProgressPoint />
            <Box className='body-cell'>
              <Typography>gold</Typography>
            </Box>
            <Box className='body-cell'>
              <Typography>{thousandDivider(2000000, 'сум')}</Typography>
            </Box>

            <Box className='body-cell'>
              <Typography>2%</Typography>
            </Box>
          </Box>

          <Box className='body-cell-wrapper'>
            <ProgressPoint hasWay={false} />
            <Box className='body-cell'>
              <Typography>platinum</Typography>
            </Box>
            <Box className='body-cell'>
              <Typography>{thousandDivider(3000000, 'сум')}</Typography>
            </Box>

            <Box className='body-cell'>
              <Typography>3%</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
