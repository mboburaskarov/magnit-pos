import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
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
function PendingSaleParentItemsBox({ setIsOpenChild, item }) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Box
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
      <Box display={'flex'} maxWidth={'calc(100% - 100px)'}>
        <Box className={classes.productsNumsWrapper}>
          <BagOutline />
          <Typography ml={'12px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {get(item, 'quantity')}
          </Typography>
        </Box>
        <Box maxWidth={'calc(100% - 10px)'}>
          <Typography
            mb={'4px'}
            textOverflow={'ellipsis'}
            maxWidth={'calc(100% - 100px)'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
            fontSize={'14px'}
            fontWeight={'600'}
            lineHeight={'24px'}
            color={'bunker.950'}
          >
            {get(item, 'product_name')}
          </Typography>
          <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'}>
            {dayjs(get(item, 'created_at')).format('DD.MM.YYYY | HH:mm:ss')}
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'} width={'100px'}>
        <Box mr={'16px'}>
          <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {thousandDivider(get(item, 'bonus_amount'), 'сум')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default PendingSaleParentItemsBox
