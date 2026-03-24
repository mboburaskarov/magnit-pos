import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get, head } from 'lodash'
import thousandDivider from '@utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '12px 12px 12px 16px',
    boxShadow: theme.boxShadow['32-12'],
    borderRadius: 10,
    textAlign: 'center',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 400,
    width: '100%',
    color: theme.palette.gray[500],
    height: 48,
    marginBottom: 4,
    borderRadius: 32,
  },
  total_price: {
    fontSize: 24,
    lineHeight: '36px',
    fontWeight: 600,
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.dark[500],
  },
  point: {
    display: 'block',
    width: 16,
    height: 16,
    borderRadius: '50%',
  },
  total_price_small: {
    marginTop: 4,
    color: theme.palette.dark[500],
  },
}))

export default function DashboardTooltip({ active, payload, label, isMultiLine, selectedShops, detalization, measurmentUnit }) {
  const classes = useStyles()

  const isActiveLineChart = (shop) => {
    if (selectedShops.length === 0) {
      return true
    }
    return !!selectedShops.find((item) => item.shop_name === shop.name)
  }

  if (active && payload && payload.length) {
    return (
      <div className={classes.root}>
        <div className={classes.label}>
          <Typography>
            {detalization?.value === 'hour' || detalization?.value === '30min'
              ? // ? label
                `${dayjs(get(head(payload), 'payload.id')).format('DD.MM.YYYY | HH:mm')} `
              : detalization?.value === 'week'
              ? `${dayjs(label, 'DD.MM.YYYY | HH:mm').format('DD.MM.YYYY')} - ${dayjs(label, 'DD.MM.YYYY | HH:mm').day(7).format('DD.MM.YYYY')}`
              : detalization?.value === 'month'
              ? `${dayjs(label, 'DD.MM.YYYY | HH:mm').format('DD.MM.YYYY')} - ${dayjs(label, 'DD.MM.YYYY | HH:mm').endOf('month').format('DD.MM.YYYY')}`
              : dayjs(label, 'DD.MM.YYYY | HH:mm').format('DD.MM.YYYY')}
          </Typography>
        </div>
        {isMultiLine ? (
          <Box display='flex' flexWrap='wrap'>
            {payload
              ?.sort((a, b) => {
                const aSize = +a.value
                const bSize = +b.value
                if (aSize < bSize) {
                  return 1
                }
                if (aSize > bSize) {
                  return -1
                }
                return 0
              })
              .map((item, index) => (
                <Box flex='0 0 50%' display='flex' alignItems='center' textAlign='left' mt={index > 1 ? 3 : 0} hidden={!isActiveLineChart(item)} key={index}>
                  <div
                    className={classes.point}
                    style={{
                      background: 'red',
                    }}
                  />
                  <Box ml={2}>
                    <Typography>{item.name}</Typography>
                    <Typography className={classes.total_price_small}>
                      {thousandDivider(item.value)} {measurmentUnit || 'шт'}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
        ) : (
          <Typography className={classes.total_price}>
            {thousandDivider(payload[0].value)} {measurmentUnit || 'шт'}
          </Typography>
        )}
      </div>
    )
  }

  return null
}
