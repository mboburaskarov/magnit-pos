import React from 'react'

function TargetIcon({ color = '#111111' }) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clip-path='url(#clip0_3870_36838)'>
        <circle cx='7.99935' cy='7.99984' r='1.33333' fill={color} />
        <path
          d='M8.00065 8.00016L14.6673 1.3335M12.0007 8.00016C12.0007 10.2093 10.2098 12.0002 8.00065 12.0002C5.79151 12.0002 4.00065 10.2093 4.00065 8.00016C4.00065 5.79102 5.79151 4.00016 8.00065 4.00016C10.2098 4.00016 12.0007 5.79102 12.0007 8.00016ZM14.6673 8.00016C14.6673 11.6821 11.6825 14.6668 8.00065 14.6668C4.31875 14.6668 1.33398 11.6821 1.33398 8.00016C1.33398 4.31826 4.31875 1.3335 8.00065 1.3335C11.6825 1.3335 14.6673 4.31826 14.6673 8.00016Z'
          stroke={color}
          stroke-width='1.5'
          stroke-linecap='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_3870_36838'>
          <rect width='16' height='16' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

export default TargetIcon
