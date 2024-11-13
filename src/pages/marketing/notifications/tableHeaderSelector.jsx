import Highlighter from 'react-highlight-words'
import TruncatedText from '../../../../components/TruncatedText'
import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import dayjs from 'dayjs'
import ImageCell from '../../../../components/AgGridTable/Cells/ImageCell'

export default function tableHeaderSelector({ orderColumns, searchTerm, setImages }) {
  const columns = orderColumns?.map((el) => {
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo(({ data }) => <ImageCell imageArr={[data?.imageRu]} setImages={setImages} />),
      }
    }
    if (el.field === 'title') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.headerRu ? data?.headerRu : 'Нет'}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'body') {
      return {
        ...el,
        headerName: 'Сообщение',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.summaryRu ? data?.summaryRu : 'Нет'}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'date') {
      return {
        ...el,
        headerName: 'Дата',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.createdAt ? dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') : 'Нет'}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'succesCount') {
      return {
        ...el,
        headerName: 'Кол-во доставленных',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.successCount ? data?.successCount : '0'}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'failureCount') {
      return {
        ...el,
        headerName: 'Кол-во недоставленных',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.failureCount ? data?.failureCount : '0'}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'userType') {
      return {
        ...el,
        headerName: 'Тип пользователей',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            padding={1}
            bgcolor={data?.userType === 'USER' ? 'green.400' : 'yellow.400'}
            borderRadius={3}
            color='#fff'
          >
            {data?.userType === 'USER' ? 'Зарегистрирован' : 'Незарегистрирован'}
          </Box>
        )),
      }
    }
  })

  return columns
}
