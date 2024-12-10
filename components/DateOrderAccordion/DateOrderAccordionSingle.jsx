import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ExpandMoreIcon from '../../src/assets/icons/BottomArrowIcon'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import DateOrderAccordionItem from './DateOrderAccordionItem'
import DateHistoryAccordionItem from './DateHistoryAccordionItem'
import DateRepaymentAccordionItem from './DateRepaymentAccordionItem'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 !important',
  },
  heading: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > button': {
      zIndex: 2,
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: `1px solid ${theme.palette.gray[300]}`,
      background: theme.palette.background.default,
      marginLeft: 8,
      cursor: 'pointer',
    },
    '& > button svg': {
      transition: '0.3s',
    },
  },
  title: {
    zIndex: 2,
    padding: '6px 32px',
    lineHeight: '18px',
    background: theme.palette.background.default,
    fontSize: 16,
    borderRadius: 16,
    border: `1px solid ${theme.palette.gray[300]}`,
  },
  details: {
    padding: 0,
    '& > div': {
      width: '100%',
    },
  },
  expanded: {
    '& svg': {
      transform: 'rotate(180deg) translateY(2px)',
    },
  },
  border: {
    height: 2,
    borderTop: `2px dashed ${theme.palette.gray[200]}`,
    position: 'absolute',
    top: 'calc(50% - 1px)',
    width: '100%',
  },
}))
function DateOrderAccordionSingle({ list, defaultExpanded, setIsOpen, historyPage, repaymentPage, setOpen, setDebtId }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const cls = useStyles()

  return (
    <Accordion expanded={expanded} className={cls.root}>
      <AccordionSummary aria-controls='panel3bh-content' id='panel3bh-header'>
        <Typography id='accordion-date' className={cls.heading}>
          <Box className={cls.border} />
          <Box className={cls.title}>{dayjs(list?.date)?.tz()?.format('DD.MM.YYYY')}</Box>
          <button type='button' className={expanded && cls.expanded} onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon />
          </button>
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={cls.details}>
        <Box>
          {historyPage
            ? list?.items?.map((item, index) => <DateHistoryAccordionItem setIsOpen={setIsOpen} data={item} key={index} />)
            : repaymentPage
            ? list.data.map((item) => <DateRepaymentAccordionItem key={item.id} data={item} setOpen={setOpen} setDebtId={setDebtId} />)
            : list?.orders?.map((item, index) => <DateOrderAccordionItem setIsOpen={setIsOpen} data={item} key={index} />)}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default DateOrderAccordionSingle
