import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';
import { get } from 'lodash';


export const useFullOrderHotkeys = ({ paymentTypesList, handleAddPaymentType, handleFinish, maxAmount }) => {
  // Payment hotkey mapping
  const paymentHotKeys = {
    naqd: 'F1',
    humo: 'F2',
    uzcard: 'F3',
    visa: 'F4',
    click: 'F5',
    uzum: 'F6',
    payme: 'F7',
    pay: 'F12',
  }

  // Get hotkey label for payment type
  const getPaymentTypeHotKeyLabel = useCallback((name) => {
    return paymentHotKeys[name?.toLowerCase().trim()] || 'no'
  }, [])

  // Find payment type by name
  const findTypeWithName = useCallback(
    (name) => {
      const list = get(paymentTypesList, 'data.data', [])
      return list.find((el) => el?.name?.toLowerCase() === name)
    },
    [paymentTypesList]
  )

  // Handle F-key presses
  const handleFKeys = useCallback(
    (event) => {
      event.preventDefault()
      const key = event.key

      // F12 - Finish payment (only if no remaining amount)
      if (key === 'F12' && !(maxAmount > 0)) {
        handleFinish()
        return
      }

      // Find payment type for other F-keys
      const paymentType = Object.keys(paymentHotKeys).find((type) => paymentHotKeys[type] === key)

      if (paymentType) {
        const typeData = findTypeWithName(paymentType)
        if (typeData) {
          handleAddPaymentType(typeData)
        }
      }
    },
    [maxAmount, handleFinish, findTypeWithName, handleAddPaymentType]
  )

  // Register hotkeys
  useHotkeys(
    Object.values(paymentHotKeys),
    (event) => {
      event.preventDefault()
      handleFKeys(event)
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  return {
    paymentHotKeys,
    getPaymentTypeHotKeyLabel,
    findTypeWithName,
    handleFKeys,
  }
}
