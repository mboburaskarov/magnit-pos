import { Delete } from 'lucide-react'
import './PosLayout.css'

/**
 * Numpad
 *
 * Props:
 *   onKeyPress(value) — called with digit (number), 'backspace', 'clear', or ',' (comma).
 *   showComma        — when true, shows comma key for decimal weight input (replaces C button layout).
 */
export default function Numpad({ onKeyPress, showComma = false }) {
  const pieceButtons = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '←', value: 'backspace' },
    { label: '0', value: 0 },
    { label: 'C', value: 'clear' },
  ]

  const weightButtons = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: ',', value: ',' },
    { label: '0', value: 0 },
    { label: '←', value: 'backspace' },
  ]

  const buttons = showComma ? weightButtons : pieceButtons

  return (
    <div className='pos-numpad-premium'>
      {buttons.map((btn, index) => {
        const isAction = btn.value === 'backspace' || btn.value === 'clear'
        const isComma = btn.value === ','
        return (
          <button
            key={index}
            type='button'
            className={`pos-numpad-btn ${isAction ? 'is-action' : ''} ${isComma ? 'is-comma-key' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onKeyPress?.(btn.value)}
            tabIndex={-1}
          >
            {btn.value === 'backspace' ? <Delete size={20} /> : btn.label}
          </button>
        )
      })}
    </div>
  )
}
