import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, CheckCircle, Search, Award } from 'lucide-react'
import { magnitBrandService } from '../../../services/magnit/brandService'

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchBrands = async (q = '') => {
    setLoading(true)
    try {
      const res = await magnitBrandService.getAll({ limit: 100, offset: 0, search: q || undefined })
      setBrands(res.data || [])
      setTotal(res.count || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBrands() }, [])
  useEffect(() => { const t = setTimeout(() => fetchBrands(search), 400); return () => clearTimeout(t) }, [search])

  const handleDelete = async (id) => {
    if (!confirm('Удалить бренд?')) return
    try { await magnitBrandService.delete(id); setBrands(p => p.filter(b => b.id !== id)); setTotal(t => t - 1) }
    catch (e) { console.error(e) }
  }

  const handleSave = async (payload) => {
    try {
      if (editing) await magnitBrandService.update(editing.id, payload)
      else await magnitBrandService.create(payload)
      fetchBrands(search)
      setIsModalOpen(false); setEditing(null)
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div className="mg-page-header">
        <div>
          <h1 className="mg-page-title">Бренды</h1>
          <p className="mg-page-subtitle">{total} бренд{total === 1 ? '' : total < 5 ? 'а' : 'ов'}</p>
        </div>
        <div className="mg-page-actions">
          <button className="mg-btn mg-btn-primary" onClick={() => { setEditing(null); setIsModalOpen(true) }}>
            <Plus size={15} /> Добавить бренд
          </button>
        </div>
      </div>

      <div className="mg-table-card">
        <div className="mg-table-toolbar">
          <div className="mg-table-toolbar-left">
            <div className="mg-table-search">
              <Search size={14} style={{ color: 'var(--mg-text-muted)', flexShrink: 0 }} />
              <input placeholder="Поиск брендов..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mg-table-wrap">
          <table className="mg-table">
            <thead>
              <tr>
                <th>Лого</th><th>Название</th><th>Описание</th><th>Статус</th><th style={{ textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(5).fill(0).map((_, j) => <td key={j}><div className="mg-skeleton" style={{ height: 36, width: '70%' }} /></td>)}</tr>
              )) : brands.length === 0 ? (
                <tr><td colSpan={5}><div className="mg-empty"><div className="mg-empty-icon"><Award size={22} /></div><div className="mg-empty-title">Бренды не найдены</div></div></td></tr>
              ) : brands.map(brand => (
                <tr key={brand.id}>
                  <td>
                    {brand.photo
                      ? <img src={brand.photo} alt="" className="mg-product-img" />
                      : <div className="mg-product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={16} style={{ color: 'var(--mg-text-muted)' }} /></div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{brand.title || brand.title_ru}</div>
                    {brand.title_uz && <div style={{ fontSize: 11, color: 'var(--mg-text-muted)' }}>{brand.title_uz}</div>}
                  </td>
                  <td style={{ color: 'var(--mg-text-secondary)', fontSize: 12, maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand.description || brand.description_ru || '—'}</div>
                  </td>
                  <td>
                    {brand.is_active !== false
                      ? <span className="mg-badge mg-badge-success"><span className="mg-badge-dot" />Активен</span>
                      : <span className="mg-badge mg-badge-gray">Скрыт</span>}
                  </td>
                  <td>
                    <div className="mg-table-actions">
                      <button className="mg-table-action-btn" onClick={() => { setEditing(brand); setIsModalOpen(true) }}><Edit2 size={14} /></button>
                      <button className="mg-table-action-btn" onClick={() => handleDelete(brand.id)} style={{ color: 'var(--mg-danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <BrandModal brand={editing} onClose={() => { setIsModalOpen(false); setEditing(null) }} onSave={handleSave} />}
    </div>
  )
}

function BrandModal({ brand, onClose, onSave }) {
  const [form, setForm] = useState(brand ?? { title: '', title_uz: '', title_ru: '', title_en: '', description: '', description_uz: '', description_ru: '', description_en: '', is_active: true })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(brand?.photo || '')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null) data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v.toString())
    })
    if (photoFile) data.append('photo', photoFile)
    await onSave(data)
    setLoading(false)
  }

  return (
    <div className="mg-modal-overlay" onClick={onClose}>
      <div className="mg-modal mg-modal-md" onClick={e => e.stopPropagation()}>
        <div className="mg-modal-header">
          <h2 className="mg-modal-title">{brand ? 'Редактировать бренд' : 'Добавить бренд'}</h2>
          <button className="mg-btn mg-btn-ghost mg-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mg-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mg-form-group">
            <label className="mg-form-label">Лого</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, border: '1px solid var(--mg-border)', overflow: 'hidden', flexShrink: 0, background: 'var(--mg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <Award size={18} style={{ color: 'var(--mg-text-muted)' }} />}
              </div>
              <input type="file" accept="image/*" className="mg-form-input" style={{ flex: 1 }} onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPreview(URL.createObjectURL(f)) } }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[['title_uz', 'Nomi (UZ)'], ['title_ru', 'Название (RU)'], ['title_en', 'Title (EN)']].map(([k, l]) => (
              <div key={k} className="mg-form-group"><label className="mg-form-label">{l}</label><input className="mg-form-input" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} /></div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[['description_uz', 'Tavsif (UZ)'], ['description_ru', 'Описание (RU)'], ['description_en', 'Description (EN)']].map(([k, l]) => (
              <div key={k} className="mg-form-group"><label className="mg-form-label">{l}</label><textarea className="mg-form-input" rows={2} value={form[k] ?? ''} onChange={e => set(k, e.target.value)} /></div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active !== false} onChange={e => set('is_active', e.target.checked)} />
            <span className="mg-form-label" style={{ margin: 0 }}>Активен</span>
          </label>
        </div>
        <div className="mg-modal-footer">
          <button className="mg-btn mg-btn-secondary" onClick={onClose} disabled={loading}>Отмена</button>
          <button className="mg-btn mg-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'mgSpin 1s linear infinite' }} /> : <CheckCircle size={14} />} Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
