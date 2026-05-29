import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 44 }) {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: `4px solid #e5e7eb`,
        borderTopColor: '#e31837',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6fb'
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px'
    }}>
      {spinner}
    </div>
  );
}
