import { Box, Button, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { memo, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import ConfirmDialog from '@components/ConfirmDialog'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputQuantity from '@components/Inputs/InputQuantity'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigWarningIcon from '@icons/BigWarningIcon'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@/hooks/useQueryParams'
import CheckAccess from '@components/CheckAccess'
import EditIcon from '@/assets/icons/EditIcon'
import { get } from 'lodash'
import { Trash2 } from 'lucide-react'

export default function AddNewBarcodeToProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [selectedBarcode, setSelectedBarcode] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const { t } = useTranslation()

  const { mutate: createProductBarcode, isLoading } = useMutation(requests.createProductBarcode, {
    onSuccess: () => {
      refetchProductBarcodes()
      resetToCreateMode()
      success('Штрих-код успешно добавлен!')
    },
    onError: (err) => {
      error('Ошибка при добавлении штрих-кода')
      console.error('err', err)
    },
  })

  const { mutate: updateProductBarcode, isLoading: isUpdatingProductBarcode } = useMutation(requests.updateProductBarcode, {
    onSuccess: () => {
      refetchProductBarcodes()
      resetToCreateMode()
      success('Штрих-код успешно обновлен!')
    },
    onError: (err) => {
      error('Ошибка при обновлении штрих-кода')
      console.error('err', err)
    },
  })

  const { mutate: deleteProductBarcode, isLoading: isDeletingProductBarcode } = useMutation(requests.deleteProductBarcode, {
    onSuccess: () => {
      refetchProductBarcodes()
      resetToCreateMode()
      setOpenConfirmDialog(null)
      success('Штрих-код успешно удален!')
    },
    onError: (err) => {
      setOpenConfirmDialog(null)
      error('Ошибка при удалении штрих-кода')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      ...data,
      id: selectedBarcode?.id,
    }

    if (selectedBarcode?.id) {
      updateProductBarcode({ productId: open?.id, id: selectedBarcode?.id,...requestBody })
      return
    }

    createProductBarcode({ data: requestBody, id: open?.id })
  }

  const onError = (err) => {
    console.error('err', err)
  }

  const resetToCreateMode = () => {
    methods.reset({
      barcode: '',
      mxik: '',
      unit_code: '',
    })
    setSelectedBarcode(null)
  }

  useEffect(() => {
    resetToCreateMode()
    setOpenConfirmDialog(null)
  }, [open])

  const productBarcodeFilter = useMemo(
    () => ({
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
    }),
    [values?.limitHistory, values?.offsetHistory]
  )

  const {
    data: getProductBarcodes,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchinggetProductBarcodes,
    refetch: refetchProductBarcodes,
  } = useQuery(['getProductBarcodes', open?.id, productBarcodeFilter], () => requests.getProductBarcodes({ id: open?.id, ...productBarcodeFilter }), {
    enabled: Boolean(open),
  })

  const columns = useMemo(
    () => [
      {
        headerName: '№',
        colId: 'number',
        minWidth: 60,
        width: 60,
        cellRenderer: memo(({ rowIndex}) => {
          const absoluteIndex = Number(get(values, 'offsetHistory', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} textAlign={'start'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      },
      {
        headerName: 'Штрих-код',
        colId: 'barcode',
        minWidth: 225,
        maxWidth: 225,
        width: 225,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.barcode}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'MXIK',
        colId: 'mxik',
        flex:1,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.mxik}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Kод yпаковки',
        colId: 'unit_code',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.unit_code}</Typography>
          </Box>
        ),
      },
      {
        headerName: t('table_columns.actions'),
        colId: 'action',
        minWidth: 120,
        maxWidth: 120,
        width: 120,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <CheckAccess id={'edit-product'}>
              <IconButton
                onClick={() => {
                  setSelectedBarcode(data)
                  methods.reset({
                    barcode: data?.barcode || '',
                    mxik: data?.mxik || '',
                    unit_code: data?.unit_code || '',
                  })
                }}
                sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
              >
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'delete-product'}>
              <IconButton
                onClick={() =>
                  setOpenConfirmDialog({
                    type: 'delete',
                    id: data?.id,
                    name: data?.barcode,
                  })
                }
                sx={{ width: 32, ml: '10px', height: 32, borderRadius: 3, p: '8px' }}
              >
                <Trash2 />
              </IconButton>
            </CheckAccess>
          </Box>
        ),
      },
    ],
    [methods, open?.id, t, values?.offsetHistory],
  )
  useEffect(() => {
    const count = getProductBarcodes?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 5))
    setOffsetCount(offsetsCount || 0)
  }, [getProductBarcodes?.data, values?.limitHistory])

  const formattedData = getProductBarcodes?.data?.data?.data

  return (
    <>
      <StyledEmptyDialog
        onClose={() => {
          refetch()
          setOpen(false)
        }}
        open={open}
        maxWidth={'880px'}
        title={'Добавить новый штрих-код'}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
      >
        <Box
          sx={{
            width: '100%',
            padding: '0 24px 24px',
            '& .MuiInputBase-root': {
              border: `2px solid`,
              borderColor: 'bunker.100',
              height: '48px',
            },
          }}
        >
          <FormProvider {...methods}>
            <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <Box padding={'0 2px'} width={'100%'} overflow={'scroll'}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center', my: '30px' }}>{open?.name}</Typography>
                <Box display='flex' alignItems='end' justifyContent='center' gap={2}>
                  <InputQuantity label={'Штрих-код'} id={`barcode`} name={`barcode`} fullWidth required type='number' disabled={false} />
                  <InputQuantity label={'MXIK'} id={`mxik`} name={`mxik`} fullWidth required type='number' disabled={false} />
                  <InputQuantity label={'Kод yпаковки'} id={`unit_code`} name={`unit_code`} fullWidth required type='number' disabled={false} />
                  <LoadingButton loading={selectedBarcode ? isUpdatingProductBarcode : isLoading} sx={{ width: 200, height: 48, p: '8px' }} variant='contained' type='submit'>
                    {selectedBarcode ? 'Редактировать' : 'Добавить'}
                  </LoadingButton>
                  {selectedBarcode ? (
                    <IconButton
                      onClick={resetToCreateMode}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: 'transparent',
                        mb: '4px',
                      }}
                    >
                      <CloseIcon color={theme.palette.black} />
                    </IconButton>
                  ) : null}
                </Box>
                <Box height={'20px'} />
                <Box maxHeight={'calc(100vh - 380px)'} width={'100%'} overflow={'scroll'}>
                  <AgGridTable
                    isDataLoading={isproductDataLoadingHistory || isFetchinggetProductBarcodes || isDeletingProductBarcode || isUpdatingProductBarcode}
                    offsetQuery='offsetHistory'
                    emptyTableText={{
                      title: 'Нет добавленных штрих-кодов',
                      description: 'Если вы не можете найти искомый штрих-код, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                    }}
                    limitQuery='limitHistory'
                    id='products-history-table'
                    totalCount={getProductBarcodes?.data?.data?._meta?.total_count || 0}
                    columns={columns}
                    data={formattedData}
                    offsetCount={offsetCount}
                    defaultOffsetSize={5}
                  />
                </Box>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </StyledEmptyDialog>
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить штрих-код?'}
          desc={'Вы действительно хотите удалить этот штрих-код?'}
          supDesc={openConfirmDialog?.name}
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
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingProductBarcode}
                onClick={() =>
                  deleteProductBarcode({
                    id: open?.id,
                    data: { data: { id: openConfirmDialog?.id } },
                  })
                }
              >
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </>
  )
}
