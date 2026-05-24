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
    padding: '12px 24px',
    height: '72px',
    backgroundColor: '#111827',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  drawerTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: '48px',
    height: '48px',
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
    return {
      search: values?.search || null,
      store_id: get(userData, 'store.id'),
      limit: get(values, 'returnLimit'),
      customer_id: values?.customer_id,
      draft_date: values?.draft_date ? dayjs(values?.draft_date).format('YYYY-MM-DD') : '',
    }
  }, [values?.customer_id, values?.returnLimit, values?.draft_date, values?.page, values?.search])

  const theme = useTheme()

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box className={classes.drawerHeader}>
            <Typography className={classes.drawerTitle}>
              {t('navbar.return')}
            </Typography>
            <button type="button" className={classes.closeButton} onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </Box>
          
          <Box display={'flex'} py={'24px'} px={'40px'} alignItems={'center'}>
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
                }
              }}
            />
            <Box minWidth={113} ml={'16px'}>
              <Button
                sx={{
                  height: '40px !important',
                  padding: 0,
                  bgcolor: '#fff',
                  border: '2px solid #cbd5e1',
                  color: 'dark.500',
                  fontWeight: '600',
                  fontSize: '15px',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '& span': {
                    mr: '8px',
                  },
                  '&:active': {
                    backgroundColor: '#f1f5f9',
                  }
                }}
                fullWidth
                startIcon={<FilterMenuIcon />}
                variant='contained'
                color='secondary'
                onClick={() => setDraftFilter((prev) => !prev)}
              >
                <Typography fontWeight={600} fontSize={'15px'}>
                  {t('filter')}
                </Typography>
              </Button>
            </Box>
          </Box>

          <Box py={'0px'} px={'40px'}>
            <ListWithPagination
              maxHeight='calc(100vh - 220px)'
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
