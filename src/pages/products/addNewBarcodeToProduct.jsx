import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { memo, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputQuantity from '@components/Inputs/InputQuantity'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@/hooks/useQueryParams'
import CheckAccess from '@components/CheckAccess'
import EditIcon from '@/assets/icons/EditIcon'
import { get } from 'lodash'
import { DeleteIcon } from 'lucide-react'

export default function AddNewBarcodeToProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const { t } = useTranslation()

  const { mutate: createProductBarcode, isLoading } = useMutation(requests.createProductBarcode, {
    onSuccess: () => {
      refetchProductBarcodes()
      success('Продукт успешно добавлен!')
    },
    onError: (err) => {
      error('Ошибка при добавлении продукта')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      ...data,
    }
    createProductBarcode(requestBody)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  const {
    data: getProductBarcodes,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchinggetProductBarcodes,
    refetch: refetchProductBarcodes,
  } = useQuery(['getProductBarcodes'], () => requests.getProductBarcodes(open?.id))

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
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.barcode}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'MXIK',
        colId: 'mxik',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
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
              <IconButton onClick={() => console.log(data)
              } sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
             <CheckAccess id={'delete-product'}>
              <IconButton onClick={() => console.log(data)
              } sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <DeleteIcon />
              </IconButton>
            </CheckAccess>
          </Box>
        ),
      },
    ],
    [],
  )
  useEffect(() => {
    const count = getProductBarcodes?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))
    setOffsetCount(offsetsCount || 0)
  }, [getProductBarcodes?.data, values?.limitHistory])

  const formattedData = getProductBarcodes?.data?.data?.data

  return (
    <StyledEmptyDialog
      onClose={() => {refetch(),setOpen(false)}}
      open={open}
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
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <Box padding={'0 2px'} maxHeight={'calc(100vh - 280px)'} width={'100%'} overflow={'scroll'}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center', my: '30px' }}>{open?.name}</Typography>
              <Box display='flex' alignItems='end' justifyContent='center' gap={2}>
                <InputQuantity label={'Штрих-код'} id={`barcode`} name={`barcode`} fullWidth required type='number' defaultValue={0} disabled={false} />
                <InputQuantity label={'MXIK'} id={`mxik`} name={`mxik`} fullWidth required type='number' defaultValue={0} disabled={false} />
                <InputQuantity label={'Kод yпаковки'} id={`unit_code`} name={`unit_code`} fullWidth required type='number' defaultValue={0} disabled={false} />
                <LoadingButton loading={isLoading} variant='contained' type='submit'>
                  Добавить
                </LoadingButton>
              </Box>
              <Box height={'20px'} />
              <Box maxHeight={'calc(100vh - 380px)'} width={'100%'} overflow={'scroll'}>
                <AgGridTable
                  isDataLoading={isproductDataLoadingHistory || isFetchinggetProductBarcodes}
                  offsetQuery='offsetHistory'
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
  )
}
