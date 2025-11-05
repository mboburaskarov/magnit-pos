import { Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'

export const SimpleText = ({ data, customText = false, rowIndex, type, withDevider, currency, onClick = () => {} }) => {
  return (
    <Typography onClick={onClick} sx={{ whiteSpace: 'pre-line', color: !data?.[type] && !customText && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {customText ? customText : withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
