import { useTheme } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'

import CloseIcon from '@icons/CloseIcon'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { Box, Typography } from '@mui/material'
import {  useMemo } from 'react'
import { useQuery } from 'react-query'
import { requests } from '@utils/requests'
import { ProgressBar } from './TargetDrawer'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import { get } from 'lodash'

export default function TargetByEmployee({ open, setOpen }) {
  const theme = useTheme()

  const targetListFIlter = useMemo(() => {
      return {
        store_id: get(open,'store_id',undefined),
      }
    }, [open])
  
    const {
      data: targetList,
      isLoading: isTargetList,
      isFetching: isFetchingTargetList,
    } = useQuery(['targetByEmployeeList', targetListFIlter], () => requests.getTargetByEmployeeList(targetListFIlter),{enabled:!!open?.open})
  
    
  
    const columns = useMemo(
      () => [
        {
          headerName: 'Сотрудник',
          colId: 'employee_name',
          minWidth: 250,
          maxWidth: 250,
          width: 250,
        
          cellRenderer: ({ data, rowIndex }) => (
            <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap' >
              <Typography >{data?.employee_name}</Typography>
            </Box>
          ),
        },
        {
          headerName: 'Таргет',
          colId: 'target',
          minWidth: 180,
          flex: 1,
         
          cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'amount'} withDevider currency={'сум'} />,
        },
        {
          headerName: 'Продажи',
          colId: 'sales',
          minWidth: 180,
          maxWidth: 180,
          width: 180,
        
          cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'sales'} withDevider currency={'сум'} />,
        },
        {
          headerName: '',
          colId: 'progress',
          minWidth: 185,
          maxWidth: 185,
          width: 185,
          cellRenderer: ({ data, rowIndex }) => (
            <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
              <ProgressBar current={data?.sales} total={data?.amount} minWidth='140px' />
            </Box>
          ),
        },
      ],
      [],
    )
  
    const formattedData = targetList?.data?.data
  
  return (
    <StyledEmptyDialog
      maxWidth={1000}
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Цель по сотрудникам'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
       <Box sx={{ padding: '12px 20px' }}>
        <AgGridTable
          isDataLoading={isTargetList || isFetchingTargetList}
          offsetQuery='offsetTarget'
          limitQuery='limitTarget'
          uniqId='employee_id'
          id='products-target-table'
          columns={columns}
          data={formattedData}
          updaterAction={(newData) => {}}
          defaultOffsetSize={5}
          emptyTableText={{
            title: 'Нет Таргета',
            description: ' ',
          }}
        />
      </Box>
    </StyledEmptyDialog>
  )
}
