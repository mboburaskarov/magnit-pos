import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  inner: {
    display: 'flex',
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
    '&:first-of-type': {
      marginLeft: '0px',
    },
    marginLeft: '4px',
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

  // Count render qilish funksiyasi
  const renderCount = (option) => {
    if (option.count === undefined || option.count === null) return null

    // Agar count React elementi bo'lsa, to'g'ridan-to'g'ri render qil
    if (typeof option.count === 'object' && option.count.$$typeof) {
      return option.count
    }

    // Aks holda qavs ichida ko'rsat
    return `(${option.count})`
  }

  return (
    options?.length !== 0 && (
      <Box style={style} className='slider' sx={{ width: '100%', marginTop: !noMarginTop && 2, borderRadius: 4, boxShadow: error && '0 0 0 2px red' }}>
        <Box className={classes.inner + ' slider_box_wrapper'}>
          {options.map((option, index) => (
            <Tooltip key={index} title={option.tooltip} arrow>
              <Box className={classes.slider + ' slider_box'}>
                <input
                  type='radio'
                  id={name + index}
                  name={name + index}
                  disabled={disabled}
                  value={option.value}
                  className={classes.input}
                  onClick={() => {
                    if (option.soon || option.inprecess) return
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
                      display={'flex'}
                      fontSize={'14px'}
                      lineHeight={'20px'}
                      whiteSpace={'nowrap'}
                      color={value === option.value ? 'orange.500' : 'dark.500'}
                      id={value + index}
                    >
                      {option.title} {renderCount(option)}{' '}
                      {option.soon && (
                        <Typography
                          sx={{
                            width: '40px',
                            height: '20px',
                            backgroundColor: '#A53EFF',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '600',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: '10px',
                          }}
                        >
                          soon
                        </Typography>
                      )}
                      {option.inprecess && (
                        <Typography
                          sx={{
                            height: '20px',
                            backgroundColor: '#0125FF',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '600',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: '10px',
                            p: '3px 5px',
                          }}
                        >
                          В доработке
                        </Typography>
                      )}
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
