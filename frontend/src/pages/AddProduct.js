import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct } from '../services/api';
import Navbar from '../components/Navbar';

const CATEGORIES = ['Fruits & Vegetables', 'Staples', 'Dairy', 'Home Care', 'Snacks', 'Beverages', 'Personal Care', 'Electronics', 'Clothing'];

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await createProduct(fd);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">➕ Add Product</h1>
            <p className="page-subtitle">Add a new product to the catalog</p>
          </div>
          <Link to="/products" className="btn btn-secondary" style={{ width: 'auto' }}>← Back</Link>
        </div>
        <div className="form-page">
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`} placeholder="e.g. Fresh Apples" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select className={`form-input filter-select ${errors.category ? 'error' : ''}`} style={{ width: '100%' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="error-msg">{errors.category}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input className={`form-input ${errors.price ? 'error' : ''}`} type="number" placeholder="0.00" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  {errors.price && <p className="error-msg">{errors.price}</p>}
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input className="form-input" type="number" placeholder="0" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows={3} placeholder="Product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-area">
                  <input type="file" accept="image/*" onChange={handleImage} />
                  {preview ? (
                    <img src={preview} className="preview-img" alt="preview" />
                  ) : (
                    <>
                      <div className="upload-icon">📸</div>
                      <p className="upload-text"><span>Click to upload</span> or drag & drop</p>
                      <p className="upload-text" style={{ fontSize: '0.8rem', marginTop: 4 }}>PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Link to="/products" className="btn btn-secondary" style={{ flex: 1 }}>Cancel</Link>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 2 }}>
                  {loading ? '⏳ Saving...' : '✅ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
