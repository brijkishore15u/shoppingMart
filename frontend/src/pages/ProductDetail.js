import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProduct, deleteProduct } from '../services/api';
import Navbar from '../components/Navbar';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(() => { toast.error('Product not found'); navigate('/products'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      toast.success('Product deleted!');
      navigate('/products');
    } catch {
      toast.error('Delete failed');
      setDeleting(false);
    }
  };

  if (loading) return <><Navbar /><div className="loading-overlay"><div className="spinner" /></div></>;

  const imgSrc = product.image ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || ''}${product.image}` : null;

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">📋 Product Details</h1>
          </div>
          <Link to="/products" className="btn btn-secondary" style={{ width: 'auto' }}>← Back</Link>
        </div>
        <div className="form-page" style={{ maxWidth: 700 }}>
          <div className="form-card">
            {imgSrc ? (
              <img src={imgSrc} alt={product.name} style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }} />
            ) : (
              <div style={{ width: '100%', height: 200, background: 'linear-gradient(135deg,#f0f4ff,#e8f0ff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: 24 }}>📦</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ color: '#e31837', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</p>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0' }}>{product.name}</h2>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#e31837' }}>₹{product.price}</p>
              </div>
              <span className={`badge ${product.stock > 20 ? 'badge-success' : product.stock > 5 ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                Stock: {product.stock}
              </span>
            </div>
            {product.description && (
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>Description</p>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{product.description}</p>
              </div>
            )}
            <div style={{ marginTop: 16, fontSize: '0.85rem', color: '#9ca3af' }}>
              Added: {new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <Link to={`/products/edit/${id}`} className="btn btn-secondary" style={{ flex: 1 }}>✏️ Edit</Link>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowDelete(true)}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Delete Product?</h3>
            <p>Are you sure you want to delete <strong>{product.name}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
