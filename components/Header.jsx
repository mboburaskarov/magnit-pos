import { Fragment, memo, useLayoutEffect, useRef, useState } from 'react'
import { Typography, Box, Button, Container, IconButton } from '@mui/material'
import { createBrowserHistory } from 'history'
import { useSelector } from 'react-redux'
import BackArrowIcon from '../src/assets/icons/BackArrow'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import CheckAccess from './CheckAccess'
import RightArrowSmallIcon from '../src/assets/icons/RightArrowSmallIcon'
import LeftArrowIcon from '../src/assets/icons/LeftArrow'

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'Gilroy',
    fontWeight: 'bold',
    '& a': {
      display: 'inline-flex',
      alignItems: 'center',
      marginRight: 16,
      fontFamily: 'Gilroy',
    },
    '& span': {
      color: theme.palette.gray[400],
      marginRight: 8,
      fontFamily: 'Gilroy',
      paddingRight: 10,
    },
  },
  largeButton: {
    minWidth: 128,
    '&:nth-last-of-type(1)': {
      marginLeft: 16,
    },
  },
  actions: {
    display: 'flex',
  },
  backButton: {
    borderRadius: '50%',
    border: 0,
    background: 'transparent',
    transition: 'all 0.3s ease',
    '&:hover circle': {
      fill: theme.palette.gray[200],
    },
  },
  spanCard: {
    backgroundColor: theme.palette.gray[100],
    display: 'flex',
    minHeight: '48px',
    alignItems: 'center',
    minWidth: '128px',
    borderRadius: '32px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.gray[200],
    },
  },
  spanHEaderText: {
    fontSize: '32px',
    lineHeight: '48px',
    fontWeight: '700 !important',
    paddingRight: 10,
  },
}))

function Header({
  buttonId,
  backButtonId,
  backText,
  formId,
  backHref,
  noActions,
  backIcon,
  disabled,
  typeText,
  isLoading,
  cancel,
  fullWidth,
  cancelButtonLabel,
  noCancel = true,
  text,
  buttonText = 'Применить',
  backButtonClick,
  customButton,
  noPrimaryBtn,
  onSubmit,
  bottomComponent,
  bottomComponentStyles = () => {},
  description,
  historyBack,
  checkAccessId,
}) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const navigate = useNavigate()
  const classes = useStyles({ fullWidth, isOpen })
  const history = createBrowserHistory()
  const headerComponentRef = useRef()
  const [headerComponentHeight, setHeaderComponentHeight] = useState(0)

  useLayoutEffect(() => {
    setHeaderComponentHeight(headerComponentRef.current?.clientHeight || 0)
  }, [])

  const backButtonClickHandler = (e) => {
    if (backButtonClick) {
      backButtonClick(e)
      return
    }
    if (historyBack) {
      history.back()
      return
    }
    if (backHref) {
      navigate(backHref)
      return
    }
  }
  return (
    <Fragment>
      <Box
        ref={headerComponentRef}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '88px',
          padding: '20px',
          borderBottom: '2px solid',
          borderColor: 'bunker.100',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
          py: 4,
          bgcolor: 'white',
        }}
      >
        <Container>
          <header>
            <Box display='flex' width='100%' alignItems='center' justifyContent='space-between'>
              <Typography variant='h1' display='inline-flex' alignItems='center'>
                {backIcon && (
                  <IconButton color='primary' id={backButtonId} onClick={backButtonClickHandler} sx={{ mr: 2, p: '0', backgroundColor: '#fff' }}>
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: 'bunker.100',
                      }}
                    >
                      <LeftArrowIcon />
                    </Box>
                    {backText && <Typography className={classes.spanCardTitle}>{backText}</Typography>}
                  </IconButton>
                )}

                <Box display='flex' flexDirection='column'>
                  <Typography sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: '48px' }} variant='h1'>
                    {typeText && (
                      <Typography mr={1} color='gray.400' variant='span'>
                        {typeText}
                      </Typography>
                    )}
                    <Typography className={classes.spanHEaderText}>{text}</Typography>
                  </Typography>
                  {description && <Typography color='textSecondary'>{description}</Typography>}
                </Box>
              </Typography>
              {!noActions && (
                <Box display='flex' className={classes.actions}>
                  {!noCancel && (
                    <Button variant='contained' type='button' size='small' className={classes.largeButton} onClick={cancel} disabled={disabled} color='error'>
                      {cancelButtonLabel || 'Сбросить'}
                    </Button>
                  )}
                  {!noPrimaryBtn &&
                    (checkAccessId && typeof checkAccessId === 'string' ? (
                      // <CheckAccess id={checkAccessId}>
                      <Button
                        id={buttonId}
                        variant='contained'
                        className={classes.largeButton}
                        type='submit'
                        size='small'
                        form={formId}
                        disabled={disabled}
                        isLoading={isLoading}
                        onClick={onSubmit}
                        sx={{ ml: 1.5 }}
                      >
                        {buttonText}
                      </Button>
                    ) : (
                      // </CheckAccess>
                      <Button
                        id={buttonId}
                        variant='contained'
                        className={classes.largeButton}
                        type='submit'
                        size='small'
                        form={formId}
                        disabled={disabled}
                        isLoading={isLoading}
                        onClick={onSubmit}
                        sx={{ ml: 1.5 }}
                      >
                        {buttonText}
                      </Button>
                    ))}
                  {customButton}
                </Box>
              )}
            </Box>
          </header>
        </Container>
      </Box>
      <Box mb={4} sx={{ height: headerComponentHeight + 'px' }} />
      {/* <Box mb={4} sx={{ height: headerComponentHeight + 'px', width: '100vw' }} />

      {bottomComponent ? (
        <Box
          position='fixed'
          sx={(theme) => ({
            left: '0',
            top: 114,
            zIndex: 999,
            width: '100%',
            ...bottomComponentStyles(theme),
          })}
        >
          <Box px={18}>{bottomComponent}</Box>
        </Box>
      ) : (
        ''
      )} */}
    </Fragment>
  )
}
export default memo(Header)
