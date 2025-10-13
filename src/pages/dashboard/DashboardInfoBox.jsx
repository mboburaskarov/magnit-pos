import { Box, Typography, Skeleton } from '@mui/material'
import thousandDivider from '../../../utils/thousandDivider'
import FallIcon from '../../assets/icons/FallIcon'
import GrowIcon from '../../assets/icons/GrowIcon'

export default function DashboardInfoBox({ noDot, ind, title, icon, count, amount, percent, id, old, endText, withoutDivider, isLoading, ...l }) {
  const isFall = percent < 0

  return (
    <Box sx={(theme) => ({ border: 1, borderRadius: '16px', borderColor: '#A4A5AB33', minHeight: '154px', width: '100%' })}>
      <Box key={ind} sx={(theme) => ({ p: '20px', minHeight: '115px', m: 0 })}>
        <Box width='100%' alignItems={'start'} flexDirection={'column'} display='inline-flex'>
          {!noDot && <Box height={'48px'}>{isLoading ? <Skeleton variant='circular' width={48} height={48} sx={{ borderRadius: '12px' }} /> : icon}</Box>}
          <Box flex={1}>
            {isLoading ? (
              <Skeleton variant='rectangular' width='65%' height={20} sx={{ mt: '16px', borderRadius: '6px' }} />
            ) : (
              <Typography display={'flex'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'} mt={'16px'}>
                {title}{' '}
                {id === 'expiring_soon_amount' || id === 'expired_soon_amount' ? (
                  <Typography
                    sx={{
                      padding: '3px 8px 1px',
                      borderRadius: '16px',
                      backgroundColor: 'bunker.100',
                      fontWeight: '500',
                      fontSize: '12px',
                      ml: '8px',
                      lineHeight: '16px',
                      color: 'bunker.500',
                    }}
                  >
                    {withoutDivider ? count : thousandDivider(count, '')} {endText}
                  </Typography>
                ) : (
                  ''
                )}
              </Typography>
            )}
          </Box>
        </Box>

        {
          <Box mt={icon ? '0px' : 0} width='100%' justifyContent='space-between' alignItems='center' display='inline-flex'>
            <Box flex={1}>
              {isLoading ? (
                <Skeleton variant='rectangular' width='55%' height={40} sx={{ borderRadius: '8px', mt: '8px' }} />
              ) : (
                <Typography
                  alignItems={'end'}
                  display={'flex'}
                  color='dark.500'
                  fontSize={'28px'}
                  lineHeight={'40px'}
                  fontWeight='700'
                  variant='h1'
                  sx={{
                    '& > p': {
                      fontSize: '28px',
                      lineHeight: '40px',
                      fontWeight: '700 !important',
                      color: 'dark.500',
                    },
                  }}
                >
                  {withoutDivider ? Math.round(amount) : <Typography>{thousandDivider(Math.round(amount), 'сум')}</Typography>}
                </Typography>
              )}
            </Box>
          </Box>
        }
      </Box>

      <Box key={ind} sx={(theme) => ({ py: '18px', px: '20px', m: 0, borderTop: 1, borderColor: '#A4A5AB33' })}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {percent < 1000 && (
            <>
              {isLoading ? (
                <Skeleton variant='rectangular' width={65} height={26} sx={{ borderRadius: '16px' }} />
              ) : (
                <Box
                  display='inline-flex'
                  sx={{
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px 8px 1px',
                    backgroundColor: !isFall ? '#30BE821F' : '#FF46393D',
                  }}
                  alignItems='center'
                >
                  <Typography color={isFall ? '#FF4639' : '#30BE82'} fontWeight='500' fontSize={12} lineHeight={'16px'}>
                    {!isFall ? '+' : ''} {percent}%
                  </Typography>
                </Box>
              )}
            </>
          )}
          <Box sx={{ ml: '10px' }}>
            {isLoading ? (
              <Skeleton variant='rectangular' width={140} height={16} sx={{ borderRadius: '6px' }} />
            ) : (
              <Typography color='bunker.500' fontSize={'12px'} lineHeight={'16px'} fontWeight='500' variant='h1'>
                {thousandDivider(old)} {endText} за прошедший период
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
