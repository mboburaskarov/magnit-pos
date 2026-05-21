import React from 'react'
import './PosLayout.css'

export default function POSTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'HOME', label: 'Home' },
    { id: 'SALES ITEM', label: 'Sales Item' },
    { id: 'CUSTOMER', label: 'Customer' },
    { id: 'OMNI-CHANNEL', label: 'Omni-Channel' },
    { id: 'RECEIPT', label: 'Receipt' }
  ]

  return (
    <div className='pos-tabs-segment'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type='button'
            className={`pos-segment-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
