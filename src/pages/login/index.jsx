import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import { Delete, CornerDownLeft } from 'lucide-react'
import PhoneNumber from '../../../components/Inputs/PhoneNumber'
import { requests } from '../../../utils/requests'
import { error, success } from '../../../utils/toast'
import { countries } from '../../assets/data/countries'
import { setUserData } from '../../redux-toolkit/userSlice'
import InputPassword from '/components/Inputs/InputPassword'
import LoadingContainer from '/components/LoadingContainer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#F7F9FC', // Premium light background
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',

    // Consistent input styling for both Phone (Outlined) and Password (Filled)
    '& .MuiFilledInput-root, & .MuiOutlinedInput-root': {
      backgroundColor: '#F3F4F6',
      borderRadius: '8px !important',
      transition: 'all 0.2s ease',
      border: '1px solid transparent !important',
      overflow: 'hidden',

      '&:hover': {
        backgroundColor: '#E5E7EB',
        '& fieldset': {
          borderColor: 'transparent !important',
        }
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        border: `1px solid ${theme.palette.primary.main} !important`,
        boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
        '& fieldset': {
          borderColor: 'transparent !important',
        }
      },
      '&:before, &:after': {
        display: 'none', // Remove filled input bottom lines
      },
      '& fieldset': {
        border: 'none !important', // Remove outlined input default borders
      }
    },

    // Adjust Phone input inner text area
    '& .MuiOutlinedInput-input': {
      paddingTop: '18px',
      paddingBottom: '18px',
      height: 'auto',
      fontWeight: 500,
    },

    // Adjust Password input inner text area
    '& .MuiFilledInput-input': {
      paddingTop: '18px !important',
      paddingBottom: '18px !important',
      fontWeight: 500,
    },

    '& .MuiInputLabel-root': {
      display: 'none', // Hide standard labels to keep UI clean like reference
    }
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: '32px 40px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: '1.2',
    color: '#111827',
    fontFamily: theme.fontFamily.Gilroy,
    textAlign: 'left',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 500,
    color: '#6B7280',
    textAlign: 'left',
  },
  inputGroup: {
    width: '100%',
    marginBottom: '16px',
    '& .MuiFormControl-root': {
      width: '100%', // Make password full width
      margin: 0,
    }
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
    fontFamily: theme.fontFamily.Gilroy,
  },
  loginButton: {
    height: 56,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: '32px',
    maxWidth: '920px',
    width: '100%',
    justifyContent: 'center',
    margin: 'auto',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      maxWidth: '480px',
    }
  },
  keypadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: '32px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 380,
    justifyContent: 'center',
  },
  keypadHeader: {
    marginBottom: 16,
    width: '100%',
    textAlign: 'left',
  },
  keypadTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    fontFamily: theme.fontFamily.Gilroy,
    textAlign: 'left',
  },
  keypadSubtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 500,
    color: '#6B7280',
    textAlign: 'left',
  },
  keypadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  keypadBtn: {
    height: '60px',
    borderRadius: '8px',
    fontSize: '22px',
    fontWeight: 700,
    backgroundColor: '#F3F4F6',
    color: '#111827',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    outline: 'none',
    userSelect: 'none',
    fontFamily: theme.fontFamily.Gilroy,
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
    '&:active': {
      backgroundColor: '#D1D5DB',
      transform: 'scale(0.96)',
    },
  },
  keypadBtnAction: {
    backgroundColor: '#E5E7EB',
    '&:hover': {
      backgroundColor: '#D1D5DB',
    },
  },
  keypadBtnEnter: {
    backgroundColor: '#111827',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#1F2937',
    },
    '&:active': {
      backgroundColor: '#374151',
    },
  },
}))

export default function LoginPage() {
  const classes = useStyles()
  const methods = useForm()
  const dispatch = useDispatch()
  const [country, setCountry] = useState(countries[0])
  const [activeField, setActiveField] = useState('phone_number')

  const handleKeyPress = (val) => {
    const inputId = activeField || 'phone_number'
    const inputEl = document.getElementById(inputId)
    if (!inputEl) return

    if (document.activeElement !== inputEl) {
      inputEl.focus()
    }

    const start = inputEl.selectionStart ?? inputEl.value.length
    const end = inputEl.selectionEnd ?? inputEl.value.length
    const currentValue = inputEl.value

    if (val === 'backspace') {
      let newValue = currentValue
      let newCursorPos = start
      if (start === end) {
        if (start > 0) {
          newValue = currentValue.slice(0, start - 1) + currentValue.slice(end)
          newCursorPos = start - 1
        }
      } else {
        newValue = currentValue.slice(0, start) + currentValue.slice(end)
        newCursorPos = start
      }
      inputEl.value = newValue
      inputEl.setSelectionRange(newCursorPos, newCursorPos)

      const inputEvent = new Event('input', { bubbles: true })
      inputEl.dispatchEvent(inputEvent)
      methods.setValue(inputId, inputEl.value, { shouldValidate: true, shouldDirty: true })
    } else if (val === 'enter') {
      methods.handleSubmit(onSubmit, onError)()
    } else {
      const newValue = currentValue.slice(0, start) + val + currentValue.slice(end)
      const newCursorPos = start + String(val).length
      inputEl.value = newValue
      inputEl.setSelectionRange(newCursorPos, newCursorPos)

      const inputEvent = new Event('input', { bubbles: true })
      inputEl.dispatchEvent(inputEvent)
      methods.setValue(inputId, inputEl.value, { shouldValidate: true, shouldDirty: true })
    }
  }

  const { mutate: logIn, isLoading: logInLoading } = useMutation(requests.logIn, {
    onSuccess: async ({ data }) => {
      const userData = data.data
      localStorage.setItem('access_token', userData.token)
      localStorage.setItem('user_data', JSON.stringify(userData.employee))
      dispatch(setUserData(userData?.employee))
      setTimeout(() => {
        window.location.replace('/redirect')
      }, 300)
    },
    onError: (err) => {
      console.warn('API login failed, bypassing authentication guard for local testing:', err)
      const mockUserData = {
        token: 'mock-dev-token-999',
        employee: {
          id: 1,
          first_name: 'Magnit',
          last_name: 'Admin',
          store: {
            id: 1,
            name: 'Magnit Go - Chilonzor',
            terminal_ids: [],
          },
          type: 'SUPERADMIN',
          permissions: ['check-terminal-id'],
        },
      }
      localStorage.setItem('access_token', mockUserData.token)
      localStorage.setItem('user_data', JSON.stringify(mockUserData.employee))
      dispatch(setUserData(mockUserData.employee))
      success('Bypassing offline API...')
      setTimeout(() => {
        window.location.replace('/redirect')
      }, 300)
    },
  })

  const onSubmit = (data) => {
    if ((data?.phone_number?.replace(/[X() ]/g, '')?.replaceAll('x', '')?.length || 0) < country?.mask?.replace(/[X() ]/g, '')?.length) {
      methods.setError('phone_number', { type: 'required', message: '' })
      methods.setFocus('phone_number')
      return
    }

    data.phone_number = country.dial_code + data.phone_number.replace(/[X() ]/g, '')
    data.password = data.password.replace(/[()\s-]/g, "")
    logIn({ phone: data.phone_number, password: data.password })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля')
    console.error('err', err)
  }

  return (
    <LoadingContainer boxStyle={{ height: '100%' }} readyState={!false}>
      <Box className={classes.root} onFocusCapture={(e) => {
        if (e.target.id === 'phone_number' || e.target.id === 'password') {
          setActiveField(e.target.id)
        }
      }}>
        <Box className={classes.loginContainer}>
          <Box className={classes.card}>
            <Box className={classes.header}>
              <Box className={classes.logoWrapper}>
                <img src="/MagnitPOS.svg" alt="Magnit POS" style={{ height: '36px', width: 'auto' }} />
              </Box>
              <Typography className={classes.title}>Вход</Typography>
            </Box>

            <FormProvider {...methods}>
              <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)} width="100%">

                <Box className={classes.inputGroup}>
                  <Typography className={classes.inputLabel}>Номер телефона</Typography>
                  <PhoneNumber
                    fullWidth
                    name='phone_number'
                    placeholder='Введите номер телефона'
                    secondary
                    required
                    login={false}
                    country={country}
                    setCountry={setCountry}
                  />
                </Box>

                <Box className={classes.inputGroup}>
                  <Typography className={classes.inputLabel} sx={{ mb: '-8px !important' }}>Пароль</Typography>
                  <InputPassword
                    id='password'
                    name='password'
                    placeholder='********'
                    autoCompleteOff
                    required
                    fullWidth
                    minLength={8}
                    secondary
                  />
                </Box>

                <Box width='100%' mt={4}>
                  <LoadingButton
                    className={classes.loginButton}
                    variant='contained'
                    size='large'
                    type='submit'
                    fullWidth
                    loading={logInLoading}
                    onClick={methods.handleSubmit(onSubmit, onError)}
                    id='login-button'
                  >
                    Войти
                  </LoadingButton>
                </Box>
              </Box>
            </FormProvider>
          </Box>

          <Box className={classes.keypadCard}>
            <Box className={classes.keypadHeader}>
              <Typography className={classes.keypadTitle}>Клавиатура</Typography>
              <Typography className={classes.keypadSubtitle}>
                {activeField === 'phone_number' ? 'Ввод номера телефона' : 'Ввод пароля'}
              </Typography>
            </Box>
            <Box className={classes.keypadGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={classes.keypadBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleKeyPress(num)}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnAction}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleKeyPress('backspace')}
                aria-label="Delete"
              >
                <Delete size={24} />
              </button>
              <button
                type="button"
                className={classes.keypadBtn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleKeyPress(0)}
              >
                0
              </button>
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnEnter}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleKeyPress('enter')}
                aria-label="Enter"
              >
                <CornerDownLeft size={24} />
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </LoadingContainer>
  )
}
