import { ArrowRightAltTwoTone } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import colors from '../../src/assets/theme/mui.config'
import useStyles from './useStyles'

export default function ReportBox({ type = 'menu.reports.report', title, desc, to, checkSlug, color }) {
  const { t } = useTranslation()
  const classes = useStyles({
    color,
  })

  return (
    <Box className={classes.report_box}>
      <Box>
        <Typography color='inherit'>{t(type)}</Typography>
        <span />
      </Box>
      <Typography variant='h4'>{title}</Typography>
      <Typography mb={'10px'}>{desc}</Typography>
      <Link to={to} checkSlug={checkSlug}>
        {t('menu.reports.go_to_report')} <ArrowRightAltTwoTone fill={colors.blue[500]} />
      </Link>
    </Box>
  )
}
