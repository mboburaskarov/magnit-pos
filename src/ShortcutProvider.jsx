import React, { createContext, useContext, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const ShortcutContext = createContext()

export const ShortcutProvider = ({ children }) => {
  const globalShortcuts = {
    'ctrl+s': () => alert('Global Save Shortcut'),
    'ctrl+h': () => alert('Global Help Shortcut'),
  }

  useEffect(() => {
    // Attach global shortcuts
    Object.entries(globalShortcuts).forEach(([shortcut, handler]) => {
      useHotkeys(shortcut, handler, { enableOnTags: ['INPUT', 'TEXTAREA'] })
    })
  }, [])

  return <ShortcutContext.Provider value={{ globalShortcuts }}>{children}</ShortcutContext.Provider>
}

export const useShortcut = () => useContext(ShortcutContext)
