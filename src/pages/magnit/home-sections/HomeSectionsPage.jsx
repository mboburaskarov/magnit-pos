import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, CheckCircle, GripVertical, Eye, EyeOff } from 'lucide-react'
import { magnitHomeSectionsService } from '../../../services/magnit/homeSectionsService'
import { magnitBrandService } from '../../../services/magnit/brandService'
import { magnitCategoryService } from '../../../services/magnit/categoryService'

const typeLabels = { category: 'Категория', brand: 'Бренд', premium_collections: 'Коллекции' }

function SectionTypeBadge({ type }) {
  const cls = type === 'category' ? 'mg-badge-info' : type === 'brand' ? 'mg-badge-purple' : 'mg-badge-warning'
  return <span className={`mg-badge ${cls}`}>{typeLabels[type] || type}</span>
}

export default function HomeSectionsPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  const fetchSections = async () => {
    setLoading(true)
    try {
      const res = await magnitHomeSectionsService.getAll({ limit: 100 })
      setSections((res.data || []).sort((a, b) => a.sort_order - b.sort_order))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchRefs = async () => {
    try {
      const [br, ct] = await Promise.allSettled([
        magnitBrandService.getAll({ limit: 200 }),
        magnitCategoryService.getAll({ limit: 200 }),
      ])
      if (br.status === 'fulfilled') setBrands(br.value?.data || [])
      if (ct.status === 'fulfilled') setCategories(ct.value?.data || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchSections(); fetchRefs() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Удалить секцию?')) return
    try { await magnitHomeSectionsService.delete(id); setSections(p => p.filter(s => s.id !== id)) }
    catch (e) { console.error(e) }
  }

  const handleToggle = async (section) => {
    try {
      await magnitHomeSectionsService.toggleStatus(section.id, !section.is_active)
      setSections(p => p.map(s => s.id === section.id ? { ...s, is_active: !s.is_active } : s))
    } catch (e) { console.error(e) }
  }

  const handleSave = async (payload) => {
    try {
      if (editing) await magnitHomeSectionsService.update(editing.id, payload)
      else await magnitHomeSectionsService.create(payload)
      fetchSections()
      setIsModalOpen(false); setEditing(null)
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div className="mg-page-header">
        <div>
          <h1 className="mg-page-title">Секции главной страницы</h1>
          <p className="mg-page-subtitle">Управляйте блоками на главном экране приложения</p>
        </div>
        <div className="mg-page-actions">
          <button className="mg-btn mg-btn-primary" onClick={() => { setEditing(null); setIsModalOpen(true) }}>
            <Plus size={15} /> Добавить секцию
          </button>
        </div>
      </div>

      <div className="mg-table-card">
        <div className="mg-table-wrap">
          <table className="mg-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>Превью</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Связанный объект</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th style={{ textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(4).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j}><div className="mg-skeleton" style={{ height: 36, width: '75%' }} /></td>)}</tr>
              )) : sections.length === 0 ? (
                <tr><td colSpan={8}><div className="mg-empty"><div className="mg-empty-icon"><ImageIcon size={22} /></div><div className="mg-empty-title">Нет секций</div></div></td></tr>
              ) : sections.map(section => (
                <tr key={section.id}>
                  <td><GripVertical size={14} style={{ color: 'var(--mg-text-muted)', cursor: 'grab' }} /></td>
                  <td>
                    {section.photo
                      ? <img src={section.photo} alt="" className="mg-product-img" />
                      : <div className="mg-product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={14} style={{ color: 'var(--mg-text-muted)' }} /></div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{section.title_ru}</div>
                    <div style={{ fontSize: 11, color: 'var(--mg-text-muted)' }}>{section.title_uz}</div>
                  </td>
                  <td><SectionTypeBadge type={section.type} /></td>
                  <td style={{ fontSize: 12, color: 'var(--mg-text-secondary)' }}>
                    {section.category?.name || section.brand?.title || '—'}
                  </td>
                  <td style={{ color: 'var(--mg-text-secondary)', fontSize: 13 }}>{section.sort_order}</td>
                  <td>
                    <button
                      className={`mg-badge ${section.is_active ? 'mg-badge-success' : 'mg-badge-gray'}`}
                      onClick={() => handleToggle(section)}
                      style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}
                    >
                      {section.is_active ? <><span className="mg-badge-dot" />Активна</> : 'Скрыта'}
                    </button>
                  </td>
                  <td>
                    <div className="mg-table-actions">
                      <button className="mg-table-action-btn" onClick={() => { setEditing(section); setIsModalOpen(true) }}><Edit2 size={14} /></button>
                      <button className="mg-table-action-btn" onClick={() => handleDelete(section.id)} style={{ color: 'var(--mg-danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <HomeSectionModal
          section={editing}
          brands={brands}
          categories={categories}
          onClose={() => { setIsModalOpen(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function HomeSectionModal({ section, brands, categories, onClose, onSave }) {
  const [form, setForm] = useState(section ?? {
    type: 'category', title_uz: '', title_ru: '', title_en: '',
    description_uz: '', description_ru: '', description_en: '',
    category_id: '', brand_id: '', sort_order: 1, is_active: true
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(section?.photo || '')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v.toString())
      }
    })
    if (photoFile) data.append('photo', photoFile)
    await onSave(data)
    setLoading(false)
  }

  return (
    <div className="mg-modal-overlay" onClick={onClose}>
      <div className="mg-modal mg-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="mg-modal-header">
          <h2 className="mg-modal-title">{section ? 'Редактировать секцию' : 'Добавить секцию'}</h2>
          <button className="mg-btn mg-btn-ghost mg-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mg-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="mg-form-group">
              <label className="mg-form-label">Тип секции</label>
              <select className="mg-form-input mg-form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="mg-form-group">
              <label className="mg-form-label">{form.type === 'brand' ? 'Бренд' : form.type === 'category' ? 'Категория' : 'Объект'}</label>
              {form.type === 'brand' ? (
                <select className="mg-form-input mg-form-select" value={form.brand_id ?? ''} onChange={e => set('brand_id', e.target.value)}>
                  <option value="">— выберите бренд —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.title || b.title_ru}</option>)}
                </select>
              ) : form.type === 'category' ? (
                <select className="mg-form-input mg-form-select" value={form.category_id ?? ''} onChange={e => set('category_id', e.target.value)}>
                  <option value="">— выберите категорию —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name || c.name_ru}</option>)}
                </select>
              ) : <input className="mg-form-input" placeholder="Не применимо" disabled />}
            </div>
          </div>
          <div className="mg-form-group">
            <label className="mg-form-label">Фото (необязательно)</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, border: '1px solid var(--mg-border)', overflow: 'hidden', flexShrink: 0, background: 'var(--mg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <ImageIcon size={18} style={{ color: 'var(--mg-text-muted)' }} />}
              </div>
              <input type="file" accept="image/*" className="mg-form-input" style={{ flex: 1 }} onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPreview(URL.createObjectURL(f)) } }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[['title_uz', 'Sarlavha (UZ)'], ['title_ru', 'Заголовок (RU)'], ['title_en', 'Title (EN)']].map(([k, l]) => (
              <div key={k} className="mg-form-group"><label className="mg-form-label">{l}</label><input className="mg-form-input" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} /></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
            <div className="mg-form-group" style={{ width: 90 }}>
              <label className="mg-form-label">Порядок</label>
              <input type="number" className="mg-form-input" value={form.sort_order ?? 1} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', paddingBottom: 2 }}>
              <input type="checkbox" checked={form.is_active !== false} onChange={e => set('is_active', e.target.checked)} />
              <span className="mg-form-label" style={{ margin: 0 }}>Активна</span>
            </label>
          </div>
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
