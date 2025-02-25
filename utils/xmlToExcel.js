import * as XLSX from 'xlsx'

const xmlToExcel = (xmlString, fileName) => {
  // Parse XML string
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  // Convert XML to JSON (assuming a simple XML structure)
  let data = []
  let rows = xmlDoc.getElementsByTagName('row') // Modify based on your XML structure

  for (let row of rows) {
    let obj = {}
    for (let cell of row.children) {
      obj[cell.tagName] = cell.textContent
    }
    data.push(obj)
  }

  // Convert JSON to Excel format
  let ws = XLSX.utils.json_to_sheet(data)
  let wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Trigger download
  XLSX.writeFile(wb, fileName)
}

export default xmlToExcel
