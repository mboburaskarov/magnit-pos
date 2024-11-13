import { useTheme } from '@mui/material/styles'

const BackArrowIcon = (props) => {
  const { mode } = useTheme()

  return props.type == 'down' ? (
    <svg
      width='14'
      height='10'
      viewBox='0 0 14 10'
      fill={props.fill ? props.fill : mode === 'dark' ? '#6F6F6F' : '#BDBDBD'}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M7 8.9375C6.71875 9.21875 6.25 9.21875 5.96875 8.9375L0.90625 2.875C0.625 2.5625 0.625 2.09375 0.90625 1.8125L1.625 1.09375C1.90625 0.8125 2.375 0.8125 2.6875 1.09375L6.5 5.90625L11.3125 1.09375C11.625 0.8125 12.0938 0.8125 12.375 1.09375L13.0938 1.8125C13.375 2.09375 13.375 2.5625 13.0938 2.875L7 8.9375Z'
        fill='inherit'
      />
    </svg>
  ) : (
    <svg
      width='10'
      height='14'
      viewBox='0 0 10 14'
      fill={props.fill ? props.fill : mode === 'dark' ? '#6F6F6F' : '#BDBDBD'}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M1.0625 6.5C0.78125 6.78125 0.78125 7.25 1.0625 7.53125L7.125 13.625C7.4375 13.9062 7.90625 13.9062 8.1875 13.625L8.90625 12.9062C9.1875 12.625 9.1875 12.1562 8.90625 11.8438L4.09375 7L8.90625 2.1875C9.1875 1.875 9.1875 1.40625 8.90625 1.125L8.1875 0.40625C7.90625 0.125 7.4375 0.125 7.125 0.40625L1.0625 6.5Z'
        fill='inherit'
      />
    </svg>
  )
}

export default BackArrowIcon
