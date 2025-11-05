import { Box, Typography } from '@mui/material'
import BrandCardIcon from '@icons/BrandCardIcon'
import thousandDivider from '@utils/thousandDivider'
import { get } from 'lodash'

function DiscountCard({ data }) {
  return (
    <Box
      sx={{
        padding: '20px',
        height: '160px',
        borderRadius: '16px',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(147.13deg, #ff974c 3.88%, #ff5900 73.63%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '500', color: 'bunker.100' }}>Дисконтная карта</Typography>
        <Typography sx={{ fontSize: '28px', lineHeight: '40px', fontWeight: '700', color: 'white' }}>
          {thousandDivider(get(data, 'discount_percent', '0'), '%')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '500', color: 'bunker.100' }}>
          {get(data, 'discount_card')?.replace(/.(?=.{4})/g, '*')}{' '}
        </Typography>
        <Box width={'115px'}>
          <BrandCardIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default DiscountCard
