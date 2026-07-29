import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import thousandDivider from '../../../utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  productImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    marginRight: '8px',
  },
}))

function ReturnExchangeChildItemBox({ item, selectedReturnItems, selectReturnItem, open }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const bonusAmount = Number(get(item, 'bonus_amount', 0))
  const showBonus = bonusAmount > 0
  const isSelectedForReturn = selectedReturnItems.some((e) => e?.id == item?.store_product_id)

  return (
    <Box display={'flex'} mb={'10px'} height={'68px'} justifyContent={'space-between'}>
      <Box
        borderRadius={'8px'}
        p={'8px 16px'}
        bgcolor={isSelectedForReturn ? 'red.50' : 'bg.10'}
        mr={showBonus ? '8px' : '0px'}
        display={'flex'}
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={isSelectedForReturn ? { border: '1px solid', borderColor: 'red.300' } : undefined}
      >
        <Box display={'flex'} width={'100%'} alignItems={'center'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
            }}
          >
            {!get(open, 'item.is_returned') && (
              <input
                onChange={(e) => selectReturnItem(e, item)}
                name='checkbox_zero'
                checked={isSelectedForReturn}
                className='customCheckbox'
                type='checkbox'
              />
            )}
          </Box>
          <Box display={'flex'} flexDirection={'column'} width={'100%'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={'8px'}>
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  wordWrap: 'break-word',
                  textOverflow: 'ellipsis',
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': '1',
                }}
                fontSize={'14px'}
                fontWeight={'700'}
                color={'bunker.950'}
              >
                {get(item, 'name')}
              </Typography>
              {isSelectedForReturn && (
                <Typography
                  sx={{
                    flexShrink: 0,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    bgcolor: 'red.600',
                    px: '8px',
                    py: '2px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('pos.return.item_badge')}
                </Typography>
              )}
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={'2px'}>
              <Typography fontSize={'12px'} fontWeight={'500'} color={'bunker.500'}>
                {get(item, 'barcode')}
              </Typography>
              <Typography fontSize={'13px'} fontWeight={'600'} color={'orange.500'}>
                {`${get(item, 'quantity') > 0 ? get(item, 'quantity') : '0'}${
                  get(item, 'unit_quantity') > 0 ? ` (${get(item, 'unit_quantity')}/${get(item, 'unit_per_pack')})` : ''
                } x `}
                {thousandDivider(get(item, 'unit_price'))} = {thousandDivider(get(item, 'total_price'), 'сум')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {showBonus && (
        <Box 
          borderRadius={'8px'} 
          p={'8px 12px'} 
          minWidth={'120px'} 
          bgcolor={'bg.10'} 
          display={'flex'} 
          flexDirection={'column'} 
          justifyContent={'center'}
        >
          <Typography fontSize={'12px'} fontWeight={'700'} color={'bunker.900'}>
            Бонус
          </Typography>
          <Box mt={'2px'} display={'flex'} justifyContent={'space-between'} width={'100%'}>
            <Typography fontSize={'11px'} fontWeight={'600'} color={'purple.500'}>
              {get(item, 'bonus_percent')}%
            </Typography>
            <Typography fontSize={'11px'} fontWeight={'600'} color={'purple.500'}>
              {thousandDivider(bonusAmount, 'сум')}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ReturnExchangeChildItemBox
