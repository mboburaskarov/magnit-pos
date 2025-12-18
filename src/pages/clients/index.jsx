import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/clientTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import ClientCreateMini from '@components/Sales/ClientCreateMini/index'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import LoadingContainer from '@components/LoadingContainer'
import InputSearch from '@components/Inputs/InputSearch'
import { Box, Button, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmDialog from '@components/ConfirmDialog'
import { useEffect, useMemo, useState } from 'react'
import ImageGallery from '@components/ImageGallery'
import { useMutation, useQuery } from 'react-query'
import BigWarningIcon from '@icons/BigWarningIcon'
import CheckAccess from '@components/CheckAccess'
import { useTranslation } from 'react-i18next'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import DeleteIcon from '@icons/DeleteIcon'
import { requests } from '@utils/requests'
import { LoadingButton } from '@mui/lab'
import PlusIcon from '@icons/PlusIcon'
import { get } from 'lodash'

import tableHeaderSelector from './tableHeaderSelector'

export default function ClientsPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.clientTableColumns)
  const { values } = useQueryParams()
  const [openClientCreateMini, setOpenClientCreateMini] = useState(false)

  const [selectClients, setselectClients] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const selectClientsFunc = (isChecked, id) => {
    if (isChecked) {
      setselectClients((p) => [...p, id])
    } else {
      setselectClients((p) => p.filter((ids) => ids !== id))
    }
  }
  const tableColumns = tableHeaderSelector({
    clientsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenClientCreateMini,
    setOpenConfirmDialog,
    selectClientsFunc,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const clientsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.store_id])
  const {
    data: clientsList,
    isLoading: clientsListLoading,
    isFetching: isFetchingclientsList,
    refetch,
  } = useQuery(['clientsList', clientsListFilter], () => requests.getAllCustomers(clientsListFilter))

  const { mutate: deleteClient, isLoading: isDeletingProduct } = useMutation(requests.deleteClient, {
    onSuccess: () => {
      refetch()
      success('Kлиент успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении клиент!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [clientsListFilter])

  useEffect(() => {
    const count = clientsList?.data?.data?._meta?.total_count
    setselectClients([])
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [clientsList?.data, values?.limit])

  const { mutate: clientsExcelReport, isLoading: isclientsExcelReport } = useMutation(requests.getClientsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('clients')}
        </Typography>

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'ID, Имя, Телефон'} uncontrolled />
            </Box>
            <CheckAccess id={'client:delete'}>
              {selectClients.length > 0 && (
                <>
                  <Box minWidth={48} ml={'16px'}>
                    <Button
                      sx={{
                        height: '48px',
                        padding: 0,
                        bgcolor: '#fff',
                        border: '1px solid #ECEDF2',
                        color: 'dark.500',
                        fontWeight: '500',
                        fontSize: '16px',
                        lineHeight: '24px',
                        '& span': {
                          mr: '12px',
                        },
                      }}
                      fullWidth
                      variant='contained'
                      color='secondary'
                      onClick={() => deleteClient({ data: selectClients })}
                    >
                      <DeleteIcon width='24px' />
                    </Button>
                  </Box>
                </>
              )}
            </CheckAccess>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            <CheckAccess id={'client:create'}>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  onClick={() => setOpenClientCreateMini(true)}
                  fullWidth
                  startIcon={<PlusIcon color='#fff' />}
                  variant='contained'
                  color='primary'
                >
                  {t('button.add_new.text')}
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='clients-main-table'
            tableSettings
            fullDownload={() => clientsExcelReport({ ...clientsListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => clientsExcelReport(clientsListFilter)}
            isDownloading={isclientsExcelReport}
            columns={tableColumns}
            totalCount={clientsList?.data?.data?._meta?.total_count || 0}
            data={clientsList?.data?.data?.data || []}
            isDataLoading={isFetchingclientsList || clientsListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Клиент не существует',
              description: 'Если вы не нашли искомого Клиента, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingclientsList || clientsListLoading}
          />
        </Box>
      </Box>
      <ClientCreateMini
        setCustomerId={() => {
          refetch()
        }}
        quickCreateClientName={''}
        setOpenDrawer={setOpenClientCreateMini}
        openDrawer={openClientCreateMini}
        closeDrawer={() => setOpenClientCreateMini(false)}
        clientData={openClientCreateMini}
        afterCreate={(clientId) => {}}
      />
      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить клиента?'}
          desc={'Хотите ли вы удалить клиента?'}
          supDesc={'“Azitromitsin 250 mg”'}
          actions={
            <>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => setOpenConfirmDialog(null)}
              >
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteClient({ data: [openConfirmDialog.id] })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
