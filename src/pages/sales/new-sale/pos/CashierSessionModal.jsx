import React, { useState, useEffect } from 'react'
import { X, Users, Lock, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
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
  const [showCashierList, setShowCashierList] = useState(false)
  const [cashierSearchQuery, setCashierSearchQuery] = useState('')
  const userData = useSelector((state) => state.user)
  const methods = useForm()
  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (open) {
      setView('options')
      setShowCashierList(false)
      setCashierSearchQuery('')
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

  const selectedCashier = methods.watch('employee_id')
  const passwordVal = methods.watch('password')
  const isConfirmDisabled = !selectedCashier || !passwordVal || passwordVal.length === 0 || isCreateShiftLoading

  const employeeList = employees?.data?.data?.data || []
  const filteredEmployees = employeeList.filter((emp) => {
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase()
    return fullName.includes(cashierSearchQuery.toLowerCase())
  })

  if (!open) return null

  return (
    <div className="touch-modal-overlay" onClick={onClose}>
      <div className="touch-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="touch-modal-header pos-std-header">
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
          <button type="button" className="pos-std-close-btn" onClick={onClose}>
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
              {showCashierList ? (
                <div>
                  <button
                    className="btn-secondary-touch"
                    onClick={() => setShowCashierList(false)}
                    style={{
                      border: 'none',
                      justifyContent: 'flex-start',
                      padding: 0,
                      height: 'auto',
                      marginBottom: '14px',
                      color: 'var(--pos-accent)',
                      gap: '4px',
                    }}
                  >
                    <ChevronLeft size={20} />
                    {t('pos.back') || 'Назад'}
                  </button>

                  <div className="pos-cashier-search-wrapper">
                    <input
                      type="text"
                      className="pos-cashier-search-input"
                      placeholder={t('pos.search_cashier') || 'Qidirish...'}
                      value={cashierSearchQuery}
                      onChange={(e) => setCashierSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="pos-cashier-list-scroll">
                    {filteredEmployees.map((emp) => {
                      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`
                      const isSelected = selectedCashier?.id === emp.id
                      return (
                        <div
                          key={emp.id}
                          className={`pos-cashier-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            methods.setValue('employee_id', emp, { shouldValidate: true })
                            setShowCashierList(false)
                          }}
                        >
                          <div className="pos-cashier-details">
                            <span className="pos-cashier-name">{fullName}</span>
                            <span className="pos-cashier-meta">
                              {emp.role ? `${emp.role}` : ''} {emp.phone ? ` | ${emp.phone}` : ''}
                            </span>
                          </div>
                          {isSelected && <Check size={20} color="var(--pos-accent)" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div>
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
                    {t('pos.back') || 'Назад'}
                  </button>

                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onTransferSubmit)}
                      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                      <div className="form-group-touch">
                        <label className="form-label-touch">{t('pos.select_cashier') || 'Выберите кассира'}</label>
                        
                        {selectedCashier ? (
                          <div className="pos-selected-cashier-card">
                            <div className="pos-cashier-details">
                              <span className="pos-cashier-name">
                                {`${selectedCashier.first_name || ''} ${selectedCashier.last_name || ''}`}
                              </span>
                              <span className="pos-cashier-meta">
                                {selectedCashier.role ? `${selectedCashier.role}` : ''} {selectedCashier.phone ? ` | ${selectedCashier.phone}` : ''}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="pos-change-cashier-btn"
                              onClick={() => setShowCashierList(true)}
                            >
                              {t('pos.change') || 'Изменить'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="pos-touch-select-trigger"
                            onClick={() => setShowCashierList(true)}
                          >
                            <span>{t('pos.select_cashier') || 'Выберите кассира'}</span>
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </div>

                      {selectedCashier && (
                        <>
                          <div className="form-group-touch" style={{ marginTop: '8px' }}>
                            <label className="form-label-touch">{t('pos.enter_password') || 'Введите пароль'}</label>
                            <InputPassword
                              boxStyle={{ borderRadius: '12px' }}
                              id="password"
                              name="password"
                              placeholder={t('pos.enter_password') || 'Введите пароль'}
                              autoCompleteoff="new-password"
                              required
                              defaultState={true}
                              fullWidth
                              secondary
                            />
                          </div>

                          {/* Numeric Keypad for Password Input */}
                          <div className="pos-numeric-keypad">
                            <div className="pos-keypad-grid">
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                                let btnClass = 'pos-keypad-btn'
                                if (key === 'C' || key === '⌫') {
                                  btnClass = 'pos-keypad-btn action-btn'
                                }
                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    className={btnClass}
                                    onClick={() => {
                                      const currentPass = methods.getValues('password') || ''
                                      if (key === 'C') {
                                        methods.setValue('password', '', { shouldValidate: true })
                                      } else if (key === '⌫') {
                                        methods.setValue('password', currentPass.slice(0, -1), { shouldValidate: true })
                                      } else {
                                        methods.setValue('password', currentPass + key, { shouldValidate: true })
                                      }
                                    }}
                                  >
                                    {key}
                                  </button>
                                )
                              })}
                            </div>
                            <button
                              type="submit"
                              className="pos-keypad-btn enter-btn"
                              style={{ marginTop: '8px' }}
                              disabled={isConfirmDisabled}
                            >
                              {isCreateShiftLoading ? t('pos.loading') || 'Загрузка...' : t('pos.confirm') || 'Подтвердить'}
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  </FormProvider>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
