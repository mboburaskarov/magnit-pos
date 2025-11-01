import { Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'

export const SimpleText = ({ data, customText = false, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{
        whiteSpace: 'pre-line',
        color: !data?.[type] && !customText && 'gray.400',
        textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through',
      }}
      id={`product-${type}-${rowIndex}`}
    >
      {customText ? customText : typeof data?.[type] != 'undefined' ? (withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-') : ''}
    </Typography>
  )
}
