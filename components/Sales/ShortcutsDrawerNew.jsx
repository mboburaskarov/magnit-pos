import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ShortcutWrapper from '../ShortcutWrapper'

const ShortcutsDrawerArray = [
  {
    title: 'menu.sales.shortcuts.add_search',
    types: [
      {
        titleofshortcut: 'menu.sales.shortcuts.add_user',
        symbolofshortcut: ['K'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.open_new_tab',
        symbolofshortcut: ['T'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.change_shift',
        symbolofshortcut: ['A'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.open_draft',
        symbolofshortcut: ['D'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.close_draft',
        symbolofshortcut: ['esc'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.not_product',
        symbolofshortcut: ['F8'],
      },
    ],
  },
  {
    title: 'menu.sales.shortcuts.cart',
    types: [
      {
        titleofshortcut: 'menu.sales.shortcuts.add_draft',
        symbolofshortcut: ['Q'],
      },
    ],
  },

  {
    title: 'menu.sales.shortcuts.payment',
    types: [
      {
        titleofshortcut: 'menu.sales.shortcuts.payment_lite',
        symbolofshortcut: ['F10'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.payment_full',
        symbolofshortcut: ['F9'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.close_cash',
        symbolofshortcut: ['x'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.select_cash',
        symbolofshortcut: ['N'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.select_humo',
        symbolofshortcut: ['H'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.select_uzcard',
        symbolofshortcut: ['U'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.select_payme',
        symbolofshortcut: ['P'],
      },
      {
        titleofshortcut: 'menu.sales.shortcuts.select_click',
        symbolofshortcut: ['C'],
      },
    ],
  },
]

const useStyles = makeStyles((theme) => ({
  visibleFisrtBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    boxShadow: theme.boxShadow['16-8'],
    borderRadius: '24px 24px 0px 0px',
    background: theme.palette.background.default,
    zIndex: '19',
    bottom: 0,
    position: 'absolute',
    width: 'calc(100% - 40px)',
    transition: 'all 0.5s ease',
  },
  topOfBox: {
    width: 'calc(100% - 40px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  leftSide: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSideBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 24,
  },
  icon: {
    marginTop: -5,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.gray[50],
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.palette.gray[101],
    },
  },
  shortcutsBox: {
    width: '108%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shortcutInfoBox: {
    marginRight: 0,
    minHeight: 218,
    marginTop: '15px',
    width: '50%',
  },
  infoBoxTitle: {
    color: theme.palette.blue[500],
    fontWeight: 'bold',
    // fontFamily: 'Gilroy-Bold',
    fontSize: 18,
  },
  shortcutBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 17,
    '&:first-of-type': {
      marginTop: 26,
    },
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 18,
    cursor: 'pointer',
    background: theme.palette.black + '30',
  },
}))

const ShortcutsDrawerNew = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
    isOpen,
  }))
  return (
    <>
      <Box
        className={classes.visibleFisrtBox}
        sx={{
          zIndex: !isOpen && 11,
          height: isOpen ? '90vh' : 0,
          padding: isOpen ? '40px' : '0',
        }}
      >
        <Box className={classes.topOfBox}>
          <Box className={classes.leftSide}>
            {isOpen ? (
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                {t('menu.sales.shortcuts.title')}
              </Typography>
            ) : (
              <></>
            )}
          </Box>

          <Box onClick={() => setIsOpen(!isOpen)} className={classes.icon}>
            {isOpen ? <KeyboardArrowDown style={{ fontSize: '24px', fill: '#fe5000' }} /> : <KeyboardArrowUp style={{ fontSize: '24px', fill: '#fe5000' }} />}
          </Box>
        </Box>
        {isOpen && (
          <Box className={classes.shortcutsBox}>
            {ShortcutsDrawerArray.map((elm, ind) => (
              <Box className={classes.shortcutInfoBox} key={ind}>
                <Typography className={classes.infoBoxTitle}>{t(elm.title)}</Typography>

                {elm.types.map((el, index) => (
                  <Box key={index} className={classes.shortcutBox}>
                    <Typography className={classes.shortcutBoxTitle}>{t(el.titleofshortcut)}</Typography>
                    {el.symbolofshortcut.map((data, i) => (
                      <ShortcutWrapper key={i} margin='0 0 0 8px' shortcut={data} />
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {isOpen && <Box onClick={() => setIsOpen(false)} className={classes.background} />}
    </>
  )
})

export default memo(ShortcutsDrawerNew)
