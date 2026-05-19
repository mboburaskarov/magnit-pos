import { Box, Button, ClickAwayListener, List, ListItem, Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowDown from '../../src/assets/icons/ArrowDown'
import TickIcon from '../../src/assets/icons/TickIcon'

const useStyles = makeStyles((theme) => ({
  lineSortContainer: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    width: '100%',
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: 8,
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
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '20px',
    display: 'flex',
    py: '4px',
    justifyContent: 'space-between',
    '&:hover': {
      background: theme.palette.gray[100],
    },
  },
}))
function RowFilterButton({ totalCount, offsetSize, setOffsetSize, setOffsetIndex, eventMessage, id }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  function buildList(steps, totalCount) {
    const result = steps.filter((step) => step <= totalCount)

    if (!result.includes(totalCount)) {
      result.push(totalCount)
    }

    return result
  }

  const changeOffsetSize = (opt) => {
    setOffsetSize(opt)
    setOpen(false)
    if (setOffsetIndex) setOffsetIndex(0)
    if (opt > offsetSize) {
      if (eventMessage) event(eventMessage)
    }
  }

  return (
    <Box borderRadius={'8px'} minWidth={75} display={'flex'} alignItems={'center'} position='relative'>
      <Typography
        sx={{
          color: '#9CA3AF',
          mr: '8px',
          userSelect: 'none',
          fontFamily: 'Gilroy, sans-serif',
        }}
      >
        {t('ag_grid.bottom.limit')}
      </Typography>
      <Button
        sx={{
          height: '38px',
          minWidth: '64px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          fontSize: '14px',
          fontWeight: '500',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            borderColor: '#CBD5E1',
            boxShadow: 'none',
          },
        }}
        variant='text'
        size='small'
        onClick={() => setOpen(!open)}
        id={id ? id : 'rowFilterButton'}
      >
        <span style={{ marginRight: '6px' }}>{offsetSize}</span>
        <ArrowDown color='#9CA3AF' />
      </Button>
      {open && (
        <Paper className={classes.lineSortContainer}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <List className={classes.lineSortList}>
              {buildList([5, 10, 50], totalCount <= 100 ? totalCount : 100).map((opt) => (
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
