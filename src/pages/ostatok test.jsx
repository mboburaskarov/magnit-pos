import { Box, CircularProgress, Typography } from '@mui/material'
import { useMutation, useQuery } from 'react-query'

import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { get } from 'lodash'

function Test() {
  const [finishedMinusIds, setFinishedMinusIds] = useState([])
  const [finishedPlusIds, setFinishedPlusIds] = useState([])
  const { data: OstotokList, refetch } = useQuery('ostatok-fixed-stores', requests.getFixedSoresList)
  const { mutate: fixMinusErrors, isLoading: isFixingMinusErrors } = useMutation(requests.fixdMinusErrors, {
    onSuccess: ({ data }) => {
      refetch()
      success('tayyor minuslar')
    },
    onError: (err) => {
      error('Ошибка!')
      console.error('err', err)
    },
  })
  const { mutate: fixPlusErrors, isLoading: isFixingPlusErrors } = useMutation(requests.fixdPlusErrors, {
    onSuccess: ({ data }) => {
      refetch()
      success('tayyor pluslar')
    },
    onError: (err) => {
      error('Ошибка!')
      console.error('err', err)
    },
  })
  const { mutate: getProductMovementDashboardExcel, isLoading: isGetProductMovementDashboardExcel } = useMutation(requests.getOstatokExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch()
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <Box>
      {OstotokList?.data?.data.map((store, index) => (
        <Box key={store.id} sx={{ display: 'flex', width: '700px', margin: '10px auto', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{ fontSize: '14px', textDecoration: finishedMinusIds.includes(store.id) && finishedPlusIds.includes(store.id) ? 'line-through' : 'none' }}
          >
            {index + 1} | {store.name} ({store.has_inventor ? 'Inventory' : ''})
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton
              onClick={() => {
                fixPlusErrors({ store_id: store.id })
              }}
              disabled={store.fixed_stage == 1 || store.fixed_stage == 2}
              loading={isFixingPlusErrors}
              sx={{ height: '20px', bgcolor: '#FF6018', color: 'white', mr: '10px' }}
            >
              Plus
            </LoadingButton>
            <LoadingButton
              onClick={() => {
                fixMinusErrors({ store_id: store.id })
              }}
              disabled={store.fixed_stage == 2}
              loading={isFixingMinusErrors}
              sx={{ height: '20px', bgcolor: '#FF6018', color: 'white' }}
            >
              Minus
            </LoadingButton>
            <Box
              sx={{
                ml: '10px',
                backgroundColor: 'bg.10',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                width: '38px',
                cursor: 'pointer',
                height: '38px',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': {
                  width: '18px',
                  height: '18px',
                },
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
              }}
              onClick={() => {
                getProductMovementDashboardExcel({ store_id: store.id, limit: 10000, offset: 0 })
              }}
            >
              {isGetProductMovementDashboardExcel ? <CircularProgress size={18} thickness={5} /> : <Download sx={{ color: '#FF6018' }} />}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Test
