import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../../src/assets/icons/BagOutline'
import thousandDivider from '../../../utils/thousandDivider'
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
function DraftParentItemsBox({ setIsOpenChild, item }) {
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
            {get(item, 'quantity')}
          </Typography>
        </Box>
        <Box>
          <Typography mb={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
            {t('Онлайн-продажи')} #{get(item, 'draft_number')}
          </Typography>
          <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'}>
            {dayjs(get(item, 'draft_time')).format('DD.MM.YYYY | HH:mm:ss')}
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'}>
        <Box mr={'16px'}>
          <Box display={'flex'} mb={'4px'}>
            <img className={classes.usrImg} src='/noor.png' />
            <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
              {'Noor'}
            </Typography>
          </Box>
          <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {thousandDivider(get(item, 'total_price'), 'сум')}
          </Typography>
        </Box>
        <Box className={classes.rightArrowIcon}>
          <ArrowRightIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default DraftParentItemsBox
