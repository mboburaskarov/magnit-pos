import { useState, useEffect } from 'react'
import { Plus, Bell, Send, Users, AlertCircle, CheckCircle2, Clock, Trash2, X, Loader2 } from 'lucide-react'
import { magnitNotificationService } from '../../../services/magnit/notificationService'

const statusMap = {
  sent: { label: 'Отправлено', cls: 'mg-badge-success' },
  scheduled: { label: 'Запланировано', cls: 'mg-badge-warning' },
  draft: { label: 'Черновик', cls: 'mg-badge-gray' },
  failed: { label: 'Ошибка', cls: 'mg-badge-danger' },
}

const targetMap = {
  all: 'Все',
  abandoned_cart: 'Брошенная корзина',
  ordered_before: 'Ранее заказывали',
  inactive: 'Неактивные',
  custom: 'Выборка',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [notifRes] = await Promise.allSettled([
        magnitNotificationService.getAll({ limit: 50 }),
      ])
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value?.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Удалить уведомление?')) return
    try { await magnitNotificationService.delete(id); setNotifications(p => p.filter(n => n.id !== id)) }
    catch (e) { console.error(e) }
  }

  const handleCreate = async (payload) => {
    try {
      await magnitNotificationService.create(payload)
      fetchData()
      setIsModalOpen(false)
    } catch (e) { console.error(e) }
  }

  const totalSent = notifications.reduce((s, n) => s + (n.sent_count || 0), 0)
  const totalDelivered = notifications.reduce((s, n) => s + (n.delivered_count || 0), 0)
  const totalOpened = notifications.reduce((s, n) => s + (n.opened_count || 0), 0)
  const totalFailed = notifications.reduce((s, n) => s + (n.failed_count || 0), 0)

  return (
    <div>
      <div className="mg-page-header">
        <div>
          <h1 className="mg-page-title">Push-уведомления</h1>
          <p className="mg-page-subtitle">Отправка уведомлений пользователям приложения</p>
        </div>
        <div className="mg-page-actions">
          <button className="mg-btn mg-btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> Создать уведомление
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mg-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Отправлено', value: totalSent.toLocaleString(), icon: <Send size={18} /> },
          { label: 'Доставлено', value: totalDelivered.toLocaleString(), icon: <CheckCircle2 size={18} /> },
          { label: 'Открыто', value: totalOpened.toLocaleString(), icon: <Users size={18} /> },
          { label: 'Ошибок', value: totalFailed.toLocaleString(), icon: <AlertCircle size={18} />, danger: true },
        ].map(kpi => (
          <div key={kpi.label} className="mg-kpi-card">
            <div className="mg-kpi-icon" style={kpi.danger ? { background: 'var(--mg-danger-light)', color: 'var(--mg-danger)' } : {}}>
              {kpi.icon}
            </div>
            <div>
              <div className="mg-kpi-value">{loading ? '—' : kpi.value}</div>
              <div className="mg-kpi-label">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mg-card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: 'var(--mg-text-primary)' }}>История уведомлений</div>
        <div className="mg-table-wrap">
          <table className="mg-table">
            <thead>
              <tr>
                <th>Заголовок</th><th>Аудитория</th><th>Статус</th>
                <th>Отправлено</th><th>Доставлено</th><th>Открыто</th><th>CTR</th><th>Дата</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(3).fill(0).map((_, i) => (
                <tr key={i}>{Array(9).fill(0).map((_, j) => <td key={j}><div className="mg-skeleton" style={{ height: 32, width: '80%' }} /></td>)}</tr>
              )) : notifications.length === 0 ? (
                <tr><td colSpan={9}><div className="mg-empty"><div className="mg-empty-icon"><Bell size={22} /></div><div className="mg-empty-title">Нет уведомлений</div></div></td></tr>
              ) : notifications.map(n => {
                const ctr = n.sent_count > 0 ? ((n.opened_count || 0) / n.sent_count * 100).toFixed(1) + '%' : '0%'
                const s = statusMap[n.status] || { label: n.status, cls: 'mg-badge-gray' }
                return (
                  <tr key={n.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--mg-text-muted)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</div>
                    </td>
                    <td><span className="mg-tag">{targetMap[n.target] || n.target}</span></td>
                    <td><span className={`mg-badge ${s.cls}`}><span className="mg-badge-dot" />{s.label}</span></td>
                    <td style={{ fontWeight: 600 }}>{(n.sent_count || 0).toLocaleString()}</td>
                    <td>{(n.delivered_count || 0).toLocaleString()}</td>
                    <td style={{ color: 'var(--mg-info)', fontWeight: 600 }}>{(n.opened_count || 0).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{ctr}</td>
                    <td style={{ fontSize: 12, color: 'var(--mg-text-secondary)', whiteSpace: 'nowrap' }}>
                      {n.sent_at ? new Date(n.sent_at).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td><button className="mg-table-action-btn" onClick={() => handleDelete(n.id)} style={{ color: 'var(--mg-danger)' }}><Trash2 size={14} /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <NotifModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />}
    </div>
  )
}

function NotifModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', message: '', target: 'all' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.message.trim()) return
    setLoading(true)
    await onCreate(form)
    setLoading(false)
  }

  return (
    <div className="mg-modal-overlay" onClick={onClose}>
      <div className="mg-modal mg-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="mg-modal-header">
          <h2 className="mg-modal-title">Создать уведомление</h2>
          <button className="mg-btn mg-btn-ghost mg-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mg-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mg-form-group">
            <label className="mg-form-label">Заголовок</label>
            <input className="mg-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Летние скидки!" />
          </div>
          <div className="mg-form-group">
            <label className="mg-form-label">Текст сообщения</label>
            <textarea className="mg-form-input" rows={3} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Скидки до 40% на все фрукты..." />
          </div>
          <div className="mg-form-group">
            <label className="mg-form-label">Аудитория</label>
            <select className="mg-form-input mg-form-select" value={form.target} onChange={e => set('target', e.target.value)}>
              {Object.entries(targetMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div className="mg-modal-footer">
          <button className="mg-btn mg-btn-secondary" onClick={onClose} disabled={loading}>Отмена</button>
          <button className="mg-btn mg-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'mgSpin 1s linear infinite' }} /> : <Send size={14} />} Отправить
          </button>
        </div>
      </div>
    </div>
  )
}
