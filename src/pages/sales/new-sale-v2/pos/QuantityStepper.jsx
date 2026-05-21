import React from 'react'
import './PosLayout.css'

export default function QuantityStepper({ item, onIncrease, onDecrease }) {
  return (
    <div className='pos-qty-stepper' onClick={(e) => e.stopPropagation()}>
      <button 
        className='pos-qty-stepper-btn' 
        onClick={() => onDecrease(item)}
        type='button'
      >
        −
      </button>
      <span className='pos-qty-stepper-value'>
        {item.quantity}
      </span>
      <button 
        className='pos-qty-stepper-btn' 
        onClick={() => onIncrease(item)}
        type='button'
      >
        +
      </button>
    </div>
  )
}
