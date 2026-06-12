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
    
    // We assume width is 48 chars
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
