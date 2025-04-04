import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Backdrop, Box, Button, ClickAwayListener, Popper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .MuiButton-endIcon': {
      marginRight: '10px !important',
    },
    '& .cash_register_icon_wrapper:hover': {
      backgroundColor: theme.palette.gray[100],
    },
    '& > button span span span svg': {
      marginLeft: ({ noMarginSvg }) => (!noMarginSvg ? 10 : 0),
    },
  },
  above: {
    zIndex: 2001,
  },
  options: {
    background: theme.palette.background.default,
    color: theme.palette.gray[600],
    boxShadow: theme.boxShadow['16-8'],
    display: 'flex',
    marginTop: 10,
    minWidth: 300,
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 12,
    '& > button': {
      backgroundColor: 'transparent',
      border: 0,
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px',
      cursor: 'pointer',
      position: 'relative',
      '&:hover': {
        backgroundColor: theme.palette.gray[100],
      },
    },
    '& > button > span': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: 16,
      fontWeight: 500,
      fontSize: 18,
      lineHeight: '28px',
      color: theme.palette.bunker[950],
    },
    '& > .soon > span > b': {
      color: '#0000006e',
    },
  },
  backdrop: {
    zIndex: 2000,
  },
  popper: {
    zIndex: 2001,
  },
}))

const ButtonWithPopup = ({
  id,
  popperData,
  buttonLabel,
  noArrow,
  popperStyle,
  size,
  PopperContent,
  popperContentProps,
  onClick,
  buttonProps,
  disabled,
  placement,
  isLoading,
  noMarginSvg,
  boxStyles,
  borderRadius,
  sx,
  endIcon,
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles({ noMarginSvg, borderRadius })

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box style={boxStyles} className={classes.root} {...rest}>
      <Button
        id={id}
        color='secondary'
        size={size}
        disabled={disabled}
        onClick={(e) => {
          setAnchorEl(anchorEl ? null : e.currentTarget)
          if (onClick) onClick(e)
        }}
        className={anchorEl ? classes.above : ''}
        endIcon={endIcon || (!noArrow && <FontAwesomeIcon icon={faChevronDown} />)}
        sx={sx}
        {...buttonProps}
      >
        {buttonLabel}
      </Button>

      {/* Backdrop for popper */}
      <Backdrop className={classes.backdrop} open={!!anchorEl} onClick={handleClose} />

      {/* Popper Content */}
      <Popper sx={popperStyle} id={id} open={!!anchorEl} anchorEl={anchorEl} className={classes.popper} placement={placement || 'bottom-end'}>
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            {PopperContent ? (
              <PopperContent {...popperContentProps} close={handleClose} />
            ) : (
              <Box className={classes.options}>
                {popperData?.map(
                  (el, index) =>
                    el && (
                      <button
                        key={index}
                        className={el?.soon ? 'soon' : ''}
                        id={el?.id}
                        type='button'
                        onClick={() => {
                          if (el?.soon) return
                          if (el.clickHandler) el.clickHandler()
                          handleClose()
                        }}
                      >
                        {el.icon}
                        <span>
                          <b>{el.title}</b>
                          <span>{el.desc}</span>
                        </span>
                      </button>
                    )
                )}
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}

export default ButtonWithPopup
