import { useState } from 'react'
import { Box, Paper, List, ListItem, ClickAwayListener, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import SortIcon from '../../src/assets/icons/SortIcon'
import TickIcon from '../../src/assets/icons/TickIcon'

const useStyles = makeStyles((theme) => ({
  lineSortContainer: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    width: '100%',
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 16,
    zIndex: '2',
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
      background: theme.palette.grey[100],
    },
  },
}))
function RowFilterButton({ offsetSize, setOffsetSize, setOffsetIndex, eventMessage, id }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const changeOffsetSize = (opt) => {
    setOffsetSize(opt)
    setOpen(false)
    if (setOffsetIndex) setOffsetIndex(0)
    if (opt > offsetSize) {
      if (eventMessage) event(eventMessage)
    }
  }

  return (
    <Box minWidth={196} position='relative'>
      <Button
        sx={(theme) => ({ background: theme.palette.background.default })}
        variant='outlined'
        size='small'
        startIcon={<SortIcon />}
        fullWidth
        onClick={() => setOpen(!open)}
        id={id ? id : 'rowFilterButton'}
      >
        Показать по {offsetSize}
      </Button>
      {open && (
        <Paper className={classes.lineSortContainer}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <List className={classes.lineSortList}>
              {[5, 10, 20, 30, 40, 50].map((opt) => (
                <ListItem key={opt} component='button' className={classes.lineSortItem} onClick={() => changeOffsetSize(opt)}>
                  <Typography>{opt} строк</Typography>
                  {opt === offsetSize && <TickIcon />}
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
