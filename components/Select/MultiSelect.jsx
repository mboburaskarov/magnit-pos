import { Box, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import Select, { components } from 'react-select'

const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <DeleteIconBig />
  </components.MultiValueRemove>
)
const ClearIndicator = (props) => (
  <components.ClearIndicator {...props}>
    <Box
      sx={{
        paddingRight: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DeleteSmallIcon />
    </Box>
  </components.ClearIndicator>
)

function MultiSelect({
  id,
  control,
  label,
  placeholder,
  name,
  fullWidth,
  getOptionLabel = (option) => option.name,
  options = [],
  boxStyle,
  defaultValue,
  rules,
  minWidth,
  isClearable = true,
  white,
}) {
  return (
    <>
      <Box sx={{ width: '100%' }} width={fullWidth ? '100%' : 320} mt={!label ? '21px' : 0} {...boxStyle}>
        {label && (
          <Typography sx={{ marginBottom: 2 }} variant='h5'>
            {label}
          </Typography>
        )}
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          rules={rules}
          render={(props) => {
            const { onChange, value } = props
            return (
              <Select
                closeMenuOnSelect={false}
                inputId={id}
                id={id}
                isMulti
                isClearable={isClearable}
                value={value}
                components={{ MultiValueRemove, ClearIndicator }}
                getOptionLabel={getOptionLabel}
                getOptionValue={(option) => option.id}
                onChange={(onChangeProps) => {
                  onChange(onChangeProps.map((el) => el))
                }}
                options={options}
                placeholder={placeholder}
              />
            )
          }}
        />
      </Box>
    </>
  )
}

export default MultiSelect
