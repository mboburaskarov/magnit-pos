import { Box, Button, Skeleton, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { requests } from '@utils/requests'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import RightArrowIcon from '@/assets/icons/RightArrowIcon'
import './magnit-dashboard.css' // Import the MagnitGo CSS styles

export default function DashboardInfoBox({
  noDot,
  ind,
  title,
  icon,
  count: countProp,
  amount: amountProp,
  percent: percentProp,
  id,
  old,
  endText,
  withoutDivider,
  dashboard_filter,
  action,
  ...l
}) {
  const isSaleBox = ['sale_amount', 'sale_count', 'average_receipt'].includes(id)
  const isLoyaltyBox = ['total_loyalty_card_count', 'total_loyalty_card_balance', 'today_created_loyalty_card_count'].includes(id)
  const isNetProfit = ['income_amount', 'production_cost'].includes(id)
  const isImport = ['import_amount', 'not_last_24h_import_amount'].includes(id)
  const isProduct = [
    'total_product_count',
    'stock_total_amount',
    'expiring_soon_count',
    'expired_soon_count',
    'expiring_soon_amount',
    'expired_soon_amount',
  ].includes(id)
  const isEmployee = id === 'bonus_amount'
  const isTarget = id === 'target_amount'

  const queryKey =
    (isSaleBox && ['sale_stats', dashboard_filter]) ||
    (isLoyaltyBox && ['loyalty_card_stats', dashboard_filter]) ||
    (isNetProfit && ['net_profit_stats', dashboard_filter]) ||
    (isImport && ['import_stats', dashboard_filter]) ||
    (isProduct && ['product_stats', dashboard_filter]) ||
    (isEmployee && ['employee_stats', dashboard_filter]) ||
    (isTarget && ['target_stats', dashboard_filter]) ||
    null

  const { data: countStats, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isSaleBox) return requests.dashboradSaleStatistic(dashboard_filter)
      if (isLoyaltyBox) return requests.dashboradLoyaltyStatistic(dashboard_filter)
      if (isNetProfit) return requests.dashboradNetProfitStatistic(dashboard_filter)
      if (isImport) return requests.dashboradImportStatistic(dashboard_filter)
      if (isProduct) return requests.dashboradProductStatistic(dashboard_filter)
      if (isEmployee) return requests.dashboradEmployeeStatistic(dashboard_filter)
      if (isTarget) return requests.dashboardTargetStatistic(dashboard_filter)
      throw new Error('Unknown id')
    },
    enabled: !!queryKey,
  })

  let count = countStats?.data?.data?.[countProp]
  let before = countStats?.data?.data?.old
  
  if (id === 'average_receipt') {
    const sAmount = countStats?.data?.data?.sale_amount || 0;
    const sCount = countStats?.data?.data?.sale_count || 1;
    count = sAmount / sCount;
  }

  const amount = countStats?.data?.data?.[amountProp]
  const percent = percentProp?.(before, count)
  const isFall = percent < 0
  const income = countStats?.data?.data?.income_amount
  const total = countStats?.data?.data?.income_amount + countStats?.data?.data?.production_cost
  const productionCost = countStats?.data?.data?.production_cost
  
  const theme = l.theme || 'white'
  let cardClass = "mdash-kpi-card"
  if (theme !== 'white') cardClass += ` mdash-kpi-${theme}`
  
  let iconWrapStyle = undefined
  if (theme === 'white' && l.iconColor) {
    iconWrapStyle = { background: `${l.iconColor}1a`, color: l.iconColor }
  }

  const finalValue = withoutDivider ? Math.round(amount || 0) : Math.round(count || 0)
  
  return (
    <div className={cardClass} style={{ width: '100%', minHeight: '160px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="mdash-kpi-top">
        <div className="mdash-kpi-icon-wrap" style={iconWrapStyle}>
          {isLoading ? <Skeleton variant="circular" width={24} height={24} /> : icon}
        </div>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {percent !== undefined && percent !== null && !isNaN(percent) && (
            <div className={`mdash-kpi-badge ${isFall ? 'mdash-badge-red' : 'mdash-badge-green'}`}>
              {isFall ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
              {Math.abs(percent)}%
            </div>
          )}
          
          {action && (
            <button
              onClick={() => action(count, amount)}
              style={{
                width: '24px', height: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                color: 'var(--mg-text-muted)'
              }}
            >
              <RightArrowIcon style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
      </div>
      
      <div className="mdash-kpi-val">
        {isLoading ? (
           <Skeleton variant="text" width="60%" height={32} />
        ) : (
          <>
            {thousandDivider(finalValue, '')} {endText}
          </>
        )}
      </div>
      
      <div className="mdash-kpi-label">
        {isLoading ? (
          <Skeleton variant="text" width="80%" />
        ) : (
          title
        )}
      </div>
    </div>
  )
}
