function CustomImg({ key, src = '', alt = 'pharma cosmos', className = 'img', ...other }) {
  const baseUrl = import.meta.env.VITE_MODE === 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL

  const imgUrl = `${baseUrl}/v1/upload/${src}`
  const fallbackSrc = '/no-img.png' // Put your fallback image in the public folder

  const handleError = (e) => {
    e.target.onerror = null // Prevent infinite loop
    e.target.src = fallbackSrc
  }

  return <img src={imgUrl} key={key} alt={alt} className={className} onError={handleError} {...other} />
}

export default CustomImg
