import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { memo, useState } from 'react'

import ShortcutWrapper from '../ShortcutWrapper'
import { t } from 'i18next'

const ShortcutsDrawerArray = [
  {
    title: 'menu.sales.shortcuts.add_search',
    types: [
      {
        titleofshortcut: 'menu.sales.shortcuts.add_user',
        symbolofshortcut: ['U'],
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

      // {
      //   titleofshortcut: 'menu.sales.shortcuts.movement_in_search',
      //   symbolofshortcut: ['top', 'bottom'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.add',
      //   symbolofshortcut: ['Enter'],
      // },
    ],
  },
  {
    title: 'menu.sales.shortcuts.cart',
    types: [
      {
        titleofshortcut: 'menu.sales.shortcuts.add_draft',
        symbolofshortcut: ['Q'],
      },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.movement_in_cart',
      //   symbolofshortcut: ['top', 'bottom'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.change_count',
      //   symbolofshortcut: ['right', 'left'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.manual_discount',
      //   symbolofshortcut: ['S'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.delete',
      //   symbolofshortcut: ['D'],
      // },
    ],
  },
  // {
  //   title: 'menu.sales.shortcuts.add_client_discount',
  //   types: [
  //     // {
  //     //   titleofshortcut: 'menu.sales.shortcuts.add_client',
  //     //   symbolofshortcut: ['J'],
  //     // },
  //     // {
  //     //   titleofshortcut: 'menu.sales.shortcuts.check_discount',
  //     //   symbolofshortcut: ['K'],
  //     // },
  //     // {
  //     //   titleofshortcut: 'menu.sales.shortcuts.discount_type',
  //     //   symbolofshortcut: ['right', 'left'],
  //     // },
  //   ],
  // },
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

      // {
      //   titleofshortcut: 'menu.sales.shortcuts.payment_type',
      //   symbolofshortcut: ['L'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.cash',
      //   symbolofshortcut: ['F1'],
      // },
      // {
      //   titleofshortcut: 'menu.sales.shortcuts.cashless',
      //   symbolofshortcut: ['F2'],
      // },
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

function ShortcutsDrawer() {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Box
        className={classes.visibleFisrtBox}
        sx={{
          zIndex: !isOpen && 11,
          height: isOpen ? '90vh' : 72,
          padding: isOpen ? '40px' : '24px',
        }}
      >
        <Box className={classes.topOfBox}>
          <Box className={classes.leftSide}>
            {isOpen ? (
              <Typography variant='h1'>{'menu.sales.shortcuts.title'}</Typography>
            ) : (
              <>
                <Box className={classes.leftSideBox}>
                  <Typography>{'Открыть новую вкладку'}</Typography>
                  <ShortcutWrapper shortcut='T' margin='0 0 0 8px' />
                </Box>
                <Box className={classes.leftSideBox}>
                  <Typography>{'Открыть список черновиков'}</Typography>
                  <ShortcutWrapper shortcut='D' margin='0 0 0 8px' />
                </Box>
              </>
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
}

export default memo(ShortcutsDrawer)
