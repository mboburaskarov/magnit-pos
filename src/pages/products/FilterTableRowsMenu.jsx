import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import SelectSimple from '../../../components/Select/SelectSimple'
import InputRange from '../../../components/Inputs/InputRange'
import * as qs from 'qs'
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../assets/icons/CloseIcon'
import CheckboxWithDragDrop from '../../../components/AgGridTable/CheckboxWithDragDrop'
import ColumnsFilterButton from '../../../components/AgGridTable/ColumnsFilterButton'

export default function FilterTableRowsMenu({ tableColumns, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods
  const [isExpress, setIsExpress] = useState(false)
  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 1000, offset: 0 }))
  const { data: hashtags } = useQuery('hashtags', () => requests.getAllHashtags({ limit: 1000, offset: 0 }))

  const [data, setData] = useState(
    tableColumns
      ?.filter((el) => !el.is_temporary)
      ?.map((el) => ({
        ...el,
        label: el.Header,
        desc: el.desc,
        name: el.accessor,
      }))
  )

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

  return (
    <StyledEmptyDialog open={open} title={'Jadval sozlamalari'} customButtons={<CloseIcon onClick={() => setOpen(false)} />}>
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
