import { Box, Drawer, Grid, Typography } from '@mui/material';
import { useQueryParams } from '@hooks/useQueryParams';
import thousandDivider from '@utils/thousandDivider';
import { useEffect, useMemo, useState } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { requests } from '@utils/requests';
import { useSelector } from 'react-redux';
import CloseIcon from '@icons/CloseIcon';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import ListWithPagination from '../../AgGridTable/ListWithPagination';
import PendingSaleParentItemsBox from './PendingSaleParentItemsBox';
import InputSwitch from '../../Inputs/InputSwitch';
import InputSearch from '../../Inputs/InputSearch';
import DraftChildDrawer from './DraftChildDrawer';
import ResultItem from './DraftParentItemsBox';
import DraftFilter from './DraftFilter';


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
function BonusProductDrawer({ open, setOpen }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [appType, setAppType] = useState('all')
  const [isOpenChild, setIsOpenChild] = useState(false)
  const [controlleroffset, setControllerOffset] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setAppType(get(open, 'owner', 'all'))
    }, 0)
  }, [open])
  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])
  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const draftsListFilter = useMemo(() => {
    return {
      search: values?.search || null,
      limit: get(values, 'bonusLimit'),
    }
  }, [values?.customer_id, values?.bonusLimit, values?.draft_date, values?.search, controlleroffset])

  const theme = useTheme()
  const { data: sellerBonus } = useQuery(['sellerBonus'], () => requests.getSellerBonusData())
  const miniDashboardMeta = [
    {
      id: 1,
      title: 'Общий бонус',
      prop: 'total_bonus',
      endText: 'сум',
    },

    {
      id: 3,
      title: 'Общий объем продаж',
      prop: 'total_sales',
      endText: 'ед',
    },
    {
      id: 2,
      title: 'Общие продукты',
      prop: 'total_products',
      endText: 'ед',
    },
  ]
  const GridItem = ({ title, sum, endText }) => (
    <Grid sm={4} lg={4} md={4} item>
      <Box className='item'>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}> {title}</Typography>
        <Typography sx={{ fontSize: '16px' }}>{thousandDivider(sum, endText)}</Typography>
      </Box>
    </Grid>
  )
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              Все / Мои бонусные продукты
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
                { title: 'Все', value: 'all' },
                { title: 'Мои', value: 'my' },
              ]}
            />
          </Box>
          <Box display={'flex'} py={'24px'} px={'40px'}>
            <InputSearch fullWidth uncontrolled placeholder={'Поиск: Наименование'} />
          </Box>
          {appType != 'all' && (
            <Box
              padding={'0 40px 20px'}
              sx={{
                '& .MuiGrid-item': {
                  display: 'flex',
                },
                '& .MuiGrid-item:nth-child(1)': {
                  paddingLeft: 0,
                },
                '& .item': {
                  width: '100%',
                  bgcolor: 'bg.10',
                  borderRadius: '20px',
                  padding: '10px 12px',
                },
              }}
            >
              <Grid width={'100%'} m={'0'} spacing={1} container>
                {miniDashboardMeta.map((item) => (
                  <GridItem {...item} sum={sellerBonus?.data?.data?.[item?.prop]} />
                ))}
              </Grid>
            </Box>
          )}
          <Box py={'0px'} px={'40px'}>
            {appType === 'all' ? (
              <ListWithPagination
                limit={10}
                maxHeight='calc(100vh - 350px)'
                request={(filter) => requests.getProductBonusList(filter)}
                renderItem={(item) => (
                  <ResultItem
                    isChild={false}
                    discount={0}
                    index={item?.id}
                    handleAddProduct={(handleAddProduct) => {}}
                    setSearchTerm={values?.search}
                    item={item}
                    product={item?.product}
                    searchTerm={'searchTearm'}
                    classes={classes}
                  />
                )}
                limitQuery='bonusLimit'
                customFilter={draftsListFilter}
              />
            ) : (
              <ListWithPagination
                maxHeight='calc(100vh - 350px)'
                limitQuery='bonusLimit'
                statePath='pendingSaleList'
                request={(filter) => requests.getBonusProductSold(filter)}
                renderItem={(item) => <PendingSaleParentItemsBox item={item} setIsOpenChild={setIsOpenChild} />}
                customFilter={{ ...draftsListFilter, employee_id: userData?.id }}
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

export default BonusProductDrawer
