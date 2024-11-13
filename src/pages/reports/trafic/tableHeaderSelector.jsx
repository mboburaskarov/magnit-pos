import { memo } from 'react'
import { Typography } from '@mui/material'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'

export default function tableHeaderSelector() {
  const columns = [
    {
      width: 300,
      minWidth: 300,
      headerName: 'Имя рекламодателя',
      colId: 'advertiser',
      cellRenderer: memo(({ data, rowIndex }) => (
        <Typography id={`report-trafic-name-${rowIndex}`} sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>
          {data?.referal || 'Неопределенный'}
        </Typography>
      )),
    },
    {
      width: 300,
      minWidth: 300,
      headerName: 'Приложение',
      colId: 'app',
      cellRenderer: memo(({ data, rowIndex }) => (
        <Typography id={`report-trafic-app-${rowIndex}`} sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>
          {data?.app || 'Неопределенный'}
        </Typography>
      )),
    },
    {
      width: 240,
      minWidth: 240,
      headerName: 'Количество нажатий',
      colId: 'quantity_of_click',
      cellRenderer: memo(({ data, rowIndex }) => (
        <Typography id={`report-trafic-count-${rowIndex}`} sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>
          {data?.totalCount || 'Неопределенный'}
        </Typography>
      )),
    },
    {
      width: 240,
      minWidth: 240,
      colId: 'created',
      headerName: 'Дата создания',
      cellRenderer: memo(({ data, rowIndex }) => <TimeCell rowIndex={rowIndex} data={data} type='firstCreatedAt' format='DD.MM.YYYY HH:mm' />),
    },
    {
      width: 240,
      minWidth: 240,
      colId: 'last',
      headerName: 'Дата последнего действия',
      cellRenderer: memo(({ data, rowIndex }) => <TimeCell rowIndex={rowIndex} data={data} type='lastCreatedAt' format='DD.MM.YYYY HH:mm' />),
    },
  ]

  return columns
}
