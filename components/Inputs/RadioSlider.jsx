import { Box, FormControlLabel, Radio, RadioGroup, Typography, Tooltip } from '@mui/material'
import { useState, useEffect } from 'react'

export default function SwitchSlider({
  name,
  options = [],
  onChange,
  defaultValue,
  error,
  value: controlledValue,
  uncontrolled = false,
  disabled = false,
  style,
}) {
  const [value, setValue] = useState(defaultValue || '')

  // Controlled/uncontrolled sync
  useEffect(() => {
    if (!uncontrolled && controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (event) => {
    const newValue = event.target.value
    if (uncontrolled) setValue(newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <Box
      sx={{
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap !important',
        height: '48px',
        // bgcolor: 'grey.50',
        boxShadow: error ? '0 0 0 2px red' : 'none',
        ...style,
      }}
    >
      <RadioGroup
        row
        name={name}
        value={value}
        onChange={handleChange}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap !important',

          //   gap: 1.5,
          '& .MuiFormControlLabel-root': {
            p: 0,
            paddingRight: '10px',
          },
          '& .MuiRadio-root': {
            padding: '2px 8px',
          },
        }}
      >
        {options.map((option, index) => (
          <Tooltip key={index} title={option.tooltip || ''} arrow>
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  disableRipple
                  disabled={disabled || option.soon}
                  sx={{
                    color: 'grey.400',
                    '&.Mui-checked': {
                      color: '#FF5722', // orange
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: value === option.value ? 'black' : 'grey.700',
                    fontWeight: 500,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textTransform: 'none',
                  }}
                >
                  {option.title}
                  {option.soon && (
                    <Typography
                      sx={{
                        backgroundColor: '#A53EFF',
                        color: '#fff',
                        fontSize: '10px',
                        px: 1,
                        borderRadius: '12px',
                        fontWeight: 600,
                      }}
                    >
                      soon
                    </Typography>
                  )}
                </Typography>
              }
              sx={{
                m: 0,
                borderRadius: '24px',
                px: 1,
                py: 0.5,
                transition: '0.2s',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            />
          </Tooltip>
        ))}
      </RadioGroup>
    </Box>
  )
}
