import { Box, Grid, Typography } from '@mui/material'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import thousandDivider from '../../../../../utils/thousandDivider'
import { error } from '../../../../../utils/toast'
import BigWarningIcon from '../../../../assets/icons/BigWarningIcon'
import DownloadIcon from '../../../../assets/icons/DownloadIcon'

function InventoryDashboard({ data: stats, setHasChange }) {
  const { id } = useParams()

  const { mutate: getInventoryExcelReport, isLoading: isgetInventoryExcelReport } = useMutation(requests.getInventoryExcelReport, {
    onSuccess: ({ data }) => {
      setHasChange(false)

      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      setHasChange(false)

      console.log(err)

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
        { title: 'Недостачи по цене поставки', value: 'shortage_supply_sum' },
        { title: 'Недостачи по цене продажи', value: 'shortage_retail_sum' },
        { title: 'Излишки по цене поставки', value: 'surplus_supply_sum' },
        { title: 'Излишки по цене продажи', value: 'shortage_supply_sum' },
        { title: 'result' },
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
            {stat.title == 'result' ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '70px',
                  position: 'relative',
                  '& svg': {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    height: '20px',
                    width: '20px',
                  },
                }}
                onClick={() => {
                  setHasChange(true)
                  getInventoryExcelReport({ inventory_id: id, limit: 1000000 })
                }}
              >
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: '20px',
                  }}
                >
                  Загрузить Excel
                </Typography>
                <DownloadIcon />
              </Box>
            ) : (
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
                  {thousandDivider(stats?.[stat.value], 'сум')}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default InventoryDashboard
