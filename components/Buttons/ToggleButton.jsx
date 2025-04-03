import { Button } from '@mui/material'

export default function ToggleButton({ children, value, values, setValues, selectedbgColor, selectedTextColor, textColor, bgColor }) {
  const handleClick = () => {
    setValues(value)
  }

  return (
    <>
      {values === value && (
        <Button
          sx={(theme) => {
            return {
              backgroundColor: `${selectedbgColor ? selectedbgColor : theme.palette.primary} !important`,
              color: `${selectedTextColor ? selectedTextColor : theme.palette.text} !important`,
            }
          }}
          onClick={() => handleClick()}
        >
          {children}
        </Button>
      )}
      {values !== value && (
        <Button
          sx={(theme) => {
            return {
              backgroundColor: `${bgColor ? bgColor : theme.palette.primary} !important`,
              color: `${textColor ? textColor : theme.palette.text} !important`,
            }
          }}
          onClick={() => handleClick()}
        >
          {children}
        </Button>
      )}
    </>
  )
}
