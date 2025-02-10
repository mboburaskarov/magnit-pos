import { makeStyles, useTheme } from '@mui/styles'
import { Box, Drawer, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '../src/assets/icons/CloseIcon'
import BackArrowIcon from '../src/assets/icons/BackArrow'
import { LoadingButton } from '@mui/lab'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      padding: (props) => (props.sticky ? '0' : props.anchor === 'right' ? '64px 0' : '64px'),
      overflowY: (props) => props?.overflowY,
      height: (props) =>
        props.height ? props.height : props?.half ? '65vh' : `calc(100% - ${props?.fullHeight ? '0' : props?.topOffset || props?.bottomOffset || '64px'})`,
      width: (props) =>
        props.width ? props.width : `calc(100% - ${props?.half ? '40%' : props?.fullWidth ? '0' : props.leftOffset || props.rightOffset || '64px'})`,
      borderRadius: (props) =>
        props.anchor === 'bottom'
          ? '64px 64px 0 0'
          : props.anchor === 'top'
          ? '0 0 64px 64px'
          : props.anchor === 'left'
          ? ' 0 64px 64px 0'
          : props.anchor === 'right'
          ? '64px 0 0 64px'
          : '0px',
      backgroundColor: theme.palette.background.default,
    },
  },
  top: {
    '& .MuiDrawer-paper': {
      borderRadius: '0 0 64px 64px',
    },
  },
  bottom: {
    '& .MuiDrawer-paper': {
      borderRadius: '64px 64px 0 0',
    },
  },
  left: {
    '& .MuiDrawer-paper': {
      borderRadius: '0 64px 64px 0',
    },
  },
  right: {
    '& .MuiDrawer-paper': {
      borderRadius: '64px 0 0 64px',
    },
  },
  wrapper: {
    width: '100%',
    margin: '0 auto',
  },

  sticky: {
    position: 'sticky',
    top: 0,
    paddingTop: 64,
    backgroundColor: theme.palette.background.default,
    zIndex: 100,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    borderBottom: ({ headerBorderBottom }) => (headerBorderBottom ? `2px solid ${theme.palette.gray[200]}` : 'none'),
    paddingBottom: ({ headerBorderBottom, sticky }) => (headerBorderBottom ? `32px` : sticky ? '20px' : '0'),
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  noHeaderMargin: {
    marginBottom: 0,
  },
  backButton: {
    background: theme.palette.gray[100] + ' !important',
    borderRadius: '32px !important',
    marginRight: '16px !important',
    minWidth: '48px !important',
    height: '48px !important',

    '&:hover': {
      background: theme.palette.gray[101] + ' !important',
    },
  },
}))
function SectionDrawer({
  title,
  backButtonLabel,
  onNextButtonClick,
  nextButtonLabel = 'dashboard.next',
  open,
  closeDrawer,
  width,
  height,
  half,
  topOffset,
  bottomOffset,
  noNextButton,
  leftOffset,
  rightOffset,
  fullWidth,
  fullHeight,
  children,
  noBackIcon,
  closeIcon,
  anchor = 'bottom',
  overflowY = 'scroll',
  disabled,
  nextButtonEndAdornment,
  sticky,
  noHeaderMargin,
  headerBorderBottom,
  formId,
  isLoading,
  setDrawerRef,
  customButton,
  id,
  CustomTitleComponent,
}) {
  const classes = useStyles({
    anchor,
    width,
    height,
    half,
    fullWidth,
    fullHeight,
    topOffset,
    bottomOffset,
    overflowY,
    leftOffset,
    rightOffset,
    sticky,
    headerBorderBottom,
  })
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      anchor={anchor}
      elevation={1}
      ref={(ref) => {
        if (setDrawerRef) setDrawerRef(ref)
      }}
      className={`${classes.drawer} ${classes?.[anchor]}`}
      disableEscapeKeyDown
      disableScrollLock
    >
      <Box>
        <Box pl={10} pr={10} className={`${classes?.header} ${noHeaderMargin ? classes.noHeaderMargin : ''} ${sticky && classes.sticky}`}>
          <Box>
            {!noBackIcon && (
              <Button
                id={id && `back-button-${id}`}
                className={`${classes?.backButton}`}
                icon={!backButtonLabel}
                type='button'
                onClick={() => {
                  if (closeDrawer) {
                    closeDrawer()
                  }
                }}
              >
                <BackArrowIcon style={{ fill: '#4993DD' }} />
                {backButtonLabel && <Typography sx={{ whiteSpace: 'nowrap', marginLeft: 2 }}>{backButtonLabel}</Typography>}
              </Button>
            )}
            {CustomTitleComponent ? (
              <CustomTitleComponent />
            ) : (
              <Typography
                id={`title-${id}`}
                sx={(theme) => ({
                  fontFamily: `"Gilroy-Bold", sans-serif`,
                  fontSize: 36,
                  lineHeight: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.black,
                })}
              >
                {t(title)}
              </Typography>
            )}
          </Box>
          {customButton ||
            (!noNextButton && (
              <Box>
                <LoadingButton
                  id={id && `create-${id}`}
                  adornmentEnd={nextButtonEndAdornment}
                  disabled={disabled}
                  primary={!closeIcon}
                  variant='contained'
                  icon={closeIcon}
                  loading={isLoading}
                  type={formId ? 'submit' : ''}
                  form={formId}
                  isLoading={isLoading}
                  onClick={() => {
                    if (closeIcon) {
                      closeDrawer()
                    } else if (onNextButtonClick) {
                      onNextButtonClick()
                    }
                  }}
                  style={{
                    height: 48,
                    minWidth: closeIcon ? 0 : 196,
                    borderRadius: closeIcon && '50%',
                    backgroundColor: closeIcon && 'transparent',
                  }}
                >
                  {closeIcon ? <CloseIcon color={theme.palette.black} /> : t(nextButtonLabel)}
                </LoadingButton>
              </Box>
            ))}
        </Box>
        <Box pl={10} pr={10} className={classes.wrapper}>
          {children}
        </Box>
      </Box>
    </Drawer>
  )
}

export default SectionDrawer
