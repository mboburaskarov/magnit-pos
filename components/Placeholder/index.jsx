import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import StyledSwitch from '../Switch/StyledSwitch'
import PlusIcon from '../../src/assets/icons/PlusIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 64,
    borderRadius: 32,
    border: `1px dashed ${theme.palette.gray[300]}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: ({ isStickyToLeft }) => (isStickyToLeft ? 'sticky' : 'static'),
    left: ({ isStickyToLeft }) => (isStickyToLeft ? 0 : 'auto'),
    width: ({ width }) => width,
    minHeight: 281,
    // backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23333' stroke-width='4' stroke-dasharray='10' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`,
  },
  fullHeight: {
    height: '100%',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',

    '& > div': {
      flex: '1 1 50%',
      textAlign: 'center',
    },
    '& h3': {
      fontFamily: ({ desc }) => (desc ? 'Gilroy-Bold' : 'Inter'),
      fontWeight: '600',
      fontSize: '24px',
      maxWidth: 450,
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      color: theme.palette.gray[600],
      lineHeight: '28px',
    },
    '& p': {
      maxWidth: 530,
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      fontSize: '16px',
      lineHeight: '19px',
      color: theme.palette.gray[300],
      marginTop: 12,
    },
    '& > div:nth-child(2)': {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  },
  centered: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.blue[500],
    fontWeight: 600,
    marginTop: 55,
    '&:hover': {
      color: theme.palette.blue[500],
    },
  },
}))
function Placeholder({ title, desc, label, type = 'button', centered = true, boxStyle, fullHeight, className, width, isStickyToLeft, videoInstruction }) {
  const classes = useStyles({ isStickyToLeft, width, desc })
  const { t } = useTranslation()
  return (
    <Box className={`${classes.root} ${fullHeight ? classes.fullHeight : ''} ${className || ''}`} {...boxStyle}>
      <Box className={classes.inner}>
        <Box className={centered ? classes.centered : ''}>
          <Typography component='h3'>{t(title)}</Typography>
          <Typography component='p'>{t(desc)}</Typography>
          {videoInstruction && (
            <Link to='#' className={classes.link}>
              <Box mr={1}>
                <FontAwesomeIcon icon={faVideo} />
              </Box>
              {t('components.dontKnowWatchVideo')}
            </Link>
          )}
        </Box>
        {label && (
          <Box mt={4}>
            {type === 'button' && (
              <Button secondary adornmentStart={<PlusIcon fill='#4993DD' />}>
                {label}
              </Button>
            )}
            {type === 'switch' && <StyledSwitch />}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Placeholder
