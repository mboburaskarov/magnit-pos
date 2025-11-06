import 'react-datepicker/dist/react-datepicker.css';
import 'dayjs/locale/ru';

import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import localeData from 'dayjs/plugin/localeData';
import { CacheProvider } from '@emotion/react';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { Provider } from 'react-redux';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

import { createEmotionCache } from '../utils/createEmotionCache';
import useListenSystemTheme from './hooks/useListenSystemTheme';
import { useQueryParams } from './hooks/useQueryParams';
import paletteLight from './assets/theme/paletteLight';
import ErrorBoundary from './ErrorBoundary';
import store from './redux-toolkit/store';
import { theme } from './assets/theme';


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
      setThemeMode('light')
      // setThemeMode(prefersDarkMode.matches ? 'dark' : 'light')
    } else {
      setThemeMode(user_theme)
    }
  }, [values.theme_changed, prefersDarkMode])

  const muiTheme = useMemo(() => {
    const themeObj = theme({
      palette: themeMode === 'dark' ? paletteLight : paletteLight,
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
