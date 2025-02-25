export const downloadExcel = (data) => {
  const url = window.URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = 'import-detail.xlsx'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
