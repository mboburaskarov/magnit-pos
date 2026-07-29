import React, { useEffect, useRef } from 'react'

export default function ReceiptPreviewCanvas({ lines }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup dimensions and fonts
    const charWidth = 10
    const lineHeight = 20
    const marginX = 20
    const marginY = 20
    
    // We assume width is 48 chars (80mm paper standard)
    const canvasWidth = 48 * charWidth + marginX * 2
    
    // Calculate required height based on lines
    let requiredHeight = marginY * 2
    for (let line of lines) {
      if (line === '[BOLD_START]' || line === '[BOLD_END]') continue
      if (line === '[CUT]') continue
      if (line.startsWith('[QR:')) {
        requiredHeight += 160 // QR code space
        continue
      }
      if (line.startsWith('[HEX:')) {
        try {
          const hexStr = line.substring(5, 25)
          const bytes = []
          for (let i = 0; i < hexStr.length; i += 2) {
            bytes.push(parseInt(hexStr.substring(i, i + 2), 16))
          }
          if (bytes[0] === 0x1d && bytes[1] === 0x76 && bytes[2] === 0x30 && bytes[3] === 0x00) {
            const xL = bytes[4]
            const xH = bytes[5]
            const yL = bytes[6]
            const yH = bytes[7]
            const imgWidth = (xL + xH * 256) * 8
            const imgHeight = yL + yH * 256
            const printableWidth = canvasWidth - marginX * 2
            const scale = printableWidth / imgWidth
            const drawHeight = imgHeight * scale
            requiredHeight += drawHeight
          }
        } catch (e) {
          console.error("Failed to parse height from hex line", e)
        }
        continue
      }
      requiredHeight += lineHeight
    }

    canvas.width = canvasWidth
    canvas.height = requiredHeight
    
    // Clear background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Default styles
    ctx.fillStyle = '#000000'
    ctx.textBaseline = 'top'
    let isBold = false
    
    let y = marginY

    for (let line of lines) {
      if (line === '[BOLD_START]') {
        isBold = true
        continue
      }
      if (line === '[BOLD_END]') {
        isBold = false
        continue
      }
      if (line === '[CUT]') {
        continue
      }
      if (line.startsWith('[QR:')) {
        // Draw a simulated QR code
        const qrSize = 140
        const qrX = (canvasWidth - qrSize) / 2
        
        // Draw a bordered square
        ctx.fillStyle = '#000'
        ctx.fillRect(qrX, y, qrSize, qrSize)
        ctx.fillStyle = '#fff'
        ctx.fillRect(qrX + 10, y + 10, qrSize - 20, qrSize - 20)
        
        // Draw a simulated inner pattern
        ctx.fillStyle = '#000'
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 6; c++) {
            if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
              ctx.fillRect(qrX + 20 + c * 16, y + 20 + r * 16, 16, 16)
            }
          }
        }
        
        y += qrSize + 20
        continue
      }
      if (line.startsWith('[HEX:')) {
        try {
          const hexStr = line.substring(5, line.length - 1)
          const bytes = []
          for (let i = 0; i < hexStr.length; i += 2) {
            bytes.push(parseInt(hexStr.substring(i, i + 2), 16))
          }
          
          if (bytes[0] === 0x1d && bytes[1] === 0x76 && bytes[2] === 0x30 && bytes[3] === 0x00) {
            const xL = bytes[4]
            const xH = bytes[5]
            const yL = bytes[6]
            const yH = bytes[7]
            
            const widthBytes = xL + xH * 256
            const imgWidth = widthBytes * 8
            const imgHeight = yL + yH * 256
            
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = imgWidth
            tempCanvas.height = imgHeight
            const tempCtx = tempCanvas.getContext('2d')
            const imgData = tempCtx.createImageData(imgWidth, imgHeight)
            const data = imgData.data
            
            let byteIdx = 8
            for (let yOffset = 0; yOffset < imgHeight; yOffset++) {
              for (let xByte = 0; xByte < widthBytes; xByte++) {
                if (byteIdx >= bytes.length) break
                const byteVal = bytes[byteIdx++]
                for (let bit = 0; bit < 8; bit++) {
                  const bitVal = (byteVal >> (7 - bit)) & 1
                  const pixelIdx = (yOffset * imgWidth + (xByte * 8 + bit)) * 4
                  if (bitVal === 1) {
                    data[pixelIdx] = 0
                    data[pixelIdx + 1] = 0
                    data[pixelIdx + 2] = 0
                    data[pixelIdx + 3] = 255
                  } else {
                    data[pixelIdx] = 255
                    data[pixelIdx + 1] = 255
                    data[pixelIdx + 2] = 255
                    data[pixelIdx + 3] = 0
                  }
                }
              }
            }
            tempCtx.putImageData(imgData, 0, 0)
            
            const printableWidth = canvasWidth - marginX * 2
            const scale = printableWidth / imgWidth
            const drawHeight = imgHeight * scale
            
            ctx.drawImage(tempCanvas, marginX, y, printableWidth, drawHeight)
            y += drawHeight
          }
        } catch (e) {
          console.error("Failed to render hex image on preview canvas", e)
        }
        continue
      }

      ctx.font = isBold ? 'bold 15px monospace' : '15px monospace'
      ctx.fillText(line, marginX, y)
      y += lineHeight
    }
  }, [lines])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      borderRadius: '8px',
      overflow: 'auto',
      maxHeight: '60vh'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '4px',
          width: '360px',
          height: 'auto',
          backgroundColor: '#fff'
        }} 
      />
    </div>
  )
}
