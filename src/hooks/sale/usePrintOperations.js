import { error } from '@utils/toast'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

export const usePrintOperations = ({
  childRef,
  newSaleId,
  setNewSaleId,
  setQrcodeUrl,
  setPaymentsList,
  defaultPaymentTypes,
  setMarkingList,
  sendToEpos,
  onAfterPrint, // Optional custom callback
}) => {
  const navigate = useNavigate()
  const printContainer = useRef()
  const printContainerEmpty = useRef()
  const documentName = useRef('Pharma CHEQUE')

  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const reactToPrintContentEmpty = useCallback(() => printContainerEmpty.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
      setNewSaleId(false)
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      setPaymentsList(defaultPaymentTypes)
      navigate(`/sales/create`)
    },
    onAfterPrint: () => {
      setMarkingList({})
      setNewSaleId(false)
      setPaymentsList(defaultPaymentTypes)
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })

      // Call custom callback if provided
      if (onAfterPrint) {
        onAfterPrint()
      }

      if (JSON.parse(sendToEpos)) {
        navigate(`/sales/new-sale-v2/${newSaleId}`)
      } else {
        navigate(`/sales/create`)
      }
    },
  })

  const emptyHandlePrint = useReactToPrint({
    content: reactToPrintContentEmpty,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
    },
    onAfterPrint: () => {},
  })

  // Expose empty print function to parent
  if (childRef) {
    useImperativeHandle(childRef, () => ({
      printChildCheque() {
        emptyHandlePrint()
      },
    }))
  }

  return {
    printContainer,
    printContainerEmpty,
    handlePrint,
    emptyHandlePrint,
  }
}
