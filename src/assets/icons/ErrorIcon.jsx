import React from 'react'

function ErrorIcon() {
  return (
    <svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='80' height='80' rx='40' fill='#FF4639' />
      <circle cx='40' cy='48' r='2' fill='white' />
      <path
        d='M39.9999 31.9999V41.9999M24.6558 56H55.3442C58.8891 56 61.1298 52.2865 59.4083 49.2648L44.064 22.3318C42.2927 19.2227 37.7073 19.2227 35.936 22.3318L20.5917 49.2648C18.8702 52.2866 21.1109 56 24.6558 56Z'
        stroke='white'
        stroke-width='3'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}

export default ErrorIcon
