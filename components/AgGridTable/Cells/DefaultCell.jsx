import { Box } from '@mui/material'
import thousandDivider from 'utils/thousandDivider'

const DefaultCell = ({ data, rowIndex, type, percentage = false, currency = false, number = false, unit = false }) => {
  return (
    <Box
      style={{
        wordBreak: !number && 'break-all',
        whiteSpace: !number && 'break-spaces',
      }}
    >
      <Box id={`${type}-${rowIndex}`}>
        {(!currency && data?.[type]?.name) ?? data?.[type]} {percentage && '%'}
        {unit && 'units'}
        {currency ? `${thousandDivider(data?.[type], 2, currency)} ${currency}` : ''}
      </Box>
    </Box>
  )
}

export default DefaultCell
