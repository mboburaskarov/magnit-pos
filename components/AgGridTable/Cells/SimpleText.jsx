import { Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'

export const SimpleText = ({ data, toFixed2 = false, customText = false, rowIndex, type, withDevider, currency, onClick = () => {}, sx = {} }) => {
  return (
    <Typography onClick={onClick} sx={{ whiteSpace: 'pre-line', color: !data?.[type] && !customText && 'gray.400', ...sx }} id={`product-${type}-${rowIndex}`}>
      {customText ? customText : withDevider ? thousandDivider(data?.[type], currency, toFixed2) : data?.[type] || '-'}
    </Typography>
  )
}
