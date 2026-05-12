import { useTheme } from '@mui/styles'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'

import CloseIcon from '@icons/CloseIcon'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { Box, IconButton, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { requests } from '@utils/requests'
import { ProgressBar } from './TargetDrawer'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import { get } from 'lodash'
import EditIcon from '@icons/EditIcon'
import { FormProvider, useForm } from 'react-hook-form'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { LoadingButton } from '@mui/lab'
import { error, success } from '@utils/toast'
import { t } from 'i18next'
import { useQueryParams } from '@/hooks/useQueryParams'

function EditEmployeeTargetModal({ open, setOpen, refetch }) {
  const theme = useTheme()
  const methods = useForm()
  const { reset } = methods

  const { mutate: updateEmployeeTarget, isLoading } = useMutation(requests.updateEmployeeTarget, {
    onSuccess: () => {
      setOpen(false)
      success('Таргет успешно обновлен!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    if (!open?.store_target_id || !open?.employee_id) {
      error('Ошибка!')
      return
    }

    updateEmployeeTarget({
      employee_id: open.employee_id,
      data: {
        amount: Number(`${data.target_amount}`.replace(/\s+/g, '')),
        store_target_id: open.store_target_id,
      },
    })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset(
      {
        target_amount: open?.amount || 0,
      },
      { keepDirty: false },
    )
  }, [open, reset])

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Редактировать таргет сотрудника'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
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
            <Box width='100%'>
              <Typography fontSize='14px' lineHeight='20px' color='bunker.500'>
                Сотрудник
              </Typography>
              <Typography mt='4px' fontSize='18px' lineHeight='28px' fontWeight={600} color='bunker.950'>
                {open?.employee_name}
              </Typography>
            </Box>
            <NumberFormatInput
              label={'Целевая сумма'}
              id='target_amount'
              name='target_amount'
              fullWidth
              required
              type='number'
              defaultValue={open?.amount || 0}
              disabled={false}
            />
            <Box columnGap={2} display='flex' width='100%' mt='24px'>
              <LoadingButton loading={isLoading} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}

export default function TargetByEmployee({ open, setOpen }) {
  const theme = useTheme()
  const { values } = useQueryParams()
  const [openEditTarget, setOpenEditTarget] = useState(false)
  const [offsetCount, setOffsetCount] = useState(0)

  const targetListFIlter = useMemo(() => {
    return {
      store_id: get(open, 'store_id', undefined),
      ...get(open, 'filter', {}),
      limit: values?.limitEmployeeTarget || 5,
      offset: values?.offsetEmployeeTarget || 0,
    }
  }, [open, values?.limitEmployeeTarget, values?.offsetEmployeeTarget])

  const {
    data: targetList,
    isLoading: isTargetList,
    isFetching: isFetchingTargetList,
    refetch,
  } = useQuery(['targetByEmployeeList', targetListFIlter], () => requests.getTargetByEmployeeList(targetListFIlter), { enabled: !!open?.open })

  useEffect(() => {
    const count = targetList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitEmployeeTarget || 5))

    setOffsetCount(offsetsCount || 0)
  }, [targetList?.data, values?.limitEmployeeTarget])

  const columns = useMemo(
    () => [
      {
        headerName: 'Сотрудник',
        colId: 'employee_name',
        minWidth: 250,
        maxWidth: 250,
        width: 250,

        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.employee_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Таргет',
        colId: 'target',
        minWidth: 180,
        flex: 1,

        cellRenderer: ({ data }) => <SimpleText data={data} type={'amount'} withDevider currency={'сум'} />,
      },
      {
        headerName: 'Продажи',
        colId: 'sales',
        minWidth: 180,
        maxWidth: 180,
        width: 180,

        cellRenderer: ({ data }) => <SimpleText data={data} type={'sales'} withDevider currency={'сум'} />,
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
      {
        headerName: t('table_columns.actions'),
        colId: 'actions',
        minWidth: 90,
        maxWidth: 90,
        width: 90,
        cellRenderer: ({ data }) => (
          <IconButton
            onClick={() =>
              setOpenEditTarget({
                ...data,
                store_target_id: open?.store_target_id,
                open: true,
              })
            }
            sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
          >
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    [open?.store_target_id],
  )

  const formattedData = targetList?.data?.data?.data

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
          offsetQuery='offsetEmployeeTarget'
          limitQuery='limitEmployeeTarget'
          uniqId='employee_id'
          id='employee-target-table'
          totalCount={targetList?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          updaterAction={() => {}}
          defaultOffsetSize={5}
          emptyTableText={{
            title: 'Нет Таргета',
            description: ' ',
          }}
        />
      </Box>
      <EditEmployeeTargetModal open={openEditTarget} setOpen={setOpenEditTarget} refetch={refetch} />
    </StyledEmptyDialog>
  )
}
