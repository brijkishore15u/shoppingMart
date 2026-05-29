import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];
  const lowStock = products.filter(p => p.stock < 10);
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const stats = [
    { icon: '📦', label: 'Total Products', value: products.length, bg: '#fff0f3', color: '#e31837' },
    { icon: '🏷️', label: 'Categories', value: categories.length, bg: '#eff6ff', color: '#0066cc' },
    { icon: '⚠️', label: 'Low Stock', value: lowStock.length, bg: '#fffbeb', color: '#d97706' },
    { icon: '💰', label: 'Inventory Value', value: `₹${(totalValue / 1000).toFixed(1)}K`, bg: '#f0fdf4', color: '#16a34a' },
  ];

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">👋 Welcome, {user?.name}!</h1>
            <p className="page-subtitle">Here's your DMart dashboard overview</p>
          </div>
          <Link to="/products/add" className="btn btn-primary" style={{ width: 'auto' }}>
            ➕ Add Product
          </Link>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-info">
                <h3 style={{ color: s.color }}>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading-overlay"><div className="spinner" /></div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📊 Categories Overview</h2>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {categories.map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <Link key={cat} to={`/products?category=${cat}`}
                      style={{ padding: '8px 16px', background: '#f0f4ff', borderRadius: 20, textDecoration: 'none', color: '#0066cc', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
                      {cat} <span style={{ background: '#0066cc', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: '0.75rem', marginLeft: 4 }}>{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🆕 Recent Products</h2>
                <Link to="/products" style={{ color: '#e31837', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>View All →</Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                      {['Product', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map(p => (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.9rem' }}>{p.category}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#e31837' }}>₹{p.price}</td>
                        <td style={{ padding: '12px' }}>{p.stock}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${p.stock > 20 ? 'badge-success' : p.stock > 5 ? 'badge-warning' : 'badge-danger'}`}>
                            {p.stock > 20 ? 'In Stock' : p.stock > 5 ? 'Low' : 'Critical'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Link to={`/products/${p._id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
