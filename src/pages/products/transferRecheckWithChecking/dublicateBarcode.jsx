import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function DublicateProductBarcode({ open, refetch, setOpen }) {
  const { id } = useParams()

  const { mutate: updateByBarcode, isLoading: isSetScannedNumber } = useMutation(requests.updateTransferByBarcode, {
    onSuccess: ({ data }) => {
      refetch()
      setOpen(false)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при сканирование!')
    },
  })
  const theme = useTheme()
  console.log(open)

  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Выберите нужный вам товар.'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        {get(open, 'data', [])?.map((item) => (
          <Box>
            <Typography
              sx={{
                padding: '20px 30px',
                backgroundColor: 'bg.10',
                m: '15px 0px',
                borderRadius: '20px',
              }}
              onClick={() => {
                updateByBarcode({
                  transferId: id,
                  id: get(item, 'id'),
                  status: 'checking',
                  type: 'MANUAL',
                })
              }}
            >
              {get(item, 'name')}
            </Typography>
          </Box>
        ))}
      </Box>
    </StyledEmptyDialog>
  )
}
