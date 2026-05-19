import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { zeroToOne } from '@utils/zeroToOne'
import Pagination from './Pagination'
import RowFilterButton from './RowFilterButton'

function AgGridBottom({
  controlledOffsetCount,
  changeOffset,
  offsetIndex,
  offsetQuery,
  setOffsetIndex,
  offsetSize,
  totalCount,
  setOffsetSize,
  eventMessages,
}) {
  const { t } = useTranslation()

  const start = zeroToOne(offsetIndex) * offsetSize - offsetSize + 1
  const end = Math.min(zeroToOne(offsetIndex) * offsetSize, totalCount || 0)

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        px: 3,
        py: 2,
      }}
    >
      <Box width={'100%'} display='flex' justifyContent={'space-between'} alignItems='center'>
        {/* Left side: RowFilterButton & Showed info */}
        <Box display='flex' alignItems='center' gap='24px'>
          <RowFilterButton
            totalCount={totalCount}
            offsetIndex={offsetIndex}
            offsetQuery={offsetQuery}
            offsetSize={offsetSize}
            setOffsetSize={setOffsetSize}
            setOffsetIndex={setOffsetIndex}
            eventMessage={eventMessages?.changeOffsetSize}
          />

          <Typography
            sx={{
              fontSize: '14px',
              color: '#9CA3AF',
              fontWeight: '500',
              fontFamily: 'Gilroy, sans-serif',
              userSelect: 'none',
            }}
          >
            {t('ag_grid.bottom.info', {
              from: totalCount || 0,
              start: totalCount ? Math.max(1, start) : 0,
              end: totalCount ? end : 0,
            })}
          </Typography>
        </Box>

        {/* Right side: Custom pagination */}
        <Pagination count={controlledOffsetCount} handleChangeOffset={changeOffset} offset={offsetIndex} offsetQuery={offsetQuery} />
      </Box>
    </Box>
  )
}

export default memo(AgGridBottom)
