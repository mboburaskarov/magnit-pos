import { Box, Grid, Typography } from '@mui/material'
import { get } from 'lodash'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'

function InventoryDashboard({ data: stats, setHasChange }) {
  const { id } = useParams()

  const { mutate: getInventoryExcelReport, isLoading: isgetInventoryExcelReport } = useMutation(requests.getInventoryExcelReport, {
    onSuccess: ({ data }) => {
      setHasChange(false)

      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      setHasChange(false)

      error('Ошибка при скачать excel!')
    },
  })

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Програм Cумма', value: 'total_data.total_current_sum' },
        { title: 'Факт Cумма', value: 'total_data.total_fact_sum' },
        { title: 'Разница сумма', value: 'total_data.total_difference_sum' },
      ].map((stat) => (
        <Grid sm='4' lg='4' md='4' item sx={{}}>
          <Box
            sx={{
              backgroundColor: stat.title == 'result' ? 'bg.10' : 'bg.10',
              borderRadius: '24px',
              padding: '20px',
              minHeight: '110px',
            }}
          >
            <>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {stat.title}
              </Typography>
              <Typography
                sx={{
                  mt: '5px',
                  color: 'bunker.500',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    width: '25px',
                    mr: '10px',
                  },
                }}
              >
                {stats?.[stat.value] < 0 && <BigWarningIcon />}
                {thousandDivider(get(stats, stat.value), 'сум')}
              </Typography>
            </>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default InventoryDashboard
