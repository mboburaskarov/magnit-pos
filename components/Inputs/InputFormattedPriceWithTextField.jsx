import Box from '@mui/material/Box'
import { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import InputSimple from './InputSimple'

function InputFormattedPriceWithTextField({
  id,
  error,
  onKeyDown,
  control,
  noMarginTop,
  label,
  noLabel,
  placeholder,
  name,
  onInput,
  fullWidth,
  inputRef: extraRef, // Receive inputRef from parent
  boxStyle,
  defaultValue,
  adornment,
  adornmentPosition = 'start',
  adornmentClassName = '',
  required = false,
  disabled = false,
  asteriks,
  borderRadius,
  autoCompleteOff,
  inputComponent,
  allowNegative,
  setSiblingValues,
  uncontrolled,
  height,
  noHover,
  dashed,
  inputHeight,
  transparentAdornment = true,
  backgroundColor,
  deleteLabel,
  deleteLabelClick,
  max,
  small,
  white,
  width,
  solidBorder,
  onBlur,
}) {
  const internalRef = useRef(null) // Fallback ref if none provided

  const { t } = useTranslation()

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <NumericFormat
            {...fieldProps}
            getInputRef={extraRef || internalRef} // Use provided ref or fallback
            inputRef={extraRef || internalRef} // Use provided ref or fallback
            id={id || name}
            value={value === 0 ? '' : value}
            onValueChange={({ floatValue }) => {
              onChange(floatValue ?? '')
            }}
            customInput={InputSimple}
            thousandSeparator=' '
            isNumericString
            label={t(label)}
            onKeyDown={onKeyDown}
            noLabel={noLabel}
            placeholder={t(placeholder)}
            fullWidth={fullWidth}
            boxStyle={boxStyle}
            adornment={adornment}
            noMarginTop={noMarginTop}
            adornmentPosition={adornmentPosition}
            adornmentClassName={adornmentClassName}
            required={required}
            disabled={disabled}
            asteriks={asteriks}
            onInput={onInput}
            borderRadius={borderRadius}
            autoCompleteOff={autoCompleteOff}
            inputComponent={inputComponent}
            allowNegative={allowNegative}
            setSiblingValues={setSiblingValues}
            uncontrolled={uncontrolled}
            height={height}
            noHover={noHover}
            inputHeight={inputHeight}
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
          />
        )}
      />
    </Box>
  )
}

export default InputFormattedPriceWithTextField
