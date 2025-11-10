import { Box, Button, Drawer, Typography } from '@mui/material';
import { useQueryParams } from '@hooks/useQueryParams';
import { useEffect, useMemo, useState } from 'react';
import FilterMenuIcon from '@icons/FilterMenuIcon';
import { makeStyles, useTheme } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { requests } from '@utils/requests';
import { useSelector } from 'react-redux';
import CloseIcon from '@icons/CloseIcon';
import { get } from 'lodash';
import dayjs from 'dayjs';

import PendingSaleParentItemsBox from './PendingSaleParentItemsBox';
import ListWithPagination from '../AgGridTable/ListWithPagination';
import DraftParentItemsBox from './DraftParentItemsBox';
import DraftChildDrawer from './DraftChildDrawer';
import InputSwitch from '../Inputs/InputSwitch';
import InputSearch from '../Inputs/InputSearch';
import DraftFilter from './DraftFilter';


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
}))
function DraftDrawer({ open, setOpen, cashBoxDetails }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [appType, setAppType] = useState('sale')
  const [isOpenChild, setIsOpenChild] = useState(false)
  const [controlleroffset, setControllerOffset] = useState(0)
  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])
  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const draftsListFilter = useMemo(() => {
    return {
      search: values?.search || null,
      store_id: get(userData, 'store.id'),
      cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
      customer_id: values?.customer_id,
      draft_date: values?.draft_date ? dayjs(values?.draft_date).format('YYYY-MM-DD') : '',
    }
  }, [values?.customer_id, values?.draft_date, values?.search, controlleroffset])

  const theme = useTheme()
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              {t('draft')} / Отложки
            </Typography>
            <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
          </Box>
          <Box
            sx={{
              padding: '0 40px',
              display: 'flex',
              width: '100%',
              '& .slider': {
                width: '100%',
              },
              '& .slider_box': {
                width: '100%',
              },
              '& .slider_box_wrapper': {
                width: '100%',
              },
            }}
          >
            <InputSwitch
              uncontrolled
              id='app-type'
              style={{ width: '100%' }}
              name='app-type'
              value={appType}
              defaultValue={appType}
              onChange={(e) => setAppType(e)}
              options={[
                { title: 'Отложки', value: 'sale' },
                { title: 'Черновики', value: 'draft', inprecess: true },
              ]}
            />
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
            {appType === 'draft' ? (
              <ListWithPagination
                maxHeight='calc(100vh - 350px)'
                request={(filter) => requests.getDarftList(filter)}
                renderItem={(item) => <DraftParentItemsBox item={item} setIsOpenChild={setIsOpenChild} />}
                customFilter={draftsListFilter}
              />
            ) : (
              <ListWithPagination
                statePath='pendingSaleList'
                maxHeight='calc(100vh - 350px)'
                request={(filter) => requests.getPendingSales(filter)}
                renderItem={(item) => <PendingSaleParentItemsBox item={item} setIsOpenChild={setIsOpenChild} />}
                customFilter={draftsListFilter}
              />
            )}
          </Box>
        </Box>
      ) : (
        <DraftChildDrawer setChildOpen={setIsOpenChild} open={isOpenChild} setOpen={setOpen} />
      )}
      <DraftFilter setRegions={() => {}} open={draftfilter} setOpen={setDraftFilter} />
    </Drawer>
  )
}

export default DraftDrawer
