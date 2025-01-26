import React, { useState } from 'react'
import { Box, Paper, Button, List, ListItem, ClickAwayListener, Typography } from '@mui/material'
import SortIcon from '../../src/assets/icons/SortIcon'
import TickIcon from '../../src/assets/icons/TickIcon'
import { useTranslation } from 'react-i18next'
import event from '../../utils/event'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  lineSortContainer: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    width: '100%',
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: 16,
    zIndex: '20',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  lineSortList: {
    padding: 0,
    overflow: 'hidden',
  },
  lineSortItem: {
    background: 'inherit',
    border: '0',
    outline: '0',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px 16px',
    '&:hover': {
      background: theme.palette.gray[100],
    },
  },
}))
function RowFilterButton({ pageSize, setPageSize, setPageIndex, eventMessage, id }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const changePageSize = (opt) => {
    setPageSize(opt)
    setOpen(false)
    if (setPageIndex) setPageIndex(0)
    if (opt > pageSize) {
      if (eventMessage) event(eventMessage)
    }
  }

  return (
    <Box minWidth={196} position='relative'>
      <Button variant='contained' size='small' startIcon={<SortIcon />} fullWidth onClick={() => setOpen(!open)} id={id ? id : 'rowFilterButton'}>
        {t('menu.products.import.nav.show_by')} {pageSize}
      </Button>
      {open && (
        <Paper className={classes.lineSortContainer}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <List className={classes.lineSortList}>
              {[5, 10, 20, 30, 40, 50].map((opt) => (
                <ListItem key={opt} component='button' className={classes.lineSortItem} onClick={() => changePageSize(opt)}>
                  <Typography>
                    {opt} {t('menu.products.import.nav.lines')}
                  </Typography>
                  {opt === pageSize && <TickIcon />}
                </ListItem>
              ))}
            </List>
          </ClickAwayListener>
        </Paper>
      )}
    </Box>
  )
}

export default RowFilterButton
