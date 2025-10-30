// hooks/useKeyboardShortcuts.js
import { useHotkeys } from 'react-hotkeys-hook'

export const usePaymentShortcuts = ({ inputRefs, setValue, setOnlinePaymentType, setCardPaymentType, remainingAmount }) => {
  const shouldPaymentInputActive = () => {
    const activeInput = document.activeElement.id
    return activeInput.includes('lite_') || activeInput.includes('quantity_') || activeInput.includes('inputQuantity') || activeInput === ''
  }

  const setRemainPriceToPaymentValue = (name) => {
    if (remainingAmount > 0) {
      setValue(name, remainingAmount)
    }
  }

  const changeCursor = (inputRef) => {
    setTimeout(() => {
      const input = inputRef
      if (input) {
        const length = input.value.length
        input.setSelectionRange(length, length)
        input.focus()
      }
    }, 100)
  }

  // Cash payment (N key)
  useHotkeys(
    ['n', 'N', 'т'],
    () => {
      if (shouldPaymentInputActive() && inputRefs.current[0]) {
        inputRefs.current[0].focus()
        setRemainPriceToPaymentValue('lite_cash_amount')
        changeCursor(inputRefs.current[0])
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  // Payme payment (P key)
  useHotkeys(
    ['p', 'P', 'з', 'З'],
    () => {
      if (shouldPaymentInputActive() && inputRefs.current[2]) {
        inputRefs.current[2].focus()
        setRemainPriceToPaymentValue('lite_online_amount')
        changeCursor(inputRefs.current[2])
        setOnlinePaymentType({ from: 'Payme', to: 'Click' })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  // Click payment (C key)
  useHotkeys(
    ['c', 'C', 'С', 'с'],
    () => {
      if (shouldPaymentInputActive() && inputRefs.current[2]) {
        inputRefs.current[2].focus()
        setRemainPriceToPaymentValue('lite_online_amount')
        changeCursor(inputRefs.current[2])
        setOnlinePaymentType({ from: 'Click', to: 'Payme' })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  // Uzcard payment (U key)
  useHotkeys(
    ['u', 'U', 'Г', 'г'],
    () => {
      if (shouldPaymentInputActive() && inputRefs.current[1]) {
        inputRefs.current[1].focus()
        setRemainPriceToPaymentValue('lite_card_amount')
        changeCursor(inputRefs.current[1])
        setCardPaymentType({ from: 'Uzcard', to: 'Humo' })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  // Humo payment (H key)
  useHotkeys(
    ['h', 'H', 'Р', 'р'],
    () => {
      if (shouldPaymentInputActive() && inputRefs.current[1]) {
        inputRefs.current[1].focus()
        setRemainPriceToPaymentValue('lite_card_amount')
        changeCursor(inputRefs.current[1])
        setCardPaymentType({ from: 'Humo', to: 'Uzcard' })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
}
