import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import InputSearch from '../../../../components/Inputs/InputSearch'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../../hooks/useQueryParams'
import AgGridBottom from '../../../../components/AgGridTable/AgGridBottom'
import CommentBox from './CommentBox'
import LoadingBlurry from '../../../../components/LoadingBlurry'
import * as qs from 'qs'
import { useLocation, useNavigate } from 'react-router-dom'
import { OverlayNoRowsTemplate } from '../../../../components/AgGridTable/AgGridComponents'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import { error, success } from '../../../../utils/toast'

export default function ProductReviewsPage() {
  const { values } = useQueryParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const [client, setClient] = useState(null)
  const [offsetIndex, setOffsetIndex] = useState(1)
  const [offsetSize, setOffsetSize] = useState(5)
  const [offsetCount, setOffsetCount] = useState(1)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const commentListFilter = useMemo(() => {
    return {
      orderNumber: values?.search?.replaceAll('/', '\\'),
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      shopId: shop?._id,
      userId: client?._id,
    }
  }, [values?.offset, values?.limit, values?.search, shop, client])

  const {
    data: commentList,
    isLoading: commentListLoading,
    isFetching: isFetchingCommentList,
    refetch,
  } = useQuery('commentList', () => requests.getAllComments(commentListFilter))

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))
  const { data: clientList } = useQuery('clientList', () => requests.getAllClients({ limit: 20, offset: 0 }))

  useEffect(() => {
    refetch()
  }, [commentListFilter])

  useEffect(() => {
    const count = commentList?.data.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [commentList?.data, values?.limit])

  useEffect(() => {
    if (location.pathname) {
      const offsetLimitParams = qs.stringify({ ...values, limit: offsetSize, offset: (offsetIndex - 1) * offsetSize }, { addQueryPrefix: true })
      navigate(`${location.pathname}${offsetLimitParams}`)
    }
  }, [offsetIndex, offsetSize, location.pathname, commentList?.data])

  const { mutate: deleteComment, isLoading: isDeletingComment } = useMutation(requests.deleteComment, {
    onSuccess: () => {
      refetch()
      success('Комментарий успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении комментария!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  const { mutate: chageCommentStatus, isLoading: isChangingComment } = useMutation(requests.updateComment, {
    onSuccess: () => {
      refetch()
      success('Статус комментария успешно изменен!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при изменении статуса заказа!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography mb={4} variant='h1'>
          Отзывы продуктов ( {commentList?.data.totalCount || 0} )
        </Typography>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='orders-search' name='search' placeholder='Введите полный номер заказа' uncontrolled />
          </Box>
          <Box width='100%'>
            <SelectSimple
              id='shop'
              name='shop'
              minWidth='auto'
              placeholder={'Выберите магазин'}
              uncontrolled
              options={shopList?.data.shops}
              value={shop}
              onChange={(e) => setShop(e)}
            />
          </Box>
          <Box width='100%'>
            <SelectSimple
              filterOption={(candidate, input) => {
                const formatText = (text) => {
                  const newText = String(text)?.toLowerCase()?.replaceAll(' ', '')
                  return newText
                }
                const inputFrmttd = formatText(input)
                return formatText(candidate?.data?.fullName)?.includes(inputFrmttd) || formatText(candidate?.data?.phone)?.includes(inputFrmttd)
              }}
              id='client'
              name='client'
              minWidth='auto'
              placeholder={'Выберите клиент'}
              uncontrolled
              options={clientList?.data.users}
              value={client}
              onChange={(e) => setClient(e)}
              getOptionLabel={(option) => (
                <Typography>
                  {option.fullName} <br />{' '}
                  <Typography fontSize={14} color='gray.400'>
                    {formatPhoneNumber('+' + option.phone)}
                  </Typography>
                </Typography>
              )}
            />
          </Box>
        </Box>
        <Box mb={4} mt={4}>
          <LoadingBlurry isLoading={commentListLoading || isFetchingCommentList} height={-50} outside />
          {commentList?.data?.comments?.map((comment, ind) => (
            <CommentBox setOpenConfirmDialog={setOpenConfirmDialog} key={ind} data={comment} ind={ind} />
          ))}
          {!commentList?.data?.comments?.length && <OverlayNoRowsTemplate />}
        </Box>
        {commentList?.data?.comments?.length ? (
          <AgGridBottom
            controlledOffsetCount={offsetCount}
            changeOffset={(newOffset) => setOffsetIndex(newOffset)}
            offsetIndex={offsetIndex}
            offsetQuery='offset'
            offsetSize={offsetSize}
            setOffsetSize={setOffsetSize}
          />
        ) : (
          ''
        )}
      </Box>
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать комментарий?'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Деактивировать комментарий?'
              : 'Удалить комментарий?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать комментарий, вы не можете вернуть этот прогресс после активации.'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Вы действительно хотите деактивировать комментарий, вы не можете вернуть этот прогресс после деактивации.'
              : 'Вы действительно хотите удалить комментарий, вы не можете вернуть этот прогресс, после удаления вы не сможете восстановить продукт.'
          }
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingComment || isChangingComment}
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? chageCommentStatus({ id: openConfirmDialog.id, data: { status: 'ACTIVE' } })
                    : openConfirmDialog?.type === 'deactivate'
                    ? chageCommentStatus({ id: openConfirmDialog.id, data: { status: 'INACTIVE' } })
                    : deleteComment(openConfirmDialog.id)
                }
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
