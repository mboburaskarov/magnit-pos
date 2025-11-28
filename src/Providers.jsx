import 'dayjs/locale/ru'
import 'react-datepicker/dist/react-datepicker.css'

import { CacheProvider } from '@emotion/react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'

import { createEmotionCache } from '../utils/createEmotionCache'
import { theme } from './assets/theme'
import paletteLight from './assets/theme/paletteLight'
import ErrorBoundary from './ErrorBoundary'
import useListenSystemTheme from './hooks/useListenSystemTheme'
import { useQueryParams } from './hooks/useQueryParams'
import store from './redux-toolkit/store'
import paletteDark from './assets/theme/paletteDark'
import { use } from 'react'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function Providers({ children }) {
  const { values } = useQueryParams()
  const [themeMode, setThemeMode] = useState('dark')
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  const emotionCache = createEmotionCache()
  useListenSystemTheme(setThemeMode)
  //dayjs
  dayjs.extend(utc)
  dayjs.extend(relativeTime)
  dayjs.extend(localeData)
  dayjs.extend(customParseFormat)
  dayjs.extend(updateLocale)
  dayjs.extend(timezone)
  dayjs.extend(duration)

  useEffect(() => {
    const user_theme = localStorage.getItem('user_theme')

    if (!user_theme || user_theme === 'auto') {
      setThemeMode('light')
      // setThemeMode(prefersDarkMode.matches ? 'dark' : 'light')
    } else {
      setThemeMode(user_theme)
    }
  }, [values.theme_changed, prefersDarkMode])
  useEffect(() => {
    const user_language = localStorage.getItem('i18nextLng')

    if (user_language) {
      i18n.changeLanguage(user_language)
    } else {
      i18n.changeLanguage('uz')
    }
  }, [])

  const muiTheme = useMemo(() => {
    const themeObj = theme({
      palette: themeMode === 'dark' ? paletteDark : paletteLight,
      mode: themeMode,
    })
    return createTheme(themeObj)
  }, [themeMode])

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={muiTheme}>
              <StyledEngineProvider injectFirst>
                <ErrorBoundary>{children}</ErrorBoundary>
              </StyledEngineProvider>
            </ThemeProvider>
          </CacheProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </I18nextProvider>
    </Provider>
  )
}

export default Providers
