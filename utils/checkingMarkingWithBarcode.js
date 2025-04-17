// Extracts the barcode number from the marking string
function extractNumbers(marking) {
  const match = marking.match(/0100*(\d+)21.*/)
  return match ? match[1] : ''
}

// Removes leading zeros from a barcode
function trimLeadingZeros(input) {
  return input.replace(/^0+/, '')
}

// Checks if the barcode matches the extracted barcode from marking
export function checkBarcodeWithMarking(barcode, marking) {
  const markingBarcode = extractNumbers(marking)
  const cleanBarcode = trimLeadingZeros(barcode)
  console.log('markingBarcode ->>>>>>>>>', markingBarcode)
  console.log('cleanBarcode ->>>>>>>>>', cleanBarcode)
  console.log('barcode ->>>>>>>>>', barcode)
  console.log('marking ->>>>>>>>>', marking)

  return markingBarcode === cleanBarcode
}
