import React, { useEffect, useState, useRef } from 'react'

// Default export React component — drop into App.jsx (Vite / Create React App / Next.js client component).
// Uses Tailwind classes for styling. If you don't use Tailwind, replace classes with your own CSS.

export default function PreventRefresh({ isDirty, setShowModal, showModal }) {
  const pendingActionRef = useRef(null) // to hold an action that triggered the modal (e.g., refresh via key)

  // 1) native browser "beforeunload" (shows browser dialog when user refresh/close tab)
  useEffect(() => {
    function onBeforeUnload(e) {
      if (!isDirty) return
      // Most browsers ignore the custom message and show a standard message.
      const message = "Barchasi bekor bo'lib ketadi. Sahifani yangilamoqchimisiz?"
      e.preventDefault()
      e.returnValue = message // required for Chrome
      return message
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  // 2) catch keyboard refresh keys (F5, Ctrl/Cmd+R) and show a custom in-app modal so user gets a nicer message
  useEffect(() => {
    function onKeyDown(e) {
      const isRefreshKey = e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r')
      if (!isRefreshKey) return
      if (!isDirty) return // if nothing to lose — let it through

      e.preventDefault() // stop the browser refresh
      pendingActionRef.current = 'refresh'
      setShowModal(true)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDirty])

  function cancelDiscard() {
    setShowModal(false)
    pendingActionRef.current = null
  }
}
