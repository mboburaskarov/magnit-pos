import { Box } from '@mui/material'
import GiftCardIcon from '../src/assets/icons/BagOutline'
import VoucherIcon from '../src/assets/icons/BagOutline'

const GiftCardBadge = ({ size = 32, voucher }) => {
  return (
    <Box
      sx={() => ({
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBEAFE',
        borderRadius: 2,
        marginLeft: 1,
      })}
    >
      {voucher ? <VoucherIcon /> : <GiftCardIcon />}
    </Box>
  )
}

export default GiftCardBadge
