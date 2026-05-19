import { Box, Button, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import LeftArrowIcon from '../../../src/assets/icons/LeftArrow'
import MarkRectangleIcon from '../../../src/assets/icons/MarkRectangleIcon'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import { error, success } from '../../../utils/toast'
import CustomImg from '../../CustomImg'
import LoadingContainer from '../../LoadingContainer'
import OnlineOrderChildItemsBox from './OnlineOrderChildItemsBox'
import ifNotEmpty from '../../../utils/ifNotEmpty'
const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '40px 40px 24px 40px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  rightArrowIcon: {
    backgroundColor: theme.palette.bg[10],
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    '& svg': {
      backgroundColor: theme.palette.bg[10],
    },
    '&:hover': {
      backgroundColor: '#ccc4 ',
      '& > svg': {
        backgroundColor: '#ccc4 !important',
      },
    },
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    margin: '0 4px',
  },
}))
function OnlineOrderChildDrawer({ open, refetchDraftList, setChildOpen, setOpen }) {
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const printContainer = useRef()
  const userData = useSelector((state) => state.user)

  const documentName = useRef('Cheque')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const handlePrint = useReactToPrint({
    content: reactToPrintContent, // This should be a function
    documentTitle: documentName.current,
    removeAfterPrint: true,
  })
  const classes = useStyles()
  const { mutate: deleteDraft, isLoading: isDeleteDraft } = useMutation(requests.deleteDraft, {
    onSuccess: ({ data }) => {
      // refetchDraftList()
      setChildOpen(false)
      setOpen(false)
      success('Черновик удален!')
    },
    onError: (err) => {
      error('Ошибка при Черновик удален!')
      console.error('err', err)
    },
  })
  const { mutate: completeOnlineOrder, isLoading: isCompleteDraft } = useMutation(requests.completeOnlineOrder, {
    onSuccess: ({ data }) => {
      success('Заказ принят!')
      refetchDraftList()
      refetch()
      // setChildOpen(false)
      // setOpen(false)
      // navigate(`/sales/new-sale/${get(data, 'data')}`)
    },
    onError: (err) => {
      error('Ошибка при принятии заказа!')
      console.error('err', err)
    },
  })
  const { mutate: changeOrderStatus, isLoading: isChangeOrderStatus } = useMutation(requests.changeOrderStatus, {
    onSuccess: ({ data }) => {
      setChildOpen(false)
      setOpen(false)
      navigate(`/sales/new-sale/${get(open, 'item.id')}`)
    },
    onError: (err) => {
      error('Ошибка при изменении статуса заказа!')
      console.error('err', err)
    },
  })
  const {
    data: darftChildList,
    refetch,
    isLoading: isDarftChildList,
  } = useQuery('darftChildList', () => requests.getCashBoxDetaildWithSaleId(get(open, 'item.id')))

  useEffect(() => {
    refetch()
  }, [open])

  const theme = useTheme()
  return (
    <LoadingContainer readyState={!isDarftChildList}>
      <Box className={classes.drawer}>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Box display={'flex'} alignItems={'center'}>
            <Box onClick={() => setChildOpen(false)} className={classes.rightArrowIcon}>
              <LeftArrowIcon />
            </Box>
            <Box ml={'16px'}>
              <Typography fontSize={24} lineHeight={'32px'} fontWeight={700}>
                {t('Онлайн-продажи')} #{get(darftChildList, 'data.data.sale_number')}
              </Typography>
              <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
                {thousandDivider(get(darftChildList, 'data.data.total_amount', 0), 'сум')}
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            color={theme.palette.black}
            onClick={() => {
              ;(setOpen(false), setChildOpen(false))
            }}
          />
        </Box>

        <Box padding={'0'}>
          <Box p={'24px 40px 24px'} alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('cart')}
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                {t('vendor')}:
              </Typography>
              <CustomImg className={classes.usrImg} src='default-user-img.png' />
              <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
                {get(darftChildList, 'data.data.employee.first_name')}
              </Typography>
            </Box>
          </Box>
          <Box maxHeight={'calc(100vh - 485px)'} sx={{ overflowY: 'auto' }} padding={'0px 40px'}>
            {get(darftChildList, 'data.data.products', [])?.map((el) => (
              <OnlineOrderChildItemsBox key={el.id} item={el} />
            ))}
          </Box>
          <Box p={'24px 40px'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('features')}
            </Typography>
            {/* client_comment */}
            <Box width={'100%'} bgcolor={'bg.10'} my={'8px'} borderRadius={'16px'} padding={'16px'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                Комментарий клиента
              </Typography>
              <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                {ifNotEmpty(get(darftChildList, 'data.data.client_comment'), '-')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Дата создания
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {dayjs(get(darftChildList, 'data.data.created_at')).format('DD.MM.YYYY | HH:mm:ss')}
                </Typography>
              </Box>
              <Box width={'100%'} bgcolor={'bg.10'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  {t('store')}
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  MAGNIT
                </Typography>
              </Box>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box mt={'20px'} width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Клиент
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {get(darftChildList, 'data.data.customer.full_name') ?? '-'}
                </Typography>
              </Box>
              <Box mt={'20px'} width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Статус
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {get(darftChildList, 'data.data.online_status') === 1
                    ? 'Новый'
                    : get(darftChildList, 'data.data.online_status') === 2
                      ? 'Поиск курьера'
                      : get(darftChildList, 'data.data.online_status') === 3
                        ? 'Завершено'
                        : get(darftChildList, 'data.data.online_status') === 4
                          ? 'Ожидает курьера'
                          : 'Отменен'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              width: 'calc(100wh - 40px)',
              right: '20px',
              left: '20px',
              padding: '20px 20px',
              '& .MuiButtonBase-root': {
                height: 48,
              },
            }}
            columnGap={2}
            display='flex'
            width='100%'
            mt={4}
          >
            {/* <LoadingButton
              loading={isDeleteDraft}
              onClick={() => deleteDraft({ cash_box_operation_id: et(open, 'item.id'), cashbox_id: 1, sale_id: id })}
              fullWidth
              color='secondary'
              variant='contained'
            >
              <DeleteIcon width='24px' />

              <Typography fontSize={16} ml={'12px'} color={'red.500'} lineHeight={'24px'} fontWeight={600}>
                {t('delete')}
              </Typography>
            </LoadingButton> */}
            {get(darftChildList, 'data.data.online_status') == 2 && get(darftChildList, 'data.data.service_type', 'noor') == 'uzum' ? (
              <Button
                onClick={() => {
                  changeOrderStatus({
                    data: { online_status: 4 },
                    saleId: get(open, 'item.id'),
                  })
                }}
                fullWidth
                variant='contained'
                type='submit'
              >
                <MarkRectangleIcon />
                <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
                  {t('Оформление заказа ')}
                </Typography>
              </Button>
            ) : get(darftChildList, 'data.data.online_status') === 4 ? (
              <Button
                onClick={() => {
                  navigate(`/sales/new-sale/${get(darftChildList, 'data.data.id')}`)
                  setChildOpen(false)
                  setOpen(false)
                }}
                fullWidth
                variant='contained'
                type='submit'
              >
                <MarkRectangleIcon />
                <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
                  {t('Передал курьер ')}
                </Typography>
              </Button>
            ) : get(darftChildList, 'data.data.online_status') === 1 ? (
              <Button
                onClick={() =>
                  completeOnlineOrder({
                    cash_box_operation_id: get(userData, 'cashbox.cashbox_operation_id'),
                    cashbox_id: get(userData, 'cashbox.id'),
                    sale_id: get(open, 'item.id'),
                  })
                }
                fullWidth
                variant='contained'
                type='submit'
              >
                <MarkRectangleIcon />
                <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
                  {t('Принять ')}
                </Typography>
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default OnlineOrderChildDrawer
