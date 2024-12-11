import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material'
import { ReactQueryDevtools } from 'react-query/devtools'
import { createTheme } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material'
import useListenSystemTheme from './hooks/useListenSystemTheme'
import paletteDark from './assets/theme/paletteDark'
import paletteLight from './assets/theme/paletteLight'
import ErrorBoundary from './ErrorBoundary'
import { useQueryParams } from './hooks/useQueryParams'
import { theme } from './assets/theme'
import store from './redux-toolkit/store'
import { CacheProvider } from '@emotion/react'
import { createEmotionCache } from '../utils/createEmotionCache'
import 'dayjs/locale/ru'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeData from 'dayjs/plugin/localeData'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import 'react-datepicker/dist/react-datepicker.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function Providers({ children }) {
  const { values } = useQueryParams()
  const [themeMode, setThemeMode] = useState('auto')
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
      // setThemeMode('light')
      setThemeMode(prefersDarkMode.matches ? 'dark' : 'light')
    } else {
      setThemeMode(user_theme)
    }
  }, [values.theme_changed, prefersDarkMode])

  const muiTheme = useMemo(() => {
    const themeObj = theme({
      palette: themeMode === 'dark' ? paletteDark : paletteLight,
      mode: themeMode,
    })
    return createTheme(themeObj)
  }, [themeMode])

  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default Providers
