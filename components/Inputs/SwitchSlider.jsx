import { useEffect, useState } from 'react'
import { Box, Tooltip, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  inner: {
    display: 'flex',
    // justifyContent: 'space-between',
    padding: 4,
    borderRadius: 24,
    width: 'fit-content',
    background: theme.palette.gray[50],
    transition: 'all 0.2s ease',
    '&:hover': {
      background: theme.palette.gray[50],
    },
  },
  slider: {
    position: 'relative',
    height: 40,
    '&:first-child': {
      marginLeft: '0px',
    },
    marginLeft: '4px',
    // width: '100%',
  },
  input: {
    visibility: 'hidden',
    width: 0,
    margin: 0,
    '&:checked + .radioButton': {
      boxShadow: theme.boxShadow['16-8'],
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    // position: 'absolute',
    display: 'inline-flex',
    width: '100%',
    alignItems: 'center',
    height: '100%',
    padding: '0 16px',
    borderRadius: 23,
    textAlign: 'left',
    cursor: 'pointer',
    transition: '0.3s',
  },
  radioTitle: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}))

export default function SwitchSlider({ name, options, onChange, defaultValue, noMarginTop, style, error, value: controlledValue, uncontrolled, disabled }) {
  const classes = useStyles({ noMarginTop })
  const [value, setValue] = useState(!!defaultValue && defaultValue)

  useEffect(() => {
    if (uncontrolled && onChange) {
      onChange(value)
    }
  }, [value])

  useEffect(() => {
    if (typeof controlledValue !== 'boolean') {
      setValue(controlledValue)
    }
  }, [controlledValue])

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [])

  return (
    options?.length !== 0 && (
      <Box style={style} sx={{ width: '100%', marginTop: !noMarginTop && 2, borderRadius: 4, boxShadow: error && '0 0 0 2px red' }}>
        <Box className={classes.inner}>
          {options.map((option, index) => (
            <Tooltip key={index} title={option.tooltip} arrow>
              <Box className={classes.slider}>
                <input
                  type='radio'
                  id={name + index}
                  name={name + index}
                  disabled={disabled}
                  value={option.value}
                  className={classes.input}
                  onClick={() => {
                    if (uncontrolled) {
                      setValue(options[index].value)
                    } else {
                      onChange(options[index].value)
                    }
                  }}
                  checked={value === option.value}
                />
                <label htmlFor={name + index} className={`${classes.button} radioButton`}>
                  <Box className={classes.radioTitle}>
                    <Typography
                      fontWeight={500}
                      fontSize={'14px'}
                      lineHeight={'20px'}
                      whiteSpace={'nowrap'}
                      color={value === option.value ? 'orange.500' : 'dark.500'}
                      id={value + index}
                    >
                      {option.title}
                    </Typography>
                  </Box>
                </label>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    )
  )
}
