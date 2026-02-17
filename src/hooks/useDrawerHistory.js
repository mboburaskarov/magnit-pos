import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook that integrates drawer open/close with browser history.
 * When the drawer opens, a history entry is pushed.
 * When the user presses the browser back button, the drawer closes first
 * instead of navigating away from the page.
 *
 * @param {boolean|string|number} isOpen - Truthy value means the drawer is open
 * @param {function} onClose - Function to close the drawer, receives `false`
 *
 * Usage:
 *   const [openDrawer, setOpenDrawer] = useState(false)
 *   useDrawerHistory(openDrawer, setOpenDrawer)
 */
export function useDrawerHistory(isOpen, onClose) {
  const isDrawerOpen = useRef(false)

  useEffect(() => {
    if (isOpen && !isDrawerOpen.current) {
      // Drawer just opened — push a history entry so the back button can close it
      isDrawerOpen.current = true
      window.history.pushState({ drawerOpen: true }, '')
    } else if (!isOpen && isDrawerOpen.current) {
      // Drawer was closed programmatically (not via back button)
      // We don't need to go back since the drawer is already closing
      isDrawerOpen.current = false
    }
  }, [isOpen])

  useEffect(() => {
    const handlePopState = (event) => {
      if (isDrawerOpen.current) {
        // Browser back button was pressed while drawer is open — close the drawer
        isDrawerOpen.current = false
        onClose(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [onClose])
}
