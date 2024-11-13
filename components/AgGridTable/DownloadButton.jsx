import { Box } from '@mui/material'
import DownloadIcon from '../../src/assets/icons/DownloadIcon'
import { LoadingButton } from '@mui/lab'

const DownloadButton = ({ isDownloading, download }) => {
  return (
    <Box minWidth={148} mr={2}>
      <LoadingButton
        sx={(theme) => ({ background: theme.palette.background.default })}
        variant='outlined'
        size='small'
        id='download-button'
        startIcon={<DownloadIcon />}
        fullWidth
        loading={isDownloading}
        onClick={download}
      >
        Скачать
      </LoadingButton>
    </Box>
  )
}

export default DownloadButton
