import { get, isNaN, size } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export const useFullOrderPayments = ({ cartItemsList, paymentTypesList, isOrderDrower, customerId, markingsList, markingCount, setMarkingList }) => {
  const [paymentsList, setPaymentsList] = useState([])
  const [maxAmount, setMaxAmount] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const roundAmount = useCallback((value) => Number((Number(value || 0) + Number.EPSILON).toFixed(2)), [])

  // Add empty string mark to markingless products
  const addEmptyStringMarkToMarkinglessProduct = useCallback(
    (markings, shouldHaveMarkings) => {
      let newMarkingList = { ...markings }
      for (const key in shouldHaveMarkings) {
        const count = shouldHaveMarkings[key]
        const existingValues = markings[key] || {}
        const mergedValues = {}
        for (let i = 0; i < count; i++) {
          mergedValues[i] = existingValues[i] || ''
        }
        newMarkingList[key] = mergedValues
      }
      setMarkingList(newMarkingList)
    },
    [setMarkingList],
  )

  // Add marking handling
  useEffect(() => {
    addEmptyStringMarkToMarkinglessProduct(markingsList, markingCount)
  }, [markingCount])

  // Calculate max amount and payment amount
  useEffect(() => {
    let amount = 0
    paymentsList.forEach((el) => {
      amount += Number(el.amount || 0)
    })
    const roundedAmount = roundAmount(amount)
    const totalAmount = roundAmount(get(cartItemsList, 'total_amount'))

    if (isNaN(roundedAmount)) {
      setMaxAmount(totalAmount)
      setPaymentAmount(0)
    } else {
      setMaxAmount(roundAmount(totalAmount - roundedAmount))
      setPaymentAmount(roundedAmount)
    }
  }, [paymentsList, cartItemsList, roundAmount])

  // Reset payments when drawer opens/closes
  useEffect(() => {
    setPaymentsList([])
  }, [isOrderDrower])

  // Check if payment type is visible
  const isVisiblePaymentType = useCallback(
    (type) => {
      const totalEnteredMoney = roundAmount(paymentsList.reduce((sum, item) => sum + (item.amount || 0), 0))
      const totalAmount = roundAmount(get(cartItemsList, 'total_amount'))
      const isThereType = type === 'overAll' ? false : paymentsList.some((item) => item.id === type.id)

      // Hide Uzum if other payments are present or Other payment types hide if Uzum is present
      if ((totalEnteredMoney >= 1 && type?.front_name == 'uzum') || paymentsList.some((item) => item.front_name == 'uzum')) return false
      if ((customerId?.balance <= 1 && type?.front_name == 'loyalty_card') || (!customerId?.name && type?.front_name == 'loyalty_card')) return false

      // Special handling for app payment type
      if (type?.type === 'app' && totalAmount - totalEnteredMoney > 0 && paymentsList.length !== 0) {
        return !paymentsList.find((item) => item.type === 'app')
      }

      // Allow if no payments yet
      if (paymentsList.length === 0) return true

      // Hide if total is reached or type already exists
      if (totalEnteredMoney >= totalAmount || isThereType) return false

      return true
    },
    [paymentsList, cartItemsList, customerId, roundAmount],
  )

  // Add payment type
  const handleAddPaymentType = useCallback(
    (type) => {
      if (!type) return
      if (!isVisiblePaymentType(type)) return

      const isThereType = paymentsList.some((item) => item.id === type.id)

      setPaymentsList((prev) => {
        const remainingAmount = roundAmount(get(cartItemsList, 'total_amount') - prev.reduce((sum, item) => sum + (item.amount || 0), 0))
        if (
          remainingAmount > customerId?.balance &&
          type?.type == 'loyalty_card'
        ) {
          return [...prev, { ...type, amount: roundAmount(customerId?.balance) }]
        } else if (prev?.length < size(get(paymentTypesList, 'data.data', [])) && !isThereType) {
          return [...prev, { ...type, amount: remainingAmount }]
        }
        return prev
      })
    },
    [paymentsList, paymentTypesList, cartItemsList, customerId, isVisiblePaymentType, roundAmount],
  )

  // Remove payment type
  const removePaymentType = useCallback((id) => {
    setPaymentsList((prev) => prev.filter((el) => el.id !== id))
  }, [])

  // Remove last payment type
  const removeLastPaymentType = useCallback(() => {
    setPaymentsList((prev) => {
      const newList = [...prev]
      newList.pop()
      return newList
    })
  }, [])

  // Create padded payment list with placeholders
  const paddedPaymentsList = [
    ...paymentsList,
    ...Array.from({ length: Math.max(0, 8 - paymentsList.length) }, (_, index) => ({
      id: `placeholder-${index}`,
      isPlaceholder: true,
    })),
  ]

  return {
    paymentsList,
    setPaymentsList,
    maxAmount,
    setMaxAmount,
    paymentAmount,
    setPaymentAmount,
    paddedPaymentsList,
    handleAddPaymentType,
    removePaymentType,
    removeLastPaymentType,
    isVisiblePaymentType,
  }
}
