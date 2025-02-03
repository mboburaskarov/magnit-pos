import Box from '@mui/material/Box'
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import InputSimple from './InputSimple'
import { useTranslation } from 'react-i18next'
import Label from '../Label'

function InputFormattedPriceWithTextField({
  id,
  error,
  control,
  label,
  noLabel,
  placeholder,
  name,
  fullWidth,
  boxStyle,
  defaultValue,
  adornment,
  adornmentPosition = 'start',
  adornmentClassName = '',
  required = false,
  disabled = false,
  asteriks,
  autoCompleteOff,
  inputComponent,
  allowNegative,
  setSiblingValues,
  uncontrolled = false,
  height,
  noHover,
  dashed,
  transparentAdornment = true,
  backgroundColor,
  deleteLabel,
  deleteLabelClick,
  max,
  small,
  white,
  width,
  solidBorder,
  onlyDisplay,
  onBlur,
}) {
  const { t } = useTranslation()
  const methods = useFormContext()
  return (
    <Box
      sx={{
        '& .MuiFormControl-root .MuiOutlinedInput-root': {
          height: '48px !important',
        },
      }}
      m={'0'}
      width={'100%'}
    >
      {!onlyDisplay && label && <Label required={required}>{label}</Label>}
      {/* <Controller
        // name={name}
        // control={control}
        // defaultValue={defaultValue}
        // render={({ onChange, value, ...rest }) => ( */}
      <NumericFormat
        // {...rest}
        id={id || name}
        {...methods?.register(name, { required })}
        // value={value === 0 ? '' : value}
        customInput={InputSimple}
        thousandSeparator=' '
        variant='outlined'
        isNumericString
        error={error}
        control={control}
        // label={t(label)}
        noLabel={noLabel}
        placeholder={t(placeholder)}
        name={name}
        fullWidth={fullWidth}
        boxStyle={boxStyle}
        noMarginTop
        defaultValueNF={defaultValue}
        adornment={adornment}
        adornmentPosition={adornmentPosition}
        adornmentClassName={adornmentClassName}
        required={required}
        disabled={disabled}
        asteriks={asteriks}
        autoCompleteOff={autoCompleteOff}
        inputComponent={inputComponent}
        allowNegative={allowNegative}
        setSiblingValues={setSiblingValues}
        uncontrolled={uncontrolled}
        height={height}
        noHover={noHover}
        dashed={dashed}
        transparentAdornment={transparentAdornment}
        backgroundColor={backgroundColor}
        deleteLabel={deleteLabel}
        deleteLabelClick={deleteLabelClick}
        max={max}
        small={small}
        white={white}
        width={width}
        solidBorder={solidBorder}
        onBlur={onBlur}
        type='text'
      />
      {/* )} */}
      {/* placeholder={t(placeholder)}
        variant='outlined'
      /> */}
    </Box>
  )
}
export default InputFormattedPriceWithTextField
