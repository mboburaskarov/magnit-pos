import { Box, Button, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import LeftArrowIcon from '../../../src/assets/icons/LeftArrow'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import { error, success } from '../../../utils/toast'
import CustomImg from '../../CustomImg'
import LoadingContainer from '../../LoadingContainer'
import ReturnExchangeChildItemBox from './ReturnExchangeChildItemBox'

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
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    margin: '0 4px',
  },
}))
function ReturnExchangeItemDrawer({ open, cash_box_operation_id, setChildOpen, setOpen }) {
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const printContainer = useRef()
  const [selectedReturnItems, setSelectedReturnItems] = useState([])

  const documentName = useRef('Cheque')
  const navigate = useNavigate()
  const { id: sale_id } = useParams()
  const { t } = useTranslation()
  const selectReturnItem = (e, item) => {
    if (e.target.checked) {
      setSelectedReturnItems((p) => [
        ...p,
        { quantity: item?.quantity, id: item?.id, unit_quantity: item?.unit_quantity, store_product_id: item?.store_product_id },
      ])
    } else {
      setSelectedReturnItems((p) => p.filter((i) => i?.id != item?.id))
    }
  }
  const selectAllReturnItem = (e) => {
    if (e.target.checked) {
      const items = get(darftChildList, 'data.data.products', [])
      setSelectedReturnItems([])
      items.map((item) => {
        setSelectedReturnItems((p) => [
          ...p,
          { id: item?.id, quantity: item?.quantity, unit_quantity: item?.unit_quantity, store_product_id: item?.store_product_id },
        ])
      })
    } else {
      setSelectedReturnItems([])
    }
  }
  const isAllChecked = () => {
    const itemsLength = get(darftChildList, 'data.data.products', [])?.length
    return itemsLength === selectedReturnItems.length
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent, // This should be a function
    documentTitle: documentName.current,
    removeAfterPrint: true,
  })
  const classes = useStyles()
  const { mutate: deleteDraft, isLoading: isDeleteDraft } = useMutation(requests.deleteDraft, {
    onSuccess: ({ data }) => {
      setChildOpen(false)
      // setOpen(false)
      success('Черновик удален!')
    },
    onError: (err) => {
      error('Ошибка при Черновик удален!')
      console.log('err', err)
    },
  })
  const { mutate: returnSaleItem, isLoading: isreturnSaleItem } = useMutation(requests.returnSaleItem, {
    onSuccess: ({ data }) => {
      // ()
      setChildOpen(false)
      setOpen(false)
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
    },
    onError: (err) => {
      error('Ошибка при создании Черновик!')
      console.log('err', err)
    },
  })
  const { data: darftChildList, refetch, isDarftChildList } = useQuery('darftChildList', () => requests.getCashBoxDetaildWithSaleId(get(open, 'item.id')))
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
                Продажа #{get(darftChildList, 'data.data.sale_number')}
              </Typography>
              <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
                {thousandDivider(get(darftChildList, 'data.data.total_amount', 0), 'сум')}
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            color={theme.palette.black}
            onClick={() => {
              setOpen(false), setChildOpen(false)
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
              <CustomImg className={classes.usrImg} src='/default-user-img.png' />

              <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
                {get(darftChildList, 'data.data.employee.first_name')}
              </Typography>
            </Box>
          </Box>
          <Box maxHeight={'calc(100vh - 485px)'} sx={{ overflowY: 'auto' }} padding={'0px 40px'}>
            <Box mb={'10px'} borderRadius={'16px'} p={'16px'} bgcolor={'bg.10'} mr={'8px'} display={'flex'} width={'auto'}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                }}
              >
                <input onChange={(e) => selectAllReturnItem(e)} name='checkbox_zero' checked={isAllChecked()} className='customCheckbox' type='checkbox' />
              </Box>
              <Typography>Выбрать все</Typography>
            </Box>
            {get(darftChildList, 'data.data.products', []).map((el) => (
              <ReturnExchangeChildItemBox selectedReturnItems={selectedReturnItems} selectReturnItem={selectReturnItem} key={el.id} item={el} />
            ))}
          </Box>
          <Box p={'24px 40px'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('features')}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Дата создания
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {dayjs(get(darftChildList, 'data.data.completed_at')).format('DD.MM.YYYY | HH:mm:ss')}
                </Typography>
              </Box>
              <Box width={'100%'} bgcolor={'bg.10'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  {t('store')}
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  Pharma Cosmos
                </Typography>
              </Box>
            </Box>
            <Box mt={'20px'} width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                Клиент
              </Typography>
              <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                {get(darftChildList, 'data.data.customer_name') ?? '-'}
              </Typography>
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
            <Button
              onClick={() =>
                returnSaleItem({
                  cash_box_operation_id,
                  sale_id: get(open, 'item.id'),
                  sale_items: selectedReturnItems.map(({ id, ...others }) => ({ ...others })),
                })
              }
              fullWidth
              disabled={selectedReturnItems?.length == 0}
              variant='contained'
              type='submit'
            >
              <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
                Возврат / Обмен
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default ReturnExchangeItemDrawer
