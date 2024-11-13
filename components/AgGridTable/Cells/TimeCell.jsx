import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'

const TimeCell = ({ data, rowIndex, nullText, type, format = 'DD.MM.YYYY', color }) => {
  return (
    <Box id={`${type}-${rowIndex}`} whiteSpace='pre-wrap'>
      <Typography color={color}>{nullText && !data?.[type] ? nullText : data?.[type] ? dayjs(data?.[type]).format(format) : '-'}</Typography>
    </Box>
  )
}

export default TimeCell
