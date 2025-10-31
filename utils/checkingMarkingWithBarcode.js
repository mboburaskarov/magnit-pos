// Extracts the barcode number from the marking string
export function extractNumbers(marking) {
  const match = marking.match(/01+0*(\d{8,14})(?=21)/)
  return match ? match[1] : ''
}

// Removes leading zeros from a barcode
function trimLeadingZeros(input) {
  return input.replace(/^0+/, '')
}

// Checks if the barcode matches the extracted barcode from marking
export function checkBarcodeWithMarking(barcode, marking) {
  if (barcode.length <= 0) return true
  const markingBarcode = extractNumbers(marking)
  const cleanBarcode = trimLeadingZeros(barcode)

  return markingBarcode === cleanBarcode
}
