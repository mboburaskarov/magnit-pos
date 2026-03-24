import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
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
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '40px 40px 24px 40px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
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
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              {t('navbar.return')}
            </Typography>
            <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
          </Box>
          <Box display={'flex'} py={'24px'} px={'40px'}>
            <InputSearch fullWidth uncontrolled placeholder={'Поиск: ID'} />
            <Box minWidth={113} ml={'16px'}>
              <Button
                sx={{
                  height: '48px',
                  padding: 0,
                  bgcolor: '#fff',
                  border: '1px solid #ECEDF2',
                  color: 'dark.500',
                  fontWeight: '500',
                  fontSize: '16px',
                  lineHeight: '24px',
                  '& span': {
                    mr: '12px',
                  },
                }}
                fullWidth
                startIcon={<FilterMenuIcon />}
                variant='contained'
                color='secondary'
                onClick={() => setDraftFilter((prev) => !prev)}
              >
                <Typography fontWeight={500} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter')}
                </Typography>
              </Button>
            </Box>
          </Box>

          <Box py={'0px'} px={'40px'}>
            <ListWithPagination
              maxHeight='calc(100vh - 300px)'
              limitQuery='returnLimit'
              request={(filter) => requests.getAllSales(filter)}
              customFilter={returnExchangeListFilter}
              renderItem={(item) => <ReturnExchangeParentItemBox item={item} setIsOpenChild={setIsOpenChild} />}
            />
            {/* {draftListData.map((item, index) => {
              return <ReturnExchangeParentItemBox key={index} item={item} setIsOpenChild={setIsOpenChild} />
            })} */}
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
