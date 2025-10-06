import { Box, Drawer, Grid, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import ListWithPagination from '../../AgGridTable/ListWithPagination'
import InputSearch from '../../Inputs/InputSearch'
import InputSwitch from '../../Inputs/InputSwitch'
import DraftChildDrawer from './DraftChildDrawer'
import DraftFilter from './DraftFilter'
import ResultItem from './DraftParentItemsBox'
import PendingSaleParentItemsBox from './PendingSaleParentItemsBox'

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
function BonusProductDrawer({ open, setOpen, cashBoxDetails }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [appType, setAppType] = useState('all')
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
    }
  }, [values?.customer_id, values?.draft_date, values?.search, controlleroffset])

  const theme = useTheme()
  const {
    data: sellerBonus,
    isLoading: sellerBonusLoading,
    isFetching: isFetchingsellerBonus,
    refetch,
  } = useQuery(['sellerBonus'], () => requests.getSellerBonusData())

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
              width: '100%',
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
            <InputSearch fullWidth uncontrolled placeholder={'Поиск: ID'} />

            {/* <Box minWidth={113} ml={'16px'}>
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
            </Box> */}
          </Box>
          {appType != 'all' && (
            <Grid
              padding={'0 40px'}
              m={'0'}
              spacing={2}
              container
              sx={{
                '& .MuiGrid-item': {
                  borderRadius: '20px',
                  padding: '5px 20px',
                  overflow: 'hidden',
                  bgcolor: 'bg.10',
                  '& p:nth-child(1)': {
                    fontSize: '14px',
                    fontWeight: '600',
                  },
                  '& p:nth-child(2)': {
                    fontSize: '17px',
                  },
                },
              }}
            >
              <Grid sm='4' lg='4' md='4' item>
                <Typography>Общий бонус</Typography>
                <Typography>{thousandDivider(get(sellerBonus, 'data.data.total_bonus'), 'сум')}</Typography>
              </Grid>
              <Grid sm='4' lg='4' md='4' item>
                <Typography>Общий объем продаж</Typography>
                <Typography>{thousandDivider(get(sellerBonus, 'data.data.total_sales'), 'ед.')}</Typography>
              </Grid>
              <Grid sm='4' lg='4' md='4' item>
                <Typography>Общие продукты</Typography>
                <Typography>{thousandDivider(get(sellerBonus, 'data.data.total_products'), 'ед.')}</Typography>
              </Grid>
            </Grid>
          )}
          <Box py={'0px'} px={'40px'}>
            {appType === 'all' ? (
              <ListWithPagination
                limit={10}
                request={(filter) => requests.getProductBonusList(filter)}
                renderItem={(item) => (
                  <ResultItem
                    isChild={false}
                    discount={0}
                    index={item?.id}
                    // setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
                    handleAddProduct={(handleAddProduct) => {}}
                    setSearchTerm={values?.search}
                    item={item}
                    // itemRef={(el) => (searchItemRef.current[index] = el)}
                    product={item?.product}
                    searchTerm={'searchTearm'}
                    classes={classes}
                  />
                )}
                customFilter={draftsListFilter}
              />
            ) : (
              <ListWithPagination
                statePath='pendingSaleList'
                request={(filter) => requests.getBonusProductSold(filter)}
                renderItem={(item) => <PendingSaleParentItemsBox item={item} setIsOpenChild={setIsOpenChild} />}
                customFilter={{ ...draftsListFilter, employee_id: userData?.id }}
              />
            )}
            {/* {draftListData.map((item, index) => {
              return <DraftParentItemsBox key={index} item={item} setIsOpenChild={setIsOpenChild} />
            })} */}
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
