import React from 'react';

export default function PublishToggle({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px',
      background: value ? '#f0fdf4' : '#fff5f5',
      border: `2px solid ${value ? '#86efac' : '#fca5a5'}`,
      borderRadius: 10,
      marginBottom: 18,
      transition: 'all 0.3s'
    }}>
      <div>
        <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>
          {value ? '🟢 Published' : '🔴 Unpublished'}
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '3px 0 0' }}>
          {value ? 'Product is visible to users' : 'Product is hidden from users'}
        </p>
      </div>
      {/* Toggle Switch */}
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 52, height: 28,
          background: value ? '#22c55e' : '#d1d5db',
          borderRadius: 14,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.3s',
          flexShrink: 0
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3,
          left: value ? 26 : 3,
          width: 22, height: 22,
          background: 'white',
          borderRadius: '50%',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );
}
