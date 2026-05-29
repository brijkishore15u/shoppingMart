import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f6fb',
      padding: 20,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '6rem', marginBottom: 16 }}>🛒</div>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#e31837', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '12px 0 8px' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Oops! Yeh page exist nahi karta ya move ho gaya hai.
      </p>
      <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>
        🏠 Home Pe Jao
      </Link>
    </div>
  );
}
