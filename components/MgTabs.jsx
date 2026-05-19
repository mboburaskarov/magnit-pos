import React from 'react'
import { Box } from '@mui/material'
import StyledTooltip from './StyledTooltip'
import { Info } from '@mui/icons-material'
import thousandDivider from '@utils/thousandDivider'

export default function MgTabs({ activeTab, onChange, tabs, style }) {
  return (
    <div
      className='mg-tabs'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--mg-border)',
        overflowY: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type='button'
              className={`mg-tab ${isActive ? 'active' : ''}`}
              onClick={() => onChange(tab.value)}
              style={{
                padding: '12px 0px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive ? '#111217' : '#667085',
                borderBottom: isActive ? '2px solid #111217' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {tab.tooltip ? (
                <Box display='inline-flex' alignItems='center' gap='4px'>
                  <span>{tab.title}</span>
                  <StyledTooltip title={tab.tooltip}>
                    <Info sx={{ fontSize: 12, color: 'bunker.300' }} />
                  </StyledTooltip>
                </Box>
              ) : (
                <span>{tab.title}</span>
              )}

              {typeof tab.count !== 'undefined' && (
                <span
                  className='tab-count'
                  style={{
                    fontSize: '11px',
                    background: isActive ? '#111111' : '#f1f3f5',
                    color: isActive ? '#ffffff' : '#667085',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontWeight: 500,
                  }}
                >
                  {thousandDivider(tab.count)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
