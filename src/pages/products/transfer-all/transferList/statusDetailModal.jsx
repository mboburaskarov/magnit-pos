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

export default function StatusDetailModal({ open, refetch, setOpen }) {
  const methods = useForm()
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
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'История действий'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box sx={{ p: '20px' }}>
        <Box
          onClick={() => setStatusModal(open)}
          id={`${'status'}-${1}`}
          whiteSpace='pre-wrap'
          sx={{
            display: 'flex',
            '& .step-title > p': {
              fontSize: '16px',
              fontWeight: '600',
              lineHeight: '24px',
              color: 'black',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

              width: '34px',
              '& .loaded-bar': {
                height: '24px',
                width: '10px',
                backgroundColor: '#ffff',
                overflow: 'hidden',
                marginY: '-2px',

                position: 'relative',
                background: `repeating-linear-gradient(
                       45deg,
                       #f0f0f0,
                       #f0f0f0 5px,
                       #e8e8e8 5px,
                       #e8e8e8 10px
                     )`,
              },
              '& .complated-bar': {
                height: '24px',
                width: '10px',
                marginY: '-2px',
                backgroundColor: '#fe5000',
                overflow: 'hidden',
                position: 'relative',
                background: `repeating-linear-gradient(
                       45deg,
                       #ff9f50,
                       #ff9f50 5px,
                       #ff6f00 5px,
                       #ff6f00 10px
                     )`,
              },
              '& .step-icon-box': {
                backgroundColor: 'orange.500',
                borderRadius: '50%',
                width: '27px',
                height: '27px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9,
              },
              '& .step-icon-box.loaded': {
                backgroundColor: 'bunker.200',
              },
            }}
          >
            <Box className={`step-icon-box complated'}`}>
              <FolderSearch />
            </Box>
            <Box className={isLoadedStage(open, 1) ? 'loaded-bar' : 'complated-bar'} />

            <Box className={`step-icon-box ${isLoadedStage(open, 1) ? 'loaded' : 'complated'}`}>
              <SentFastIcon />
            </Box>
            <Box className={isLoadedStage(open, 2) ? 'loaded-bar' : 'complated-bar'} />
            <Box className={`step-icon-box ${isLoadedStage(open, 2) ? 'loaded' : 'complated'}`}>
              <TimeQuarterIcon />
            </Box>
            <Box className={isLoadedStage(open, 3) ? 'loaded-bar' : 'complated-bar'} />
            <Box className={`step-icon-box ${isLoadedStage(open, 3) ? 'loaded' : 'complated'}`}>
              <TickIcon />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box className='step-title'>
              <Typography>Новый</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>Отправил</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>Проверка</Typography>
            </Box>
            <Box className='step-title'>
              <Typography>Завершенный</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box className='step-title'>
              <Typography>JsDev</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>{isLoadedStage(open, 1) ? '...' : 'Sunnat'}</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>{isLoadedStage(open, 2) ? '...' : 'Murtazo'}</Typography>
            </Box>
            <Box className='step-title'>
              <Typography>{isLoadedStage(open, 3) ? '...' : 'JsDev'}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box className='step-title'>
              <Typography>999</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>999</Typography>
            </Box>

            <Box className='step-title'>
              <Typography>999</Typography>
            </Box>
            <Box className='step-title'>
              <Typography>999</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledEmptyDialog>
  )
}
