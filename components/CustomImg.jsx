import React from 'react'

function CustomImg({ src = '360c6ea0-c16d-4e43-b083-3830490b1360.png', alt = 'pharma cosmos', className = 'img', ...other }) {
  return (
    <img
      src={`${import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL}/v1/upload/${src}`}
      {...other}
      alt={alt}
      className={className}
    />
  )
}

export default CustomImg
