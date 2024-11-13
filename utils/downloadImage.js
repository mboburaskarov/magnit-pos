import getImageUrl from './getImageUrl'

const downloadImage = async (imageUrl) => {
  const originalImage = getImageUrl(imageUrl)
  const image = await fetch(originalImage)

  //Split image name

  const nameSplit = originalImage.split('/')
  const duplicateName = nameSplit.pop()

  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)
  const link = document.createElement('a')
  link.href = imageURL
  link.download = '' + (duplicateName || 'Image of product') + ''
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default downloadImage
