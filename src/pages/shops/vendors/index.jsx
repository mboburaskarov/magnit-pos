import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import TabContainer from '../../../../components/Tab/TabContainer'
import { useEffect, useMemo, useState } from 'react'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { vendor_statuses } from '../../../assets/data/vendor-statuses'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import VendorCreateDrawer from './VendorCreateDrawer'
import { LoadingButton } from '@mui/lab'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import VendorEditDrawer from './VendorEditDrawer'
import { error, success } from '../../../../utils/toast'
import CheckAccess from '../../../../components/CheckAccess'
export default function VendorsPage() {
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const tableColumns = tableHeaderSelector({ navigate, setIsDrawerOpen, setOpenConfirmDialog })

  const vendorListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search,
      ...(status !== 'ALL' && { status }),
    }
  }, [status, values?.offset, values?.limit, values?.search, values?.from_price, values?.to_price, values?.hashtag_id, values?.category_id, values?.shop_id])

  const {
    data: vendorList,
    isLoading: vendorListLoading,
    isFetching: isFetchingvendorList,
    refetch,
  } = useQuery(['vendorList', vendorListFilter], () => requests.getAllVendors(vendorListFilter))

  useEffect(() => {
    refetch()
  }, [vendorListFilter])

  useEffect(() => {
    const count =
      status === 'ACTIVE'
        ? vendorList?.data?.active
        : status === 'INACTIVE'
        ? vendorList?.data?.inactive
        : status === 'BLOCKED'
        ? vendorList?.data?.blocked
        : vendorList?.data.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [vendorList?.data, values?.limit, status])

  const { mutate: deleteVendor, isLoading: isDeletingVendor } = useMutation(requests.deleteVendor, {
    onSuccess: () => {
      refetch()
      success('Вендор успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении вендора!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1'>Вендоры</Typography>
        <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            tabs={vendor_statuses?.map((el) => ({ label: el.name, id: el.id }))}
            counts={[
              vendorList?.data?.totalCount,
              vendorList?.data?.active,
              vendorList?.data?.inactive,
              vendorList?.data?.createdByAdmin,
              vendorList?.data?.blocked,
            ]}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='vendor-search' name='shop-search' placeholder='Введите информацию о вендоре для поиска' uncontrolled />
          </Box>
          <CheckAccess id={'vendor-create'}>
            <Box minWidth={216}>
              <Button
                onClick={() => setIsDrawerOpen({ type: 'create' })}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать вендор
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box>
          <AgGridTable
            id='vendors-main-table'
            tableSettings
            columns={tableColumns}
            data={vendorList?.data?.vendors || []}
            isDataLoading={isFetchingvendorList || vendorListLoading}
            offsetCount={offsetCount}
            simpleTable
            status={status}
          />
        </Box>
        <VendorCreateDrawer
          refetch={refetch}
          setOpenConfirmDialog={setOpenConfirmDialog}
          isOpen={isDrawerOpen?.type === 'create'}
          onClose={() => setIsDrawerOpen(null)}
        />
        <VendorEditDrawer
          refetch={refetch}
          setOpenConfirmDialog={setOpenConfirmDialog}
          isOpen={isDrawerOpen?.type === 'edit'}
          id={isDrawerOpen?.id}
          onClose={() => setIsDrawerOpen(null)}
        />
        {openConfirmDialog && (
          <ConfirmDialog
            open={!!openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
            title={
              openConfirmDialog?.type === 'activate'
                ? 'Активировать магазин?'
                : openConfirmDialog?.type === 'blocked'
                ? 'Блокировать магазина?'
                : 'Удалить вендор?'
            }
            desc={
              openConfirmDialog?.type === 'activate'
                ? 'Вы действительно хотите активировать магазин, вы не можете вернуть этот прогресс после активации.'
                : openConfirmDialog?.type === 'blocked'
                ? 'Вы действительно хотите блокировать магазин, вы не можете вернуть этот прогресс после блокировки.'
                : 'Вы действительно хотите удалить вендор, вы не можете вернуть этот прогресс, после удаления вы не сможете восстановить вендор.'
            }
            actions={
              <>
                <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                  Нет
                </Button>
                <LoadingButton
                  variant='contained'
                  type='button'
                  loading={isDeletingVendor}
                  onClick={() =>
                    // openConfirmDialog?.type === 'activate'
                    //   ? changeShopStatus({ id: openConfirmDialog.id, status: 'ACTIVE' })
                    //   : openConfirmDialog?.type === 'blocked'
                    //   ? changeShopStatus({ id: openConfirmDialog.id, status: 'BLOCKED' })
                    // :
                    deleteVendor(openConfirmDialog.id)
                  }
                >
                  Да
                </LoadingButton>
              </>
            }
          />
        )}
      </Box>
    </LoadingContainer>
  )
}
