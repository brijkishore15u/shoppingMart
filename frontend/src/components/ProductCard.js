import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_EMOJI = {
  'Fruits & Vegetables': '🥦',
  'Staples': '🌾',
  'Dairy': '🥛',
  'Home Care': '🧹',
  'Snacks': '🍿',
  'Beverages': '☕',
  'Personal Care': '🧴',
  'Electronics': '💻',
  'Clothing': '👕',
};

export default function ProductCard({ product, onEdit, onDelete }) {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
  const imgSrc = product.image ? `${API_BASE}${product.image}` : null;

  const stockStatus =
    product.stock > 20 ? { label: 'In Stock', cls: 'badge-success' } :
    product.stock > 5  ? { label: 'Low Stock', cls: 'badge-warning' } :
                         { label: 'Critical', cls: 'badge-danger' };

  return (
    <div className="product-card">
      <div
        className="product-img"
        onClick={() => navigate(`/products/${product._id}`)}
        style={{ cursor: 'pointer' }}
      >
        {imgSrc
          ? <img src={imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '3rem' }}>{CATEGORY_EMOJI[product.category] || '📦'}</span>
        }
      </div>

      <div
        className="product-body"
        onClick={() => navigate(`/products/${product._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
        <div style={{ marginTop: 6 }}>
          <span className={`badge ${stockStatus.cls}`}>
            {stockStatus.label} ({product.stock})
          </span>
        </div>
        {product.description && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </p>
        )}
      </div>

      <div className="product-actions">
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => onEdit ? onEdit(product) : navigate(`/products/edit/${product._id}`)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          style={{ flex: 1 }}
          onClick={() => onDelete && onDelete(product)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
