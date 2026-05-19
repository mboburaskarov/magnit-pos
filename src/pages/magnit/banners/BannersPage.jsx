import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, CheckCircle, Smartphone, Search } from 'lucide-react'
import { magnitBannerService } from '../../../services/magnit/bannerService'

function StatusBadge({ active }) {
  return active
    ? <span className="mg-badge mg-badge-success"><span className="mg-badge-dot" />Активен</span>
    : <span className="mg-badge mg-badge-gray">Скрыт</span>
}

export default function BannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await magnitBannerService.getAll({ limit: 100 })
      setBanners((res.data || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
    } catch (e) {
      console.error('Ошибка загрузки баннеров', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBanners() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Удалить баннер?')) return
    try {
      await magnitBannerService.delete(id)
      setBanners(prev => prev.filter(b => b.id !== id))
    } catch (e) { console.error(e) }
  }

  const handleToggleStatus = async (banner) => {
    try {
      await magnitBannerService.update(banner.id, { is_active: !banner.is_active })
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
    } catch (e) { console.error(e) }
  }

  const handleSave = async (payload) => {
    try {
      if (editingBanner) {
        await magnitBannerService.update(editingBanner.id, payload)
      } else {
        await magnitBannerService.create(payload)
      }
      fetchBanners()
      setIsModalOpen(false)
      setEditingBanner(null)
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      {/* Left: table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mg-page-header">
          <div>
            <h1 className="mg-page-title">Баннеры</h1>
            <p className="mg-page-subtitle">Управление главной страницей приложения</p>
          </div>
          <div className="mg-page-actions">
            <button className="mg-btn mg-btn-primary" onClick={() => { setEditingBanner(null); setIsModalOpen(true) }}>
              <Plus size={15} /> Добавить Баннер
            </button>
          </div>
        </div>

        <div className="mg-table-card">
          <div className="mg-table-wrap">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>Превью</th>
                  <th>Заголовок</th>
                  <th>Тип Ссылки</th>
                  <th>Статус</th>
                  <th>Начало / Конец</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j}><div className="mg-skeleton" style={{ height: 40, width: '80%' }} /></td>
                      ))}
                    </tr>
                  ))
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="mg-empty">
                        <div className="mg-empty-icon"><ImageIcon size={24} /></div>
                        <div className="mg-empty-title">Баннеры не найдены</div>
                      </div>
                    </td>
                  </tr>
                ) : banners.map(banner => (
                  <tr key={banner.id}>
                    <td>
                      <img
                        src={banner.photo} alt=""
                        className="mg-product-img"
                        style={{ width: 80, height: 44 }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{banner.title}</div>
                      {banner.title_uz && <div style={{ fontSize: 11, color: 'var(--mg-text-muted)' }}>{banner.title_uz}</div>}
                    </td>
                    <td>
                      <span className="mg-tag">{banner.link_type || '—'}</span>
                    </td>
                    <td>
                      <div onClick={() => handleToggleStatus(banner)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <StatusBadge active={banner.is_active} />
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--mg-text-secondary)' }}>
                      <div>{banner.start_date ? new Date(banner.start_date).toLocaleDateString('ru') : '∞'}</div>
                      <div style={{ opacity: .6 }}>{banner.end_date ? new Date(banner.end_date).toLocaleDateString('ru') : '∞'}</div>
                    </td>
                    <td>
                      <div className="mg-table-actions">
                        <button className="mg-table-action-btn" onClick={() => { setEditingBanner(banner); setIsModalOpen(true) }}>
                          <Edit2 size={14} />
                        </button>
                        <button className="mg-table-action-btn" onClick={() => handleDelete(banner.id)} style={{ color: 'var(--mg-danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: phone preview */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Smartphone size={16} style={{ color: 'var(--mg-text-secondary)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mg-text-primary)' }}>Превью в приложении</span>
          </div>
          <div style={{ width: 320, height: 640, background: '#fff', border: '10px solid #111', borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: 'var(--mg-shadow-lg)' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 26, background: '#111', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 100 }} />
            <div style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
              <div style={{ padding: '36px 14px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 28, height: 28, background: '#111', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 15 }}>M</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1 }}>MagnitGo</div>
                      <div style={{ fontSize: 10, color: '#666' }}>Tashkent City ▾</div>
                    </div>
                  </div>
                  <div style={{ padding: '3px 7px', background: '#f0f0f0', borderRadius: 20, fontSize: 9, fontWeight: 700 }}>🌐 EN</div>
                </div>
                <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, color: '#999', fontSize: 11 }}>
                  <Search size={13} /> Search products, brands...
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px 16px', scrollbarWidth: 'none' }}>
                {banners.filter(b => b.is_active).slice(0, 3).map(banner => (
                  <div key={banner.id} style={{ width: 200, flexShrink: 0, height: 220, borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#f0f0f0' }}>
                    <img src={banner.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14, color: '#fff' }}>
                      <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>{banner.title?.toUpperCase()}</div>
                      <div style={{ fontWeight: 700, fontSize: 10 }}>SHOP NOW</div>
                    </div>
                  </div>
                ))}
                {banners.filter(b => b.is_active).length === 0 && (
                  <div style={{ width: '100%', height: 160, borderRadius: 16, border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12 }}>No active banners</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BannerModal banner={editingBanner} onClose={() => { setIsModalOpen(false); setEditingBanner(null) }} onSave={handleSave} />
      )}
    </div>
  )
}

function BannerModal({ banner, onClose, onSave }) {
  const [form, setForm] = useState(banner ?? { title: '', title_uz: '', title_ru: '', title_en: '', description_uz: '', description_ru: '', description_en: '', link_type: 'none', is_active: true, sort_order: 1, photo: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(banner?.photo || '')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = e => {
    const file = e.target.files?.[0]
    if (file) { setPhotoFile(file); setPreview(URL.createObjectURL(file)); set('photo', '') }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null && k !== 'photo') {
        data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v.toString())
      }
    })
    if (photoFile) data.append('photo', photoFile)
    else if (form.photo) data.append('photo_url', form.photo)
    await onSave(data)
    setLoading(false)
  }

  return (
    <div className="mg-modal-overlay" onClick={onClose}>
      <div className="mg-modal mg-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="mg-modal-header">
          <h2 className="mg-modal-title">{banner ? 'Редактировать баннер' : 'Добавить баннер'}</h2>
          <button className="mg-btn mg-btn-ghost mg-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mg-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="mg-form-group">
            <label className="mg-form-label">Фото (файл или URL)</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, border: '1px solid var(--mg-border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mg-surface-2)' }}>
                {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <ImageIcon size={18} style={{ color: 'var(--mg-text-muted)' }} />}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="file" accept="image/*" className="mg-form-input" onChange={handleFile} />
                <input className="mg-form-input" value={form.photo ?? ''} onChange={e => { set('photo', e.target.value); if (e.target.value) { setPreview(e.target.value); setPhotoFile(null) } else setPreview('') }} placeholder="Или URL: https://..." />
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[['title_uz', 'Sarlavha (UZ)'], ['title_ru', 'Заголовок (RU)'], ['title_en', 'Title (EN)']].map(([k, l]) => (
              <div key={k} className="mg-form-group">
                <label className="mg-form-label">{l}</label>
                <input className="mg-form-input" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[['description_uz', 'Tavsif (UZ)'], ['description_ru', 'Описание (RU)'], ['description_en', 'Description (EN)']].map(([k, l]) => (
              <div key={k} className="mg-form-group">
                <label className="mg-form-label">{l}</label>
                <textarea className="mg-form-input" rows={2} value={form[k] ?? ''} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
            <div className="mg-form-group" style={{ flex: 1 }}>
              <label className="mg-form-label">Тип ссылки</label>
              <select className="mg-form-input mg-form-select" value={form.link_type} onChange={e => set('link_type', e.target.value)}>
                <option value="none">Без ссылки</option>
                <option value="category">Категория</option>
                <option value="product">Продукт</option>
                <option value="external">Внешняя ссылка</option>
              </select>
            </div>
            <div className="mg-form-group" style={{ width: 80 }}>
              <label className="mg-form-label">Порядок</label>
              <input type="number" className="mg-form-input" value={form.sort_order ?? 1} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', paddingBottom: 2 }}>
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
              <span className="mg-form-label" style={{ margin: 0 }}>Активен</span>
            </label>
          </div>
        </div>
        <div className="mg-modal-footer">
          <button className="mg-btn mg-btn-secondary" onClick={onClose} disabled={loading}>Отмена</button>
          <button className="mg-btn mg-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'mgSpin 1s linear infinite' }} /> : <CheckCircle size={14} />}
            Сохранить
          </button>
        </div>
      </div>
      <style>{`@keyframes mgSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
