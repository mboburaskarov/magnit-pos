import { Box, Backdrop, ClickAwayListener, Popper, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& > button span span span svg': {
      marginLeft: ({ noMarginSvg }) => !noMarginSvg && 10,
    },
    '& > button': {
      borderRadius: ({ borderRadius }) => (borderRadius ? borderRadius : null),
    },
  },
  above: {
    position: 'relative',
    zIndex: 2001,
  },
  options: {
    background: theme.palette.background.default,
    color: theme.palette.grey[600],
    boxShadow: theme.boxShadow['16-8'],
    display: 'flex',
    marginTop: 10,
    minWidth: 300,
    flexDirection: 'column',
    overflow: 'hidden',
    // padding: ' 8px 16px',
    borderRadius: 24,
    '& > button': {
      backgroundColor: 'transparent',
      border: 0,
      display: 'flex',
      alignItems: 'center',
      height: 72,
      padding: '0 16px',
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
    },
    '& > button > span': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: 16,
      color: theme.palette.grey[600],
    },
    '& > button b': {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '19px',
    },
    '& > button > span span': {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '19px',
      color: theme.palette.grey[400],
    },
  },
  backdrop: {
    zIndex: 2000 + '! important',
  },
  popper: {
    zIndex: 2001 + '! important',
  },
}))

const ButtonWithPopup = ({
  id,
  popperData,
  buttonLabel,
  noArrow,
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
  const ref = useRef(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box style={boxStyles} className={classes.root} {...rest}>
      <Button
        id={id}
        color='secondary'
        buttonRef={ref}
        fullWidth
        size={size}
        style={{ maxWidth: size, minWidth: size }}
        disabled={disabled}
        onClick={(e) => {
          setAnchorEl(anchorEl ? null : e.currentTarget)
          if (onClick) onClick(e)
        }}
        className={!!anchorEl && classes.above}
        adornmentEnd={!noArrow && <FontAwesomeIcon icon={faChevronDown} />}
        {...buttonProps}
        isLoading={isLoading}
        endIcon={endIcon}
        sx={sx}
      >
        {buttonLabel}
      </Button>

      <Backdrop className={classes.backdrop} open={!!anchorEl} onClick={handleClose} />
      <Popper id={id} open={!!anchorEl} anchorEl={anchorEl} className={classes.popper} placement={placement || 'bottom-end'}>
        <ClickAwayListener onClickAway={() => setAnchorEl(false)}>
          <Box>
            {PopperContent ? (
              <PopperContent {...popperContentProps} close={() => setAnchorEl(false)} />
            ) : (
              <Box className={classes.options}>
                {popperData?.map(
                  (el, index) =>
                    el && (
                      <button
                        id={el?.id}
                        type='button'
                        key={index}
                        onClick={() => {
                          if (el.clickHandler) {
                            el.clickHandler()
                          }
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
