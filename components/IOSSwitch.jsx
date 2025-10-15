import { Box, Switch } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Controller, useFormContext } from 'react-hook-form'
import Label from './Label'

const IOSSwitch = styled((props) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '2px 2px 0  0px',
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.orange[500],
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.orange[500],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: theme.palette.orange[500],
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}))

function CustomSwitch({ name, label, defaultValue = false, disabled = false, onChange, required = false, uncontrolled = false, value, boxStyle }) {
  const methods = useFormContext()

  if (uncontrolled) {
    return (
      <Box display='flex' alignItems='center' gap={2} {...boxStyle}>
        {label && <Label required={required}>{label}</Label>}
        <IOSSwitch checked={value} onChange={onChange} disabled={disabled} />
      </Box>
    )
  }

  return (
    <Box display='flex' alignItems='center' gap={2} {...boxStyle}>
      {label && <Label required={required}>{label}</Label>}
      <Controller
        name={name}
        control={methods?.control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field }) => (
          <IOSSwitch
            checked={field.value}
            onChange={(e) => {
              field.onChange(e.target.checked)
              if (onChange) {
                onChange(e.target.checked)
              }
            }}
            disabled={disabled}
          />
        )}
      />
    </Box>
  )
}

export default CustomSwitch
