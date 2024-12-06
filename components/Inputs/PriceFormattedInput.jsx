import { NumericFormat } from 'react-number-format'

function PriceFormattedInput(props) {
  const { inputRef, onChange, ...other } = props
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator=' '
      isNumericString
      allowNegative={props.name === 'extra_charge'}
    />
  )
}

export default PriceFormattedInput
