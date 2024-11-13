export default function getImageUrl(url) {
  const formattedUrl = import.meta.env.VITE_FILE_API_URL + url
  return formattedUrl
}
