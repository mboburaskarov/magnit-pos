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
          {!noDot && <Box>{isLoading ? <Skeleton variant='circular' width={18} height={18} /> : icon}</Box>}
          <Box flex={1}>
            {isLoading ? (
              <Skeleton variant='text' width='80%' height={24} />
            ) : (
              <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'dark.500'} mt={'16px'}>
                {title}
              </Typography>
            )}
          </Box>
        </Box>

        {
          <Box mt={icon ? '0px' : 0} width='100%' justifyContent='space-between' alignItems='center' display='inline-flex'>
            <Box flex={1}>
              {isLoading ? (
                <Skeleton variant='text' width='60%' height={40} />
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
                  {id === 'expiring_soon_amount' || id === 'expired_soon_amount' ? (
                    <>
                      {thousandDivider(Math.round(amount), 'сум')}
                      <Typography color='dark.500' fontSize={'20px'} lineHeight={'25px'} fontWeight='500'>
                        ({withoutDivider ? count : thousandDivider(count, '')}
                        {endText})
                      </Typography>
                    </>
                  ) : withoutDivider ? (
                    Math.round(count)
                  ) : (
                    <Typography>{thousandDivider(Math.round(count), endText)}</Typography>
                  )}
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
                <Skeleton variant='rectangular' width={60} height={26} sx={{ borderRadius: '5px' }} />
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
              <Skeleton variant='text' width='70%' height={20} />
            ) : (
              <Typography color='bunker.500' fontSize={'16px'} lineHeight={'20px'} fontWeight='500' variant='h1'>
                {thousandDivider(old)} {endText} за прошедший период
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
