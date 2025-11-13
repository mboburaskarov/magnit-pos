import ArrowDown from '@/assets/icons/ArrowDown'
import ArrowUp from '@/assets/icons/ArrowUp'
import { Box, Collapse, IconButton, Skeleton, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { get } from 'lodash'
import { useState } from 'react'

function ProductMovementDashboard({ singleProductDashboard, isLoading = true, unit_per_pack = 1 }) {
  const [open, setOpen] = useState(false)

  const items = [
    { title: 'Импорты', color: 'green.700', countKey: 'import_count', amountKey: 'import_amount' },
    { title: 'Входящее перемещение', color: 'green.700', countKey: 'transfer_in_count', amountKey: 'transfer_in_amount' },
    { title: 'Возв от клиента', color: 'green.700', countKey: 'return_sale_count', amountKey: 'return_sale_amount' },
    { title: 'Продажи', color: 'red.700', countKey: 'sale_count', amountKey: 'sale_amount' },
    { title: 'Исходящее перемещение', color: 'red.700', countKey: 'transfer_out_count', amountKey: 'transfer_out_amount' },
    { title: 'Возв на склад', color: 'red.700', countKey: 'return_to_sklad_count', amountKey: 'return_to_sklad_amount' },
    { title: 'Текущее', color: 'indigo.600', countKey: 'unit_quantity', amountKey: 'product_amount' },
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
    <Box sx={{ padding: '10px 10px', bgcolor: 'bunker.100', borderRadius: '16px', m: '25px 35px 0px' }}>
      {/* Header with toggle button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography fontSize={16} fontWeight={700} color='bunker.700'>
          Статистика продукта
        </Typography>
        <IconButton onClick={() => setOpen(!open)} size='small'>
          {!open ? <ArrowDown color='#fe5000' /> : <ArrowUp color='#fe5000' />}
        </IconButton>
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '1fr',
            gap: '10px',
          }}
        >
          {/* first 6 items */}
          {items.slice(0, 6).map((item, index) => (
            <Box
              key={index}
              sx={{
                p: '5px 12px',
                borderRadius: '16px',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '90px',
                height: '90px',
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton width='50%' height={20} sx={{ mt: 1 }} />
                  <Skeleton width='60%' height={40} sx={{ mt: '5px', mb: '2px' }} />
                  <Skeleton width='40%' height={20} />
                </>
              ) : (
                <>
                  <Typography fontSize={14} mt={'5px'} lineHeight={'24px'} color={'bunker.600'} fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography fontSize={20} fontWeight={700} color={item.color}>
                    {formatCount(get(singleProductDashboard, item.countKey) || 0)}
                  </Typography>
                  <Typography fontSize={13} color={item.color} fontWeight={600}>
                    {thousandDivider(get(singleProductDashboard, item.amountKey), 'сум')}
                  </Typography>
                </>
              )}
            </Box>
          ))}

          {/* last item (tall one) */}
          <Box
            sx={{
              gridColumn: '4',
              gridRow: '1 / span 2', // spans two rows
              p: '5px 12px',
              borderRadius: '16px',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '190px',
            }}
          >
            {isLoading ? (
              <>
                <Skeleton width='50%' height={20} sx={{ mt: 1 }} />
                <Skeleton width='60%' height={40} sx={{ mt: '5px', mb: '2px' }} />
                <Skeleton width='40%' height={20} />
              </>
            ) : (
              <>
                <Typography fontSize={14} lineHeight={'24px'} color={'bunker.600'} fontWeight={600}>
                  {items[6].title}
                </Typography>
                <Typography fontSize={20} fontWeight={700} color={items[6].color}>
                  {formatCount(get(singleProductDashboard, items[6].countKey) || 0)}
                </Typography>
                <Typography fontSize={13} color={items[6].color} fontWeight={600}>
                  {thousandDivider(get(singleProductDashboard, items[6].amountKey), 'сум')}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

export default ProductMovementDashboard
