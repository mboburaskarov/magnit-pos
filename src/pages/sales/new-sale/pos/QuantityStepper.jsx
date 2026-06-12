import './PosLayout.css'

export default function QuantityStepper({ item, onIncrease, onDecrease, isLoading }) {
  return (
    <div className={`pos-qty-stepper ${isLoading ? 'is-loading' : ''}`} onClick={(e) => e.stopPropagation()}>
      <button
        className='pos-qty-stepper-btn'
        onClick={() => onDecrease(item)}
        type='button'
        disabled={isLoading}
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
        disabled={isLoading}
      >
        +
      </button>
    </div>
  )
}
