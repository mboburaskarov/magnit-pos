import React from 'react'
import { X } from 'lucide-react'
import './PosLayout.css'

export default function PosOnScreenKeyboard({
  value = '',
  onChange,
  onBackspace,
  onClear,
  onEnter,
  language = 'ru',
  onLanguageChange,
  onClose,
  t,
}) {
  const layouts = {
    ru: [
      ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
      ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
      ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.'],
    ],
    uz: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', "'"],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '.'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '-'],
    ],
  }

  const handleKeyClick = (key) => {
    if (onChange) {
      onChange(value + key)
    }
  }

  const rows = layouts[language] || layouts.ru

  return (
    <div className='pos-keyboard-container' onMouseDown={(e) => e.preventDefault()}>
      {/* Keyboard Header */}
      <div className='pos-keyboard-header'>
        <span className='pos-keyboard-title'>
          {language === 'ru' ? 'Экранная клавиатура (RU)' : 'Ekran klaviaturasi (UZ)'}
        </span>
        <button type='button' className='pos-keyboard-close-btn' onClick={onClose} title={t?.('pos.cancel') || 'Close'}>
          <X size={18} />
        </button>
      </div>

      {/* Keyboard Keys */}
      <div className='pos-keyboard-keys'>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className='pos-keyboard-row'>
            {row.map((key) => (
              <button
                key={key}
                type='button'
                className='pos-keyboard-key'
                onClick={() => handleKeyClick(key)}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row actions */}
        <div className='pos-keyboard-row bottom-row'>
          <button
            type='button'
            className='pos-keyboard-key action-key lang-toggle'
            onClick={onLanguageChange}
          >
            {language.toUpperCase()}
          </button>
          
          <button
            type='button'
            className='pos-keyboard-key action-key clear-key'
            onClick={onClear}
          >
            {t?.('delete_all') || 'CLEAR'}
          </button>

          <button
            type='button'
            className='pos-keyboard-key space-key'
            onClick={() => handleKeyClick(' ')}
          >
            {language === 'ru' ? 'ПРОБЕЛ' : 'BO\'SH JOY'}
          </button>

          <button
            type='button'
            className='pos-keyboard-key action-key backspace-key'
            onClick={onBackspace}
          >
            ⌫
          </button>

          <button
            type='button'
            className='pos-keyboard-key action-key enter-key'
            onClick={onEnter}
          >
            {t?.('pos.search_title') || 'ENTER'}
          </button>
        </div>
      </div>
    </div>
  )
}
