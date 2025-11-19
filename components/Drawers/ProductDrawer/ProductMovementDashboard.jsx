import { Box, Skeleton, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { get } from 'lodash'
import { useState } from 'react'
export const formatCount = (count, unit_per_pack, canBeMinus = true) => {
  if (!count || unit_per_pack <= 1) return `${thousandDivider(count)} шт`
  const packs = canBeMinus ? Math.floor(count / unit_per_pack) : Math.abs(Math.floor(count / unit_per_pack))
  const pieces = canBeMinus ? count % unit_per_pack : Math.abs(Math.floor(count % unit_per_pack))
  let result = ''
  if (packs > 0) result += `${thousandDivider(packs)}уп`
  if (pieces > 0) result += ` ${thousandDivider(pieces)}шт`
  return result.trim()
}
function ProductMovementDashboard({ singleProductDashboard, isLoading = true, unit_per_pack = 1 }) {
  const [collapse, setCollapse] = useState(true)

  const items = [
    { title: 'Импорты', collapseTitle: 'Импорты', color: 'green.700', countKey: 'import_count', amountKey: 'import_amount' },
    { title: 'Возврат от клиента ', collapseTitle: 'Возврат или продажи', color: 'green.700', countKey: 'return_sale_count', amountKey: 'return_sale_amount' },
    { title: 'Перемещение', collapseTitle: 'Перемещение', color: 'green.700', countKey: 'transfer_in_count', amountKey: 'transfer_in_amount' },
    { title: 'Инвентаризация', collapseTitle: 'Инвентаризация', color: 'green.700', countKey: 'inventory_plus_count', amountKey: 'inventory_plus_amount' },

    { title: 'Возврат на склад', color: 'red.700', countKey: 'return_to_sklad_count', amountKey: 'return_to_sklad_amount' },
    { title: 'Продажи', color: 'red.700', countKey: 'sale_count', amountKey: 'sale_amount' },
    { title: 'Перемещение', color: 'red.700', countKey: 'transfer_out_count', amountKey: 'transfer_out_amount' },
    { title: 'Инвентаризация', color: 'red.700', countKey: 'inventory_minus_count', amountKey: 'inventory_minus_amount' },

    { title: 'Текущее', collapseTitle: 'Текущее', color: 'indigo.600', countKey: 'unit_quantity', amountKey: 'product_amount' },
  ]

  const merged = { ...singleProductDashboard }

  if (collapse) {
    merged.import_count += merged.return_to_sklad_count || 0
    merged.import_amount += merged.return_to_sklad_amount || 0

    merged.return_sale_count += merged.sale_count || 0
    merged.return_sale_amount += merged.sale_amount || 0

    merged.transfer_in_count += merged.transfer_out_count || 0
    merged.transfer_in_amount += merged.transfer_out_amount || 0

    merged.inventory_plus_count += merged.inventory_minus_count || 0
    merged.inventory_plus_amount += merged.inventory_minus_amount || 0
  }

  const filteredItems = collapse ? items.filter((i) => i.color !== 'red.700' || i.title === 'Текущее') : items

  return (
    <Box>
      <Typography
        textAlign={'end'}
        onClick={() => setCollapse((a) => !a)}
        sx={{ mb: 1, cursor: 'pointer', fontWeight: 600, fontSize: '17px', color: 'gray.700', userSelect: 'none', padding: '10px 40px 0 0' }}
      >
        {collapse ? 'Еще' : 'Меньше'}
      </Typography>

      <Box
        sx={{
          padding: '10px 35px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridAutoRows: collapse ? '45px' : '90px',
          gap: '10px',
        }}
      >
        {filteredItems.map((item, index) => {
          const isLast = item.title === 'Текущее'

          return (
            <Box
              key={index}
              sx={{
                gridRow: isLast ? '1 / span 2' : 'auto',
                gridColumn: isLast ? '5' : 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isLast && !collapse ? 'center' : 'flex-start',
                alignItems: isLast && !collapse ? 'center' : 'flex-start',
                padding: '5px 12px',
                bgcolor: 'bg.10',
                borderRadius: '16px',
                height: isLast && !collapse ? 'auto' : '90px',
                maxHeight: isLast && !collapse ? 'auto' : '90px',
              }}
            >
              <Box sx={{ width: '100%' }}>
                {isLoading ? (
                  <Skeleton width='50%' height={20} sx={{ mt: 1 }} />
                ) : (
                  <Typography
                    fontSize={14}
                    textAlign={isLast && !collapse ? 'center' : 'start'}
                    mt={'5px'}
                    lineHeight={'24px'}
                    color={'bunker.600'}
                    fontWeight={600}
                  >
                    {collapse ? item.collapseTitle : item.title}
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
                  <Typography
                    fontSize={20}
                    m={'5px 0 2px'}
                    display={'flex'}
                    alignItems={'flex-end'}
                    fontWeight={700}
                    color={get(merged, item.countKey) >= 0 ? item.color : 'red.700'}
                  >
                    {formatCount(Math.abs(get(merged, item.countKey)) || 0, unit_per_pack)}
                  </Typography>

                  <Typography fontSize={13} ml={'3px'} lineHeight={'24px'} color={get(merged, item.countKey) >= 0 ? item.color : 'red.700'} fontWeight={600}>
                    {thousandDivider(get(merged, item.amountKey), 'сум')}
                  </Typography>
                </>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default ProductMovementDashboard
