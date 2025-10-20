import { useTheme } from '@mui/styles'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'

import CloseIcon from '../../../../assets/icons/CloseIcon'
import { Box, Typography } from '@mui/material'
import FolderSearch from '../../../../assets/icons/step-progress/FolderSearch'
import SentFastIcon from '../../../../assets/icons/step-progress/SentFast'
import TimeQuarterIcon from '../../../../assets/icons/step-progress/TimeQuarter'
import TickIcon from '../../../../assets/icons/step-progress/Tick'
import { get } from 'lodash'
import dayjs from 'dayjs'

export default function StatusDetailModal({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  console.log(open)

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
        {/* Table Header */}
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

        {/* Table Rows */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Row 1 - Новый */}
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
              <Typography>999</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{dayjs(get(open, 'created_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>

          {/* Connector Line */}
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

          {/* Row 2 - Отправил */}
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
              <Typography>Отправил</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : get(open, 'updated_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : '999'}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 1) ? '...' : dayjs(get(open, 'updated_at')).format('DD.MM.YYYY HH:mm')}</Typography>
            </Box>
          </Box>

          {/* Connector Line */}
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

          {/* Row 4 - Завершенный */}
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
              <Typography>Завершенный</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 3) ? '...' : get(open, 'accepted_by.full_name')}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography>{isLoadedStage(open, 3) ? '...' : '999'}</Typography>
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
