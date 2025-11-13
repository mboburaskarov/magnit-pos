import { Box, Grid, Skeleton, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { get } from 'lodash'

function ProductMovementDashboard({ singleProductDashboard, isLoading = true, unit_per_pack = 1 }) {
  const items = [
    { title: 'Импорты', color: 'green.700', bgColor: 'bunker.400', countKey: 'import_count', amountKey: 'import_amount' },
    { title: 'Трансфер', color: 'green.700', bgColor: 'bunker.400', countKey: 'transfer_in_count', amountKey: 'transfer_in_amount' },
    { title: 'Возврат', color: 'green.700', bgColor: 'bunker.400', countKey: 'return_sale_count', amountKey: 'return_sale_amount' },
    { title: 'Продажи', color: 'red.700', bgColor: 'bunker.400', countKey: 'sale_count', amountKey: 'sale_amount' },
    { title: 'Трансфер', color: 'red.700', bgColor: 'bunker.400', countKey: 'transfer_out_count', amountKey: 'transfer_out_amount' },
    { title: 'На склад', color: 'red.700', bgColor: 'bunker.400', countKey: 'return_to_sklad_count', amountKey: 'return_to_sklad_amount' },
    { title: 'Текущее', color: 'indigo.600', bgColor: 'bunker.400', countKey: 'unit_quantity', amountKey: 'product_amount' },
  ]

  const formatCount = (count) => {
    if (!count || unit_per_pack <= 1) return `${thousandDivider(count)} шт`
    const packs = Math.floor(count / unit_per_pack)
    const pieces = count % unit_per_pack
    let result = ''
    if (packs > 0) result += `${thousandDivider(packs)}уп`
    if (pieces > 0) result += ` ${thousandDivider(pieces)}шт`
    return result.trim()
  }

  return (
    <Box sx={{ padding: '10px 35px' }}>
      <Grid container spacing={'10px'}>
        {items.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={3} lg={1.7}>
            <Box
              sx={{
                maxHeight: '100px',
                display: 'flex',
                alignItems: 'start',
                flexDirection: 'column',
                padding: '5px 12px 5px',
                borderRadius: '16px',
                border: '1px dashed',
                borderColor: 'gray.300',
                bgcolor: 'background.paper',
                boxShadow: '0px 0px 19px 4px rgb(0 0 0 / 5%)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {isLoading ? (
                  <Skeleton width='50%' height={20} sx={{ mt: 1 }} />
                ) : (
                  <Typography fontSize={14} mt={'5px'} lineHeight={'24px'} color={'bunker.600'} fontWeight={600}>
                    {item.title}
                  </Typography>
                )}
              </Box>

              {isLoading ? (
                <>
                  <Skeleton width='60%' height={40} sx={{ mt: '5px', mb: '2px' }} />
                  <Skeleton width='40%' height={20} />
                </>
              ) : (
                <>
                  <Typography fontSize={20} m={'5px 0 2px'} display={'flex'} alignItems={'flex-end'} fontWeight={700} color={item.color}>
                    {formatCount(get(singleProductDashboard, item.countKey) || 0)}
                  </Typography>

                  <Typography fontSize={13} ml={'3px'} lineHeight={'24px'} color={item.color} fontWeight={600}>
                    {thousandDivider(get(singleProductDashboard, item.amountKey), 'сум')}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductMovementDashboard
