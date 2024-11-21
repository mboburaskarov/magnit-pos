import { Fragment, memo, useLayoutEffect, useRef, useState } from 'react'
import { Typography, Box, Button, Container, IconButton } from '@mui/material'
import { createBrowserHistory } from 'history'
import { useSelector } from 'react-redux'
import BackArrowIcon from '../src/assets/icons/BackArrow'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import CheckAccess from './CheckAccess'

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
      color: theme.palette.grey[400],
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
      fill: theme.palette.grey[200],
    },
  },
  spanCard: {
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    minHeight: '48px',
    alignItems: 'center',
    minWidth: '128px',
    borderRadius: '32px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  spanCardTitle: {
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
          borderBottom: '2px solid',
          borderColor: '#3CA98F10',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
          py: 4,
          bgcolor: 'background.defaultStrong',
        }}
      >
        <Container>
          <header>
            <Box display='flex' width='100%' alignItems='center' justifyContent='space-between'>
              <Typography variant='h1' display='inline-flex' alignItems='center'>
                {backIcon && (
                  <IconButton color='primary' id={backButtonId} onClick={backButtonClickHandler} sx={{ mr: 2 }}>
                    <BackArrowIcon />
                    {backText && <Typography className={classes.spanCardTitle}>{backText}</Typography>}
                  </IconButton>
                )}

                <Box display='flex' flexDirection='column'>
                  <Typography sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: '48px' }} variant='h1'>
                    {typeText && (
                      <Typography mr={1} color='grey.400' variant='span'>
                        {typeText}
                      </Typography>
                    )}
                    {text}
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
                      <CheckAccess id={checkAccessId}>
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
                      </CheckAccess>
                    ) : (
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
      <Box mb={4} sx={{ height: headerComponentHeight + 'px', width: '100vw' }} />

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
      )}
    </Fragment>
  )
}
export default memo(Header)
