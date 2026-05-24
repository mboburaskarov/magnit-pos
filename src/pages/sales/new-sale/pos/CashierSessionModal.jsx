import React, { useState, useEffect } from 'react'
import { X, Users, Lock, FileText, ChevronLeft } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
import SelectSimple from '@components/Select/SelectSimple'
import InputPassword from '@components/Inputs/InputPasswordNew'
import { get } from 'lodash'

export default function CashierSessionModal({
  open,
  onClose,
  onTempLogout,
  onCloseSession,
  t,
}) {
  const [view, setView] = useState('options') // 'options' | 'transfer'
  const userData = useSelector((state) => state.user)
  const methods = useForm()
  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (open) {
      setView('options')
      reset({ employee_id: null, password: '' })
    }
  }, [open, reset])

  const { data: employees } = useQuery(
    'employees-list',
    () => requests.getAllVendors({ store_id: get(userData, 'store.id'), limit: 100, offset: 0 }),
    {
      enabled: open && view === 'transfer',
    }
  )

  const { mutate: createShift, isLoading: isCreateShiftLoading } = useMutation(requests.createShift, {
    onSuccess: ({ data }) => {
      localStorage.setItem('access_token', get(data, 'data.access_token'))
      success(t('menu.sales.shortcuts.change_shift') || 'Cмена изменена')
      location.reload()
      onClose()
    },
    onError: (err) => {
      error(t('error_change_shift') || 'Ошибка при смене смены')
      console.error('err', err)
    },
  })

  const onTransferSubmit = (data) => {
    const requestBody = {
      from_employee_id: userData?.id || undefined,
      to_employee_id: data.employee_id?.id || undefined,
      password: data?.password || undefined,
    }
    createShift(requestBody)
  }

  if (!open) return null

  return (
    <div className="touch-modal-overlay" onClick={onClose}>
      <div className="touch-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="touch-modal-header">
          <div className="touch-modal-userinfo">
            <div className="touch-modal-avatar">
              <Users size={20} />
            </div>
            <div>
              <div className="touch-modal-username" style={{ color: '#ffffff' }}>
                {t('pos.cashier_session')}
              </div>
            </div>
          </div>
          <button className="touch-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="touch-modal-body">
          {view === 'options' ? (
            <div className="cashier-session-options">
              {/* Option 1: Transfer Shift */}
              <button className="cashier-option-card" onClick={() => setView('transfer')}>
                <div className="cashier-option-icon">
                  <Users size={24} />
                </div>
                <div className="cashier-option-info">
                  <div className="cashier-option-title">{t('pos.transfer_shift')}</div>
                  <div className="cashier-option-desc">{t('pos.transfer_shift_desc')}</div>
                </div>
              </button>

              {/* Option 2: Temporary Logout */}
              <button
                className="cashier-option-card"
                onClick={() => {
                  onTempLogout()
                  onClose()
                }}
              >
                <div className="cashier-option-icon">
                  <Lock size={24} />
                </div>
                <div className="cashier-option-info">
                  <div className="cashier-option-title">{t('pos.temp_logout')}</div>
                  <div className="cashier-option-desc">{t('pos.temp_logout_desc')}</div>
                </div>
              </button>

              {/* Option 3: Close Cash Session */}
              <button
                className="cashier-option-card"
                onClick={() => {
                  onCloseSession()
                  onClose()
                }}
              >
                <div className="cashier-option-icon">
                  <FileText size={24} />
                </div>
                <div className="cashier-option-info">
                  <div className="cashier-option-title">{t('pos.close_session')}</div>
                  <div className="cashier-option-desc">{t('pos.close_session_desc')}</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="cashier-transfer-form">
              <button
                className="btn-secondary-touch"
                onClick={() => setView('options')}
                style={{
                  border: 'none',
                  justifyContent: 'flex-start',
                  padding: 0,
                  height: 'auto',
                  marginBottom: '10px',
                  color: 'var(--pos-accent)',
                  gap: '4px',
                }}
              >
                <ChevronLeft size={20} />
                {t('pos.back')}
              </button>

              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onTransferSubmit)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div className="form-group-touch">
                    <SelectSimple
                      fullWidth
                      id="employee_select"
                      borderNone
                      solidBorder
                      name="employee_id"
                      required
                      white
                      isClearable={false}
                      minWidth="auto"
                      label={t('pos.select_cashier')}
                      placeholder={t('pos.select_cashier')}
                      getOptionLabel={(el) => `${el.first_name || ''} ${el.last_name || ''}`}
                      options={employees?.data?.data?.data || []}
                    />
                  </div>

                  <div className="form-group-touch" style={{ marginTop: '8px' }}>
                    <label className="form-label-touch">{t('pos.enter_password')}</label>
                    <InputPassword
                      boxStyle={{ borderRadius: '40px' }}
                      id="password"
                      name="password"
                      placeholder={t('pos.enter_password')}
                      autoCompleteoff="new-password"
                      required
                      defaultState={true}
                      fullWidth
                      minLength={8}
                      secondary
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-orange-touch"
                    style={{ marginTop: '12px' }}
                    disabled={isCreateShiftLoading}
                  >
                    {isCreateShiftLoading ? t('pos.loading') : t('pos.confirm')}
                  </button>
                </form>
              </FormProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
