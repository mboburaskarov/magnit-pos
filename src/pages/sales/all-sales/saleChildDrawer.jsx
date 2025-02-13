import { Box, Grid, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import CloseIcon from '../../../assets/icons/CloseIcon'
import LeftArrowIcon from '../../../assets/icons/LeftArrow'
import SaleChildItemsBox from './SaleChildItemsBox'
import thousandDivider from '../../../../utils/thousandDivider'
import LoadingContainer from '../../../../components/LoadingContainer'

const useStyles = makeStyles((theme) => ({
  drawer: {
    height: 'calc(100vh - 80px)',
    overflowY: 'auto',
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
function SaleChildDrawer({ open, setOpen }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    data: saleDetailsList,
    refetch,
    isLoading,
  } = useQuery(['saleDetailsList', get(open, 'id')], () => requests.getCashBoxDetaildWithSaleId(get(open, 'id')))
  useEffect(() => {
    if (get(open, 'id', false)) refetch()
  }, [open])

  const theme = useTheme()
  return (
    <LoadingContainer readyState={!isLoading}>
      <Box className={classes.drawer}>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Box display={'flex'} alignItems={'center'}>
            <Box
              onClick={() => {
                setOpen(false), setOpen(false)
              }}
              className={classes.rightArrowIcon}
            >
              <LeftArrowIcon />
            </Box>
            <Box ml={'16px'}>
              <Typography fontSize={24} lineHeight={'32px'} fontWeight={700}>
                #{get(saleDetailsList, 'data.data.sale_number')}
              </Typography>
              <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
                {thousandDivider(get(saleDetailsList, 'data.data.total_amount'), 'сум')}
              </Typography>
            </Box>
          </Box>

          <CloseIcon
            color={theme.palette.black}
            onClick={() => {
              setOpen(false), setOpen(false)
            }}
          />
        </Box>

        <Box padding={'24px 20px 0'}>
          <Box alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
            <Typography fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('cart')}
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                {t('vendor')}:
              </Typography>
              {/* <DefaultImgIcon /> */}
              <img className={classes.usrImg} src='/default-user-img.png' />

              <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
                {get(saleDetailsList, 'data.data.employee.first_name')}
              </Typography>
            </Box>
          </Box>
          <Box padding={'16px 0'}>
            {get(saleDetailsList, 'data.data.products', [])?.map((el) => (
              <SaleChildItemsBox key={el.id} item={el} />
            ))}
          </Box>
          <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('pay')}
            </Typography>
            <Grid container display={'flex'}>
              {get(saleDetailsList, 'data.data.sale_payments', [])?.map((pays) => (
                <Grid item xs={12} sm={6} md={4} lg={2} width={'100%'} padding={'4px'}>
                  <Box bgcolor={'bg.10'} borderRadius={'16px'} padding={'12px 16px'}>
                    <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                      {get(pays, 'payment_type.name')}
                    </Typography>
                    <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                      {thousandDivider(get(pays, 'amount'), 'сум')}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
              {t('features')}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Дата создания
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {dayjs(get(saleDetailsList, 'data.data.created_at')).format('DD.MM.YYYY | HH:mm:ss')}
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
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box width={'50%'} mt={'16px'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
                <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                  Клиент
                </Typography>
                <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                  {get(saleDetailsList, 'data.data.customer.first_name', 'Unknown')} {get(saleDetailsList, 'data.data.customer.last_name', '')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default SaleChildDrawer
