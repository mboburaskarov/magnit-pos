export const downloadLinkExcel = (name = 'exel_data') => {
  const link = document.createElement('a')
  const baseUrl = import.meta.env.VITE_MODE === 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL

  link.href = `${baseUrl}/v1/upload/excel/${name}`
  // link.download = "Sale_details.xlsx"; // Optional: custom filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
