import { useState, useEffect } from 'react'

export function usePwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsInstallable(false)
      console.log('Magnit POS was installed successfully!')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const showInstallPrompt = async () => {
    if (!installPrompt) {
      console.warn('Install prompt event not captured yet.')
      return false
    }
    
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setIsInstallable(false)
      return true
    }
    return false
  }

  return { isInstallable, showInstallPrompt }
}
