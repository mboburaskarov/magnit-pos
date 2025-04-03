import { NumericFormat } from 'react-number-format'

const MAX_VAL = 999_999_999_999_999 // 999 trillion
const withValueLimit = ({ floatValue }) => floatValue <= MAX_VAL
function PriceFormattedNegativeInput(props) {
  const { inputRef, onChange, ...other } = props
  return (
    <NumericFormat
      isNumericString
      allowNegative
      getInputRef={inputRef}
      isAllowed={withValueLimit}
      displayType='input'
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator=' '
      {...other}
    />
  )
}

export default PriceFormattedNegativeInput
