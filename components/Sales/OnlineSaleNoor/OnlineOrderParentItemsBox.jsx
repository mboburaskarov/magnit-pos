import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../../src/assets/icons/BagOutline'
import thousandDivider from '../../../utils/thousandDivider'
export const onlineStatus = [
  { title: 'Новый', value: 1, color: '#6489ff' },
  { title: 'Поиск курьера', value: 2, color: '#ff963b' },
  { title: 'Завершено', value: 3, color: '#00972e' },
  { title: 'Ожидает курьера', value: 4, color: '#a7a7a7' },
  { title: 'Отменен', value: -1, color: '#ff0000' },
]
const useStyles = makeStyles((theme) => ({
  rightArrowIcon: {
    backgroundColor: '#fff ',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    marginRight: '4px',
  },
  productsNumsWrapper: {
    height: '48px',
    minWidth: '88px',
    backgroundColor: '#fff',
    borderRadius: '40px',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
function OnlineOrderParentItemsBox({ setIsOpenChild, item }) {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <Box
      onClick={() => setIsOpenChild({ item })}
      display={'flex'}
      height={'84px'}
      borderRadius={'16px'}
      mb={'16px'}
      bgcolor={'bg.10'}
      padding={'18px 16px'}
      justifyContent={'space-between'}
      sx={{
        '&:hover': {
          backgroundColor: 'gray.200',
        },
      }}
    >
      <Box display={'flex'}>
        <Box className={classes.productsNumsWrapper}>
          <BagOutline />
          <Typography ml={'12px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {get(item, 'product_count')}
          </Typography>
        </Box>
        <Box>
          <Typography mb={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
            {t('Онлайн-продажи')} #{get(item, 'sale_number')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'}>
              {dayjs(get(item, 'created_at')).format('DD.MM.YYYY | HH:mm:ss')}
            </Typography>
            <Typography
              fontSize={'12px'}
              borderRadius={'16px'}
              p={'0 10px'}
              fontWeight={'500'}
              ml={'10px'}
              bgcolor={onlineStatus.find((el) => el.value === get(item, 'online_status'))?.color}
              lineHeight={'20px'}
              color={'white'}
            >
              {onlineStatus.find((el) => el.value === get(item, 'online_status'))?.title}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'}>
        <Box mr={'16px'}>
          <Box display={'flex'} mb={'4px'}>
            {get(item, 'service_type', 'noor') == 'noor' ? (
              <img className={classes.usrImg} src='/noor.png' />
            ) : (
              <img
                className={classes.usrImg}
                src='https://imgs.search.brave.com/r7bZFquFlNjIE_-TVWvMw69WyZZLbDITGqJ0tqy4KoI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91enVt/LmNvbS9pbWFnZXMv/c2VydmljZXMvYmFu/ay5wbmc'
              />
            )}
            <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
              {get(item, 'service_type', 'noor')}
            </Typography>
          </Box>
          <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {thousandDivider(get(item, 'total_amount'), 'сум')}
          </Typography>
        </Box>
        <Box className={classes.rightArrowIcon}>
          <ArrowRightIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default OnlineOrderParentItemsBox
