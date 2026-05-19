/**
 * useBarcodeScanner
 *
 * Global barcode scanner hook. Does NOT require input focus.
 * Collects keydown events at window level, detects scanner pattern
 * (fast sequential characters + Enter), then calls onScan(barcode).
 *
 * - If user is typing in an input/textarea and isBlocking=false, scanner is paused.
 * - Component unmount auto-removes listener (no memory leak).
 */
import { useCallback, useEffect, useRef } from 'react'

const SCANNER_MAX_KEY_INTERVAL_MS = 80   // Max ms between scanner keystrokes
const MIN_BARCODE_LENGTH          = 4    // Min chars to be treated as a barcode

/**
 * @param {object} options
 * @param {function} options.onScan        - called with the scanned barcode string
 * @param {boolean}  [options.enabled]     - whether the scanner is active (default: true)
 * @param {boolean}  [options.blockInputs] - if true, scanner also captures while typing in inputs (default: false)
 */
export function useBarcodeScanner({ onScan, enabled = true, blockInputs = false }) {
  const bufferRef       = useRef('')
  const lastKeyTimeRef  = useRef(0)
  const onScanRef       = useRef(onScan)

  // Keep ref in sync so the listener closure always has latest callback
  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return

    const now      = Date.now()
    const diff     = now - lastKeyTimeRef.current
    lastKeyTimeRef.current = now

    // If user is manually typing in an input, don't intercept
    const isTypingInInput =
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement

    if (isTypingInInput && !blockInputs) {
      // Reset buffer so partial scan doesn't bleed in
      bufferRef.current = ''
      return
    }

    // Long gap → new sequence
    if (diff > SCANNER_MAX_KEY_INTERVAL_MS) {
      bufferRef.current = ''
    }

    // Enter = end of barcode
    if (event.key === 'Enter') {
      const barcode = bufferRef.current.trim()
      if (barcode.length >= MIN_BARCODE_LENGTH) {
        onScanRef.current?.(barcode)
      }
      bufferRef.current = ''
      return
    }

    // Accumulate alphanumeric characters
    if (/^[0-9A-Za-z\-_]$/.test(event.key)) {
      bufferRef.current += event.key
    }
  }, [enabled, blockInputs])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
