import { useTheme } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'

import CloseIcon from '@icons/CloseIcon'
import { Box, Typography } from '@mui/material'
import FolderSearch from '@icons/step-progress/FolderSearch'
import SentFastIcon from '@icons/step-progress/SentFast'
import TimeQuarterIcon from '@icons/step-progress/TimeQuarter'
import TickIcon from '@icons/step-progress/Tick'
import { get } from 'lodash'
import dayjs from 'dayjs'

export default function StatusDetailModal({ open, setOpen }) {
  const theme = useTheme()

  const { t } = useTranslation()
  const isLoadedStage = (data, stage) => {
    const status = data?.status
    const stagesByStatus = {
      sent: [1],
      checking: [1, 2],
      completed: [1, 2, 3],
    }

    return !stagesByStatus[status]?.includes(stage)
  }
  return (
    <StyledEmptyDialog
      maxWidth={900}
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'История действий'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box sx={{ p: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            '& .header-cell': {
              width: '100%',
              '& p': {
                fontSize: '14px',
                fontWeight: '700',
                color: '#666',
              },
            },
          }}
        >
          <Box className='header-cell' sx={{ width: '50px !important' }}>
            <Typography>Статус</Typography>
          </Box>
          <Box className='header-cell'>
            <Typography></Typography>
          </Box>
          <Box className='header-cell'>
            <Typography>Создатель</Typography>
          </Box>
          <Box className='header-cell'>
            <Typography>Количество</Typography>
          </Box>
          <Box className='header-cell'>
            <Typography>Дата</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <Box
            onClick={() => setStatusModal(open)}
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0,
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer',
            }}
          >
            <Box sx={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  backgroundColor: 'orange.500',
                  borderRadius: '50%',
                  zIndex: 9,
                  width: '27px',
                  height: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FolderSearch />
              </Box>
            </Box>
            <Box sx={{ width: '100%', ml: '20px' }}>
              <Typography>Новый</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{get(open, 'created_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography></Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{dayjs(get(open, 'created_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '10px',
              height: '20px',
              ml: '8px',
              my: '-2px',
              background: `repeating-linear-gradient(
        45deg,
        #ff9f40,
                  #ff9f50 5px,
                  #ff7f40 5px,
                  #ff7f00 10px
      )`,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0,
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer',
            }}
          >
            <Box sx={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  backgroundColor: isLoadedStage(open, 1) ? 'bunker.200' : 'orange.500',
                  borderRadius: '50%',
                  zIndex: 9,
                  width: '27px',
                  height: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SentFastIcon />
              </Box>
            </Box>
            <Box sx={{ width: '100%', ml: '20px' }}>
              <Typography>Создано</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : get(open, 'created_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : get(open, 'expected_count')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : dayjs(get(open, 'updated_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '10px',
              height: '20px',
              ml: '8px',
              my: '-2px',
              background: isLoadedStage(open, 2)
                ? `repeating-linear-gradient(
        45deg,
        #f0f0f0,
        #f0f0f0 5px,
        #e8e8e8 5px,
        #e8e8e8 10px
      )`
                : `repeating-linear-gradient(
        45deg,
        #ff9f40,
                  #ff9f50 5px,
                  #ff7f40 5px,
                  #ff7f00 10px
      )`,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0,
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer',
            }}
          >
            <Box sx={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  backgroundColor: isLoadedStage(open, 2) ? 'bunker.200' : 'orange.500',
                  borderRadius: '50%',
                  zIndex: 9,
                  width: '27px',
                  height: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TimeQuarterIcon />
              </Box>
            </Box>
            <Box sx={{ width: '100%', ml: '20px' }}>
              <Typography>Отправил</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 2) ? '...' : get(open, 'updated_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 2) ? '...' : get(open, 'scanned_count')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 2) ? '...' : dayjs(get(open, 'accepted_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '10px',
              height: '20px',
              ml: '8px',
              my: '-2px',
              background: isLoadedStage(open, 3)
                ? `repeating-linear-gradient(
        45deg,
        #f0f0f0,
        #f0f0f0 5px,
        #e8e8e8 5px,
        #e8e8e8 10px
      )`
                : `repeating-linear-gradient(
        45deg,
        #ff9f40,
                  #ff9f50 5px,
                  #ff7f40 5px,
                  #ff7f00 10px
      )`,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0,
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer',
            }}
          >
            <Box sx={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  backgroundColor: isLoadedStage(open, 3) ? 'bunker.200' : 'orange.500',
                  borderRadius: '50%',
                  zIndex: 9,
                  width: '27px',
                  height: '27px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TickIcon />
              </Box>
            </Box>
            <Box sx={{ width: '100%', ml: '20px' }}>
              <Typography>Полученный</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 3) ? '...' : get(open, 'accepted_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 3) ? '...' : get(open, 'accepted_count')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 3) ? '...' : dayjs(get(open, 'accepted_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
