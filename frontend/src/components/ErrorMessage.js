import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: 10,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      margin: '16px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.2rem' }}>❌</span>
        <span style={{ color: '#991b1b', fontWeight: 600 }}>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#ef4444', color: 'white', border: 'none',
            borderRadius: 6, padding: '6px 14px', fontWeight: 700,
            cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
