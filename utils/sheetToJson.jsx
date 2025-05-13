import * as XLSX from 'xlsx'

export function sheetToJSON(selectedFile, sheetFunc) {
  return (
    new Promise() <
    boolean >
    ((resolve) => {
      if (selectedFile) {
        let isExceedingFile = false
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(selectedFile)
        fileReader.onload = (event) => {
          const data = event.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })

          workbook.SheetNames.forEach((sheet) => {
            const rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
              defval: '',
            })
            if (sheetFunc) sheetFunc(rowObject)
            isExceedingFile = rowObject?.at(-1)?.['__rowNum__'] >= 20001
          })

          resolve(isExceedingFile)
        }
      } else {
        resolve(false)
      }
    })
  )
}
