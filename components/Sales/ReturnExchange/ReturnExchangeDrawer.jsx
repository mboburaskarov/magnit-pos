import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { X } from 'lucide-react'
import FilterMenuIcon from '../../../src/assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import ListWithPagination from '../../AgGridTable/ListWithPagination'
import InputSearch from '../../Inputs/InputSearch'
import ReturnExchangeChildDrawer from './ReturnExchangeChildDrawer'
import ReturnExchangeFilter from './ReturnExchangeFilter'
import ReturnExchangeParentItemBox from './ReturnExchangeParentItemBox'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      overflow: 'hidden',
      borderRadius: '0px !important',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '10px 24px',
    height: '60px',
    backgroundColor: '#111827',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  drawerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    padding: 0,
    outline: 'none',
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(0.96)',
    },
  },
}))

function ReturnExchangeDrawer({ open, setOpen, cashBoxDetails }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()

  const [isOpenChild, setIsOpenChild] = useState(false)
  const returnExchangeListFilter = useMemo(() => {
    const filter = {
      search: values?.search || null,
      store_id: get(userData, 'store.id'),
      limit: get(values, 'returnLimit'),
      customer_id: values?.customer_id,
    }
    // if (values?.draft_date) {
    //   filter.draft_date = dayjs(values?.draft_date).format('YYYY-MM-DD')
    // } else if (!values?.search) {
    //   filter.start_date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    //   filter.end_date = dayjs().format('YYYY-MM-DD')
    // }
    return filter
  }, [values?.customer_id, values?.returnLimit, values?.draft_date, values?.page, values?.search, userData])

  const theme = useTheme()

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Box className={classes.drawerHeader}>
            <Typography className={classes.drawerTitle}>{t('sales') || 'Продажи'}</Typography>
            <button type='button' className={classes.closeButton} onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </Box>

          <Box display={'flex'} py={'16px'} px={'24px'} alignItems={'center'}>
            <InputSearch
              fullWidth
              uncontrolled
              placeholder={'Поиск: ID'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px !important',
                  borderRadius: '8px !important',
                },
                '& .MuiInputBase-root': {
                  height: '40px !important',
                  borderRadius: '8px !important',
                },
              }}
            />
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: '24px', pb: '16px' }}>
            <ListWithPagination
              isFlex={true}
              emptyText='Продажи за сегодня и вчера не найдены'
              limitQuery='returnLimit'
              request={(filter) => requests.getAllSales(filter)}
              customFilter={returnExchangeListFilter}
              renderItem={(item) => <ReturnExchangeParentItemBox item={item} setIsOpenChild={setIsOpenChild} />}
            />
          </Box>
        </Box>
      ) : (
        <ReturnExchangeChildDrawer
          cash_box_operation_id={get(cashBoxDetails, 'data.data.cash_box_operation_id')}
          refetchDraftList={() => {}}
          setChildOpen={setIsOpenChild}
          open={isOpenChild}
          setOpen={setOpen}
        />
      )}
      <ReturnExchangeFilter setRegions={() => {}} open={draftfilter} setOpen={setDraftFilter} />
    </Drawer>
  )
}

export default ReturnExchangeDrawer
