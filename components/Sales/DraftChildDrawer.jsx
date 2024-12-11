import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import InputSearch from '../Inputs/InputSearch'
import DraftParentItemsBox from './DraftParentItemsBox'
import LeftArrowIcon from '../../src/assets/icons/LeftArrow'
import DraftChildItemsBox from './DraftChildItemsBox'
import DeleteIcon from '../../src/assets/icons/DeleteIcon'
import MarkRectangleIcon from '../../src/assets/icons/MarkRectangleIcon'
import WithdrawIcon from '../../src/assets/icons/WithdrawIcon'
import { get } from 'lodash'
import { requests } from '../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import dayjs from 'dayjs'
import { LoadingButton } from '@mui/lab'
import { error, success } from '../../utils/toast'
import LoadingContainer from '../LoadingContainer'
import { RippedPaperItem } from '../RippedPaperList'
import { useReactToPrint } from 'react-to-print'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '88px',
    padding: '16px 24px',
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
function DraftChildDrawer({ open, refetchDraftList, setChildOpen, setOpen }) {
  console.log(open)

  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const printContainer = useRef()
  const documentName = useRef('Cheque')
  const navigate = useNavigate()

  const handlePrint = useReactToPrint({
    content: reactToPrintContent, // This should be a function
    documentTitle: documentName.current,
    removeAfterPrint: true,
  })
  const classes = useStyles()
  const { mutate: deleteDraft, isLoading: isDeleteDraft } = useMutation(requests.deleteDraft, {
    onSuccess: ({ data }) => {
      console.log(data)
      refetchDraftList()
      setChildOpen(false)
      setOpen(false)
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  const { mutate: completeDraft, isLoading: isCompleteDraft } = useMutation(requests.completeDraft, {
    onSuccess: ({ data }) => {
      console.log(data)
      refetchDraftList()
      setChildOpen(false)
      setOpen(false)
      navigate(`/sales/new-sale/${get(data, 'data')}`)

      // success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товараa!')
      console.log('err', err)
    },
  })
  const { data: darftChildList, refetch, isDarftChildList } = useQuery('darftChildList', () => requests.getDarftChildList(get(open, 'item.id')))
  useEffect(() => {
    refetch()
  }, [open])
  console.log(get(darftChildList, 'data.data'))

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
                Qoralama {get(darftChildList, 'data.data.data[0].draft_number')}
              </Typography>
              <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
                2332 323 so'm
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            onClick={() => {
              setOpen(false), setChildOpen(false)
            }}
          />
        </Box>

        <Box padding={'24px 20px 0'}>
          <Box alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={20} lineHeight={'32px'} fontWeight={600}>
              Savatcha
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                Sotuvchi:
              </Typography>
              <img className={classes.usrImg} src='/default-user-img.png' />

              <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
                {get(darftChildList, 'data.data.employee.first_name')}
              </Typography>
            </Box>
          </Box>
          <Box padding={'16px 0'}>
            {get(darftChildList, 'data.data.cart_items', []).map((el) => (
              <DraftChildItemsBox key={el.id} item={el} />
            ))}
          </Box>
          <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              Tafsilotlar
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Yaratilgan sana
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {dayjs(get(darftChildList, 'data.data.data[0].draft_time')).format('DD.MM.YYYY | HH:mm:ss')}
                </Typography>
              </Box>
              <Box width={'100%'} bgcolor={'bg.10'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Do’kon
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  Pharma Cosmos
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
              '& .MuiButtonBase-root': {
                height: 48,
              },
            }}
            columnGap={2}
            display='flex'
            width='100%'
            mt={4}
          >
            <Button fullWidth color='secondary' variant='contained'>
              <WithdrawIcon />

              <Typography fontSize={16} ml={'12px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                Chop etish
              </Typography>
            </Button>
            <LoadingButton loading={isDeleteDraft} onClick={() => deleteDraft(get(open, 'item.id'))} fullWidth color='secondary' variant='contained'>
              <DeleteIcon width='24px' />

              <Typography fontSize={16} ml={'12px'} color={'red.500'} lineHeight={'24px'} fontWeight={600}>
                O'chirish
              </Typography>
            </LoadingButton>
            <Button onClick={() => completeDraft(get(open, 'item.id'))} fullWidth variant='contained' type='submit'>
              <MarkRectangleIcon />
              <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
                Yakunlash
              </Typography>
            </Button>
          </Box>
          {/* <DraftParentItemsBox />
        <DraftParentItemsBox />
        <DraftParentItemsBox />
        <DraftParentItemsBox /> */}
          {/* <Box maxWidth='400px'>
            <Box
              mx={-2}
              mt={-4}
              style={{
                // width: 320,
                padding: '20px',
              }}
              ref={printContainer}
            >
              <RippedPaperItem
                paymentsList={[]}
                cartItemsList={[]}
                id='cheque_of_orders'
                cashBoxDetails={[]}
                customerId={[]}
                noFormControl
                printContainer={printContainer}
              />
            </Box>
          </Box> */}
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default DraftChildDrawer
