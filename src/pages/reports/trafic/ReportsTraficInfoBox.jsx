import { Box, Typography } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import GrowIcon from '../../../assets/icons/GrowIcon'
import FallIcon from '../../../assets/icons/FallIcon'

export default function ReportsTraficInfoBox({ name, ind, title, icon, count, percent, endText, withoutDivider }) {
  return (
    <Box key={ind} sx={(theme) => ({ p: 2.5, boxShadow: theme.boxShadow['16-8'], borderRadius: 4, width: '100%' })}>
      <Box width='100%' justifyContent='space-between' display='inline-flex'>
        <Box>
          <Typography fontSize={16} mt={0.5}>
            {title}
          </Typography>
          <Typography color='green.600' fontSize={28} variant='h1'>
            {withoutDivider ? `${name || ' '} ${count}` : `${name || ' '} ${thousandDivider(count)}`} {endText || 'шт'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
            backgroundColor: 'green.600',
            borderRadius: 3,
            '& > svg > path': { fill: 'white' },
            '& > svg': { width: 18 },
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box mt={1.5} width='100%' justifyContent='space-between' alignItems='flex-end' display='inline-flex'>
        <Box display='inline-flex' alignItems='center'>
          <Typography fontWeight='500' mr={0.5} lineHeight={2}>
            {percent}%
          </Typography>
          {percent > 0 ? <GrowIcon /> : <FallIcon />}
        </Box>
      </Box>
    </Box>
  )
}
