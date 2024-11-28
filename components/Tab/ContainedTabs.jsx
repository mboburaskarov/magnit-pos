import { Box } from '@mui/material'
import Button from 'stories/Button/Button'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: 4,
    backgroundColor: theme.palette.gray[100],
  },
  tab: {
    flex: '0 0 50%',
    height: 48,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '19px',
    color: theme.palette.gray[600],
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  active: {
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.boxShadow['16-8'],
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.boxShadow['16-8'],
    },
  },
}))

export default function ContainedTabs({ items = [], tab, setTab }) {
  const cls = useStyles()
  const { t } = useTranslation()
  return (
    <Box className={cls.root}>
      {items?.map((item) => (
        <Button key={item?.id} onClick={() => setTab(item.id)} className={`${item.id === tab && cls.active} ${cls.tab}`}>
          {t(item.name)}
        </Button>
      ))}
    </Box>
  )
}
