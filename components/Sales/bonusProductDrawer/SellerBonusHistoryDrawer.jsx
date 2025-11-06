import { downloadLinkExcel } from '@utils/downloadLinkEXCEL';
import { Box, Drawer, Typography } from '@mui/material';
import { useQueryParams } from '@hooks/useQueryParams';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { makeStyles, useTheme } from '@mui/styles';
import { requests } from '@utils/requests';
import CloseIcon from '@icons/CloseIcon';
import { error } from '@utils/toast';
import { get } from 'lodash';
import dayjs from 'dayjs';

import AgGridTable from '../../AgGridTable/AgGridTable';
import DraftChildDrawer from './DraftChildDrawer';


const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      overflow: 'hidden',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '40px 40px 24px 40px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))

const columns = [
  {
    autoHeight: true,
    field: 'sale_number',
    minWidth: 60,
    width: 120,
    headerName: 'ID продажи',
    colId: 'sale_number',
    label: 'ID',
    name: 'sale_number',
  },
  {
    autoHeight: true,
    field: 'product_name',
    minWidth: 300,
    headerName: 'Название продукта',
    colId: 'product_name',
    label: 'Название продукта',
    name: 'product_name',
  },
  {
    autoHeight: true,
    field: 'quantity',
    minWidth: 60,
    width: 120,
    headerName: 'Кол-во',
    colId: 'quantity',
    label: 'Кол-во',
    name: 'quantity',
  },
  {
    autoHeight: true,
    field: 'bonus_amount',
    minWidth: 60,
    width: 120,
    headerName: 'Сумма бонуса',
    colId: 'bonus_amount',
    label: 'Сумма бонуса',
    name: 'bonus_amount',
  },
]

function SellerBonusHistoryDrawer({ open, setOpen }) {
  const classes = useStyles()
  const theme = useTheme()
  const { values } = useQueryParams()

  const [offsetCount, setOffsetCount] = useState(0)
  const [isOpenChild, setIsOpenChild] = useState(false)
  const [controlleroffset, setControllerOffset] = useState(0)

  useEffect(() => {}, [open])

  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])

  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])

  const sellerBonusHistoryFilters = useMemo(() => {
    const ready_start_date = dayjs(values?.start_date)
    const ready_end_date = dayjs(values?.end_date)
    return {
      search: values?.search || null,
      limit: values?.bonusLimit,
      employee_id: open?.id,
      offset: values?.bonusOffset,
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
    }
  }, [values?.bonusLimit, controlleroffset, open, values?.limit, values?.bonusOffset, values?.end_date, values?.start_date])

  const {
    data: sellerBonusHistory,
    isLoading: sellerBonusHistoryLoading,
    isFetching: isFetchingSellerBonusHistory,
    refetch,
  } = useQuery(['sellerBonusHistory', sellerBonusHistoryFilters], () => requests.getSellerBonusHistoryData(sellerBonusHistoryFilters))

  const { mutate: bonusHistoryExcelReport, isLoading: isBonusHistoryExcelReport } = useMutation(requests.getSellerBonusHistoryDataExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)
      error('Ошибка при скачать excel!')
    },
  })

  useEffect(() => {
    refetch()
  }, [sellerBonusHistoryFilters])

  useEffect(() => {
    const count = sellerBonusHistory?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [sellerBonusHistory?.data, values?.limit])

  return (
    <Drawer open={!!open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              История бонусов
            </Typography>
            <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
          </Box>

          <Box pt={5} pb={0} px={'40px'} maxHeight={'calc(100vh-400px)'}>
            <AgGridTable
              id='bonus-history'
              alwaysShowHorizontalScroll={true}
              tableSettings={false}
              canCellClick={true}
              enableFillHandle={true}
              limitQuery='bonusLimit'
              offsetQuery='bonusOffset'
              fullDownload={() => bonusHistoryExcelReport({ ...sellerBonusHistoryFilters, offset: 0, limit: 1000000 })}
              downloadByFilter={() => bonusHistoryExcelReport({ ...sellerBonusHistoryFilters, offset: 0, limit: 1000000 })}
              isDownloading={isBonusHistoryExcelReport}
              columns={columns}
              data={sellerBonusHistory?.data?.data?.data || []}
              totalCount={sellerBonusHistory?.data?.data?._meta?.total_count || 0}
              isDataLoading={sellerBonusHistoryLoading || isFetchingSellerBonusHistory}
              offsetCount={offsetCount}
              isRefreshing={sellerBonusHistoryLoading || isFetchingSellerBonusHistory}
              limit={20}
            />
          </Box>
        </Box>
      ) : (
        <DraftChildDrawer setChildOpen={setIsOpenChild} open={isOpenChild} setOpen={setOpen} />
      )}
    </Drawer>
  )
}

export default SellerBonusHistoryDrawer
