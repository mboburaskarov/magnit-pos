import React, { useEffect, useState, useMemo, ReactNode } from 'react'

const formatThousands = (num: number, separator: string) => {
  if (separator === 'auto') {
    return new Intl.NumberFormat().format(num)
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

interface MatnProps {
  children: string | number
  highlight?: string[]
  highlightColor?: string
  formatNumber?: boolean
  separator?: ' ' | ',' | '.' | 'auto'
  animateNumber?: boolean
  duration?: number
  font?: 'normal' | 'italic' | 'bold'
  color?: string
  lineCount?: number
  copyable?: boolean
  mask?: boolean | RegExp
  html?: boolean
  tooltip?: string
  letterSpacing?: number
  gradient?: string
  marquee?: boolean
  responsiveFont?: boolean
  typewriter?: boolean
  autoLink?: boolean
}

const Matn: React.FC<MatnProps> = ({
  children,
  highlight = [],
  highlightColor = 'yellow',
  formatNumber = false,
  separator = ' ',
  animateNumber = false,
  duration = 1000,
  font = 'normal',
  color,
  lineCount,
  copyable = false,
  mask = false,
  html = false,
  tooltip,
  letterSpacing,
  gradient,
  marquee = false,
  responsiveFont = false,
  typewriter = false,
  autoLink = false,
}) => {
  const isNumber = typeof children === 'number'

  // Animate Number
  const [numberValue, setNumberValue] = useState(isNumber ? 0 : children)
  useEffect(() => {
    if (!animateNumber || !isNumber) return
    let startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      setNumberValue(Math.floor(progress * (children as number)))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [children, animateNumber, duration, isNumber])

  let text: string | number | ReactNode = animateNumber ? numberValue : children

  // Typewriter effect
  const [typedText, setTypedText] = useState('')
  useEffect(() => {
    if (!typewriter || typeof children !== 'string' || animateNumber) return
    setTypedText('')
    let index = 0
    const interval = setInterval(() => {
      setTypedText((prev) => prev + children[index])
      index++
      if (index >= children.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [children, typewriter, animateNumber])

  if (typewriter && typeof text === 'string' && !animateNumber) {
    text = typedText
  }

  // Process text with useMemo
  const processedText = useMemo(() => {
    let str = text.toString()

    // Apply masking
    if (mask) {
      if (mask instanceof RegExp) {
        str = str.replace(mask, (match) => '*'.repeat(match.length))
      } else if (mask === true) {
        str = '*'.repeat(str.length - 4) + str.slice(-4)
      }
    }

    // Apply number formatting
    if (isNumber && formatNumber) {
      str = formatThousands(Number(str), separator)
    }

    // Apply highlighting
    if (highlight.length && !html) {
      const regex = new RegExp(`(${highlight.join('|')})`, 'gi')
      return str.split(regex).map((part, index) =>
        highlight.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
          <span key={index} style={{ backgroundColor: highlightColor }}>
            {part}
          </span>
        ) : (
          part
        )
      )
    }

    // Apply autoLink
    if (autoLink && !html) {
      return str.split(' ').map((word, index) =>
        /^(https?:\/\/[^\s]+)/.test(word) ? (
          <a key={index} href={word} target='_blank' rel='noopener noreferrer' style={{ color: 'blue' }}>
            {word}{' '}
          </a>
        ) : (
          word + ' '
        )
      )
    }

    return html ? <span dangerouslySetInnerHTML={{ __html: str }} /> : str
  }, [text, formatNumber, separator, mask, highlight, highlightColor, autoLink, html, isNumber])

  // Copy to clipboard
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(children.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <p
      className='Matn-root'
      style={{
        fontStyle: font === 'italic' ? 'italic' : 'normal',
        fontWeight: font === 'bold' ? 'bold' : 'normal',
        display: lineCount ? '-webkit-box' : undefined,
        WebkitBoxOrient: lineCount ? 'vertical' : undefined,
        WebkitLineClamp: lineCount,
        overflow: lineCount ? 'hidden' : 'visible',
        letterSpacing,
        backgroundImage: gradient ? `linear-gradient(${gradient})` : undefined,
        WebkitBackgroundClip: gradient ? 'text' : undefined,
        color: gradient ? 'transparent' : color,
        fontSize: responsiveFont ? 'clamp(1rem, 2vw, 2rem)' : undefined,
        whiteSpace: marquee ? 'nowrap' : undefined,
        overflowX: marquee ? 'hidden' : undefined,
        animation: marquee ? 'marquee 5s linear infinite' : undefined,
      }}
      title={tooltip}
    >
      {processedText}
      {copyable && (
        <button onClick={handleCopy} style={{ marginLeft: '8px' }}>
          📋 {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </p>
  )
}

// Add marquee animation CSS
const styles = `
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`
const styleSheet = document.createElement('style')
styleSheet.textContent = styles
document.head.appendChild(styleSheet)

export default Matn
