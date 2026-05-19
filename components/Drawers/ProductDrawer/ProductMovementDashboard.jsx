import { useQueryParams } from '@/hooks/useQueryParams'
import { Download } from '@mui/icons-material'
import { Box, Skeleton, Typography } from '@mui/material'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import { error } from '@utils/toast'
import { get } from 'lodash'
import { useState } from 'react'
import { useMutation } from 'react-query'
export const formatCount = (reciveCount, unit_per_pack, canBeMinus = true) => {
  const count = canBeMinus ? reciveCount : Math.abs(reciveCount)
  if (!count || unit_per_pack <= 1 || count < unit_per_pack) return canBeMinus ? `${thousandDivider(count)}шт` : `${thousandDivider(count)}шт`
  const packs = canBeMinus ? Math.floor(count / unit_per_pack) : Math.floor(count / unit_per_pack)
  const pieces = canBeMinus ? count % unit_per_pack : Math.floor(count % unit_per_pack)
  let result = ''
  if (packs > 0) result += `${thousandDivider(packs)}уп`
  if (pieces > 0) result += ` ${thousandDivider(pieces)}шт`
  return result.trim()
}

function ProductMovementDashboard({ singleProductDashboard, productData, isLoading = true, unit_per_pack = 1 }) {
  const { values } = useQueryParams()

  const [collapse, setCollapse] = useState(false)

  const items = [
    {
      title: 'Импорты',
      collapseTitle: 'Импорты',
      countKey: 'import_count',
      amountKey: 'import_amount',
      variant: 'green',
    },
    {
      title: 'Возврат от клиента',
      collapseTitle: 'Возврат или продажи',
      countKey: 'return_sale_count',
      amountKey: 'return_sale_amount',
      variant: 'green',
    },
    {
      title: 'Перемещение',
      collapseTitle: 'Перемещение',
      countKey: 'transfer_in_count',
      amountKey: 'transfer_in_amount',
      variant: 'green',
    },
    {
      title: 'Инвентаризация',
      collapseTitle: 'Инвентаризация',
      countKey: 'inventory_plus_count',
      amountKey: 'inventory_plus_amount',
      variant: 'green',
    },

    {
      title: 'Возврат на склад',
      countKey: 'return_to_sklad_count',
      amountKey: 'return_to_sklad_amount',
      variant: 'red',
    },
    {
      title: 'Продажи',
      countKey: 'sale_count',
      amountKey: 'sale_amount',
      variant: 'red',
    },
    {
      title: 'Перемещение',
      countKey: 'transfer_out_count',
      amountKey: 'transfer_out_amount',
      variant: 'red',
    },
    {
      title: 'Инвентаризация',
      countKey: 'inventory_minus_count',
      amountKey: 'inventory_minus_amount',
      variant: 'red',
    },

    {
      title: 'Текущее',
      collapseTitle: 'Текущее',
      countKey: 'unit_quantity',
      amountKey: 'product_amount',
      variant: 'blue',
    },
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

  const filteredItems = collapse ? items.filter((i) => i.variant !== 'red' || i.title === 'Текущее') : items

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'green':
        return {
          bgcolor: '#F5FCF7',
          border: '1px solid #E3F5E7',
          textColor: '#1A7A3E',
          accentColor: '#1A7A3E',
        }
      case 'red':
        return {
          bgcolor: '#FFF5F5',
          border: '1px solid #FFE3E3',
          textColor: '#D32F2F',
          accentColor: '#D32F2F',
        }
      case 'blue':
      default:
        return {
          bgcolor: '#F3F6FF',
          border: '1px solid #E1E8FF',
          textColor: '#2B54E6',
          accentColor: '#2B54E6',
        }
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          mb: 1.5,
        }}
      >
        <Typography fontSize={'18px'} fontWeight={'700'} color={'#111217'}>
          Статистика движения
        </Typography>
        <Typography
          onClick={() => setCollapse((a) => !a)}
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            color: '#787D93',
            userSelect: 'none',
            '&:hover': { color: '#111217' },
          }}
        >
          {collapse ? 'Развернуть' : 'Свернуть'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridAutoRows: collapse ? '60px' : '100px',
          gap: '12px',
        }}
      >
        {filteredItems.map((item, index) => {
          const isLast = item.title === 'Текущее'
          const styles = getVariantStyles(item.variant)

          return (
            <Box
              key={index}
              sx={{
                gridRow: isLast && !collapse ? '1 / span 2' : 'auto',
                gridColumn: isLast ? '5' : 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '12px 16px',
                bgcolor: styles.bgcolor,
                border: styles.border,
                borderRadius: '16px',
                height: isLast && !collapse ? '100%' : '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                {isLoading ? (
                  <Skeleton width='60%' height={16} />
                ) : (
                  <Typography fontSize={12} lineHeight={'1.2'} color={'#787D93'} fontWeight={600} textTransform={'uppercase'} letterSpacing={'0.5px'}>
                    {collapse ? item.collapseTitle : item.title}
                  </Typography>
                )}
              </Box>

              {isLoading ? (
                <>
                  <Skeleton width='80%' height={28} sx={{ mt: '6px' }} />
                  <Skeleton width='50%' height={16} sx={{ mt: '4px' }} />
                </>
              ) : (
                <>
                  <Typography fontSize={22} mt={'6px'} lineHeight={'1.1'} fontWeight={700} color={styles.textColor}>
                    {formatCount(Math.abs(get(merged, item.countKey)) || 0, unit_per_pack)}
                  </Typography>

                  <Typography fontSize={13} mt={'2px'} lineHeight={'1.2'} color={styles.textColor} fontWeight={600}>
                    {thousandDivider(get(merged, item.amountKey), 'сум', true)}
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
