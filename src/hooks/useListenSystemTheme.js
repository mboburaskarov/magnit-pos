import { useEffect } from 'react'

export default function useListenSystemTheme(setThemeMode) {
  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches }) => {
        setThemeMode(matches ? 'dark' : 'light')
      })
  }, [setThemeMode])
}
