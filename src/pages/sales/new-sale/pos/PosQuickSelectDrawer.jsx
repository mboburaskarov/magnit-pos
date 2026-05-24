import React, { useState } from 'react'
import { Drawer } from '@mui/material'
import { X } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
import './PosLayout.css'

const CATEGORIES = [
  { id: 'most_sold', label: 'Most sold' },
  { id: 'bags', label: 'Bags' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'bread', label: 'Bread' },
]

const PRODUCTS_DATA = {
  most_sold: [
    { id: 'bag_1kg', name: 'Bag 1 kg', price: 1000, unit: '1 unit', emoji: '🛍️', query: 'paket' },
    { id: 'water_05l', name: 'Water 0.5L', price: 3000, unit: '0.5 L', emoji: '💧', query: 'suv' },
    { id: 'bread', name: 'Bread', price: 2500, unit: '1 unit', emoji: '🥖', query: 'non' },
    { id: 'milk', name: 'Milk 1L', price: 9000, unit: '1 L', emoji: '🥛', query: 'sut' },
    { id: 'watermelon', name: 'Watermelon', price: 15000, unit: '1 kg', emoji: '🍉', query: 'tarvuz' },
  ],
  bags: [
    { id: 'bag_1kg', name: 'Bag 1 kg', price: 1000, unit: '1 unit', emoji: '🛍️', query: 'paket' },
    { id: 'bag_3kg', name: 'Bag 3 kg', price: 2000, unit: '1 unit', emoji: '🛍️', query: 'paket' },
    { id: 'bag_5kg', name: 'Bag 5 kg', price: 3000, unit: '1 unit', emoji: '🛍️', query: 'paket' },
  ],
  fruits: [
    { id: 'watermelon', name: 'Watermelon', price: 15000, unit: '1 kg', emoji: '🍉', query: 'tarvuz' },
    { id: 'melon', name: 'Melon', price: 20000, unit: '1 kg', emoji: '🍈', query: 'qovun' },
    { id: 'apple', name: 'Apple', price: 12000, unit: '1 kg', emoji: '🍎', query: 'olma' },
    { id: 'banana', name: 'Banana', price: 22000, unit: '1 kg', emoji: '🍌', query: 'banan' },
  ],
  vegetables: [
    { id: 'tomato', name: 'Tomato', price: 14000, unit: '1 kg', emoji: '🍅', query: 'pomidor' },
    { id: 'cucumber', name: 'Cucumber', price: 10000, unit: '1 kg', emoji: '🥒', query: 'bodring' },
    { id: 'potato', name: 'Potato', price: 6000, unit: '1 kg', emoji: '🥔', query: 'kartoshka' },
  ],
  drinks: [
    { id: 'water_05l', name: 'Water 0.5L', price: 3000, unit: '0.5 L', emoji: '💧', query: 'suv' },
    { id: 'coca_cola', name: 'Coca-Cola', price: 11000, unit: '1.5 L', emoji: '🥤', query: 'cola' },
    { id: 'fanta', name: 'Fanta', price: 11000, unit: '1.5 L', emoji: '🥤', query: 'fanta' },
  ],
  bread: [
    { id: 'bread', name: 'Bread', price: 2500, unit: '1 unit', emoji: '🥖', query: 'non' },
    { id: 'patir', name: 'Patir', price: 6000, unit: '1 unit', emoji: '🫓', query: 'patir' },
  ],
}

export default function PosQuickSelectDrawer({ open, onClose, onQuickAdd, isLoading, t }) {
  const [activeCategory, setActiveCategory] = useState('most_sold')

  const products = PRODUCTS_DATA[activeCategory] || []

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      elevation={3}
      classes={{ paper: 'pos-quick-drawer-paper' }}
    >
      {/* Header */}
      <div className="pos-quick-drawer-header">
        <span className="pos-quick-drawer-title">{t('pos.quick_select') || 'Quick select'}</span>
        <button type="button" className="pos-quick-drawer-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="pos-quick-drawer-body">
        {/* Left Side: Product Grid */}
        <div className="pos-quick-grid-area">
          {products.map((prod) => (
            <button
              key={prod.id}
              type="button"
              className="pos-quick-card"
              onClick={() => onQuickAdd(prod.query)}
              disabled={isLoading}
            >
              <div className="pos-quick-card-img-wrapper">
                <span className="pos-quick-card-img">{prod.emoji}</span>
              </div>
              <span className="pos-quick-card-name">{prod.name}</span>
              <div className="pos-quick-card-price-row">
                <span className="pos-quick-card-price">{thousandDivider(prod.price)} UZS</span>
                <span className="pos-quick-card-unit">{prod.unit}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Category List */}
        <div className="pos-quick-sidebar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`pos-quick-category-btn ${activeCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
