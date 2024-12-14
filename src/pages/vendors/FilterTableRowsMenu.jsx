import { Box } from '@mui/material'
import { useTheme } from '@mui/styles'
import { t } from 'i18next'
import * as qs from 'qs'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import ColumnsFilterButton from '../../../components/AgGridTable/ColumnsFilterButtonForVendor'
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../utils/requests'
import CloseIcon from '../../assets/icons/CloseIcon'
import { useQueryParams } from '../../hooks/useQueryParams'

export default function FilterTableRowsMenu({ tableColumns, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods
  const [isExpress, setIsExpress] = useState(false)

  const onSubmit = (data) => {
    setRegions(data.regions || [])
    const requestBody = {
      category_id: data.category?._id || undefined,
      from_price: data.from_price || undefined,
      to_price: data.to_price || undefined,
      shop_id: data.shop?._id || undefined,
      hashtag_id: data.hashtag?._id || undefined,
      isExpress: isExpress || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  const resetFilter = () => {
    reset()
    navigate(`/products?offset=0&limit=${values?.limit || 5}`)
  }
  const theme = useTheme()
  return (
    <StyledEmptyDialog
      open={open}
      title={t('ag_grid.table_setting.label')}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            {/* <CheckboxWithDragDrop
              data={[
                data?.filter((item) => {
                  if (item?.colId === 'actions') return false
                  return true
                }),
              ]}
              checkAllField
              setData={setData}
            /> */}
            <ColumnsFilterButton columns={tableColumns} isCatalog={false} />
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
