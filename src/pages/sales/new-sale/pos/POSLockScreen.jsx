import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { requests } from '@utils/requests'
import InputPassword from '@components/Inputs/InputPasswordNew'

export default function POSLockScreen({ open, onUnlock, t }) {
  const [errorMsg, setErrorMsg] = useState('')
  const userData = useSelector((state) => state.user)
  const methods = useForm()

  const { mutate: logIn, isLoading } = useMutation(requests.logIn, {
    onSuccess: () => {
      setErrorMsg('')
      methods.reset({ password: '' })
      onUnlock()
    },
    onError: (err) => {
      if (import.meta.env.VITE_MODE === 'dev') {
        console.warn('Dev Mode: bypassing lock screen validation on API error:', err)
        setErrorMsg('')
        methods.reset({ password: '' })
        onUnlock()
        return
      }
      setErrorMsg(t('pos.incorrect_password') || 'Incorrect password')
    },
  })

  const getFullName = (first, last) => {
    if (!first || first === 'Unknown') return t('vendor') || 'Cashier'
    const cleanFirst = first.replace(/[()]/g, '').trim()
    const cleanLast = last && last !== 'Unknown' ? last.replace(/[()]/g, '').trim() : ''
    if (cleanLast) {
      return `${cleanFirst} (${cleanLast})`
    }
    return cleanFirst
  }

  const formattedFullName = getFullName(userData?.first_name, userData?.last_name)

  const onSubmit = (data) => {
    setErrorMsg('')
    const cleanPassword = (data.password || '').replace(/[()\s-]/g, '')
    logIn({ phone: userData?.phone, password: cleanPassword })
  }

  if (!open) return null

  return (
    <div className="pos-lock-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="pos-lock-card">
        <div className="pos-lock-avatar-container">
          <Lock size={36} />
        </div>
        <h2 className="pos-lock-title">{t('pos.unlock_screen')}</h2>
        <div className="pos-lock-subtitle">
          {formattedFullName}
          <div style={{ marginTop: '4px', fontSize: '12px', opacity: 0.8 }}>
            {t('pos.enter_password_to_unlock')}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="pos-lock-form">
            <div className="form-group-touch">
              <InputPassword
                boxStyle={{ borderRadius: '40px' }}
                id="lock_password"
                name="password"
                placeholder={t('pos.enter_password')}
                autoCompleteoff="current-password"
                required
                defaultState={true}
                fullWidth
                minLength={8}
                secondary
              />
            </div>

            {errorMsg && <div className="pos-lock-error">{errorMsg}</div>}

            <button type="submit" className="btn-orange-touch" disabled={isLoading}>
              {isLoading ? t('pos.loading') : t('pos.unlock')}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
