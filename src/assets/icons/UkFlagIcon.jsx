import React from 'react'

function UkFlagIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#clip0_uk_flag)'>
        <g clipPath='url(#clip1_uk_flag)'>
          <path d='M0 0H24V24H0V0Z' fill='#012169' />
          <path d='M0 0L24 24M24 0L0 24' stroke='white' strokeWidth='4.8' />
          <path d='M0 0L24 24M24 0L0 24' stroke='#C8102E' strokeWidth='1.9' />
          <path d='M12 0V24M0 12H24' stroke='white' strokeWidth='7.2' />
          <path d='M12 0V24M0 12H24' stroke='#C8102E' strokeWidth='3.4' />
        </g>
      </g>
      <defs>
        <clipPath id='clip0_uk_flag'>
          <path d='M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z' fill='white' />
        </clipPath>
        <clipPath id='clip1_uk_flag'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

export default UkFlagIcon
