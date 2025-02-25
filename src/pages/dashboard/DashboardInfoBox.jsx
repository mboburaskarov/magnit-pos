import { Box, Divider, Typography } from '@mui/material'
import thousandDivider from '../../../utils/thousandDivider'
import GrowIcon from '../../assets/icons/GrowIcon'
import FallIcon from '../../assets/icons/FallIcon'
import { theme } from '../../assets/theme'

export default function DashboardInfoBox({ noDot, ind, title, icon, count, percent, endText, withoutDivider }) {
  const isFall = percent < 0
  return (
    <Box sx={(theme) => ({ border: 1, borderRadius: '24px', borderColor: '#A4A5AB33', minHeight: '154px', width: '100%' })}>
      <Box key={ind} sx={(theme) => ({ pr: '14px', pl: '16px', pt: '16px', pb: '10px', m: 0 })}>
        <Box width='100%' alignItems={'center'} display='inline-flex'>
          {!noDot && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: icon ? 40 : 24,
                minWidth: icon ? 40 : 24,
                minHeight: icon ? 40 : 24,
                height: icon ? 40 : 24,
                backgroundColor: 'orange.100',
                borderRadius: icon ? 3 : 6,
                '& > svg > path': { stroke: '#FE5000' },
                '& > svg > circle': { stroke: '#FE5000' },
                '& > svg': { width: 18 },
              }}
            >
              {icon}
            </Box>
          )}
          <Box ml={'10px'}>
            <Typography fontSize={18} fontWeight={'500'} lineHeight={'24px'} color={'dark.500'} mt={0.5}>
              {title}
            </Typography>
          </Box>
        </Box>

        {!!percent && (
          <Box mt={icon ? '10px' : 0} width='100%' justifyContent='space-between' alignItems='center' display='inline-flex'>
            <Box>
              <Typography color='dark.500' fontSize={'32px'} lineHeight={'40px'} fontWeight='600' variant='h1'>
                {withoutDivider ? count : thousandDivider(count, endText)}
              </Typography>
            </Box>
            <Box
              display='inline-flex'
              sx={{
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                padding: '5px',
                backgroundColor: !isFall ? '#30BE821A' : '#F45B691A',
              }}
              alignItems='center'
            >
              {!isFall ? <GrowIcon /> : <FallIcon />}{' '}
              <Typography color={isFall ? '#F45B69' : '#30BE82'} fontWeight='500' mr={0.5} fontSize={14} lineHeight={'18px'}>
                {percent}%
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box key={ind} sx={(theme) => ({ pt: '10px', pb: '8px', px: '16px', m: 0, borderTop: 1, borderColor: '#A4A5AB33' })}>
        <Box>
          <Typography color='gray.500' fontSize={'16px'} lineHeight={'20px'} fontWeight='500' variant='h1'>
            Update: September 17, 2023
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
