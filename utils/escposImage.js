/**
 * Converts an image or SVG into an ESC/POS raster bit image command [HEX:...]
 * @param {string} url - URL of the image/SVG
 * @param {number} targetWidth - Desired width in pixels (will be rounded to nearest multiple of 8)
 * @returns {Promise<string>} Hex formatted ESC/POS command
 */
export async function loadSvgAsEscposHex(url, targetWidth = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      // Width must be a multiple of 8 for ESC/POS bit image
      const width = Math.round(targetWidth / 8) * 8
      const scale = width / img.width
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Fill background with white (since transparent parts should be white/not printed)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)

      // Draw the image
      ctx.drawImage(img, 0, 0, width, height)

      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data

      // Bytes per row = width / 8
      const xL = (width / 8) % 256
      const xH = Math.floor((width / 8) / 256)
      const yL = height % 256
      const yH = Math.floor(height / 256)

      // Raster Bit Image Command: GS v 0 0 xL xH yL yH
      const command = [0x1d, 0x76, 0x30, 0x00, xL, xH, yL, yH]

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x += 8) {
          let byte = 0
          for (let bit = 0; bit < 8; bit++) {
            const idx = (y * width + (x + bit)) * 4
            // Get luminance
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const a = data[idx + 3]
            
            // If pixel is mostly opaque and dark, print a black dot
            // Standard luminance thresholding
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
            if (a > 128 && luminance < 128) {
              byte |= (1 << (7 - bit))
            }
          }
          command.push(byte)
        }
      }

      // Convert byte array to Hex String
      const hexString = command.map(b => b.toString(16).padStart(2, '0')).join('')
      resolve(`[HEX:${hexString}]`)
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image from ${url}`))
    }
    img.src = url
  })
}
