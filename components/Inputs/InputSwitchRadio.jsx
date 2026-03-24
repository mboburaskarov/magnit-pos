import { Box } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import Label from '../Label'
import RadioSlider from './RadioSlider'

const InputSwitchRadio = ({ name, label, noLabel, options = [], required = false, uncontrolled, noMarginTop, defaultValue, onChange, style, disabled, id }) => {
  const methods = useFormContext()

  return (
    <Box width='100%' id={id} pt={noLabel ? 2.5 : 0}>
      {label && (
        <Label mb={2} required={required}>
          {label}
        </Label>
      )}
      {uncontrolled ? (
        <RadioSlider
          onChange={(value) => onChange(value)}
          noMarginTop={noMarginTop}
          options={options}
          defaultValue={defaultValue}
          name={name}
          style={style}
          required={required}
          disabled={disabled}
          error={!!methods?.formState?.errors?.[name]}
          uncontrolled={uncontrolled}
          value={defaultValue}
        />
      ) : (
        <Controller
          name={name}
          control={methods.control}
          defaultValue={defaultValue}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <RadioSlider
              value={value}
              style={style}
              noMarginTop={noMarginTop}
              name={name}
              options={options}
              onChange={(val) => onChange(val)}
              disabled={disabled}
              defaultValue={defaultValue}
              error={!!methods?.formState?.errors?.[name]}
              uncontrolled={uncontrolled}
            />
          )}
        />
      )}
    </Box>
  )
}

export default InputSwitchRadio
