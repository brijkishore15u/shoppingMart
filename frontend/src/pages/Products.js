import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProducts, deleteProduct, togglePublish } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All','Fruits & Vegetables','Staples','Dairy','Home Care','Snacks','Beverages','Personal Care','Electronics','Clothing'];
const EMOJI = { 'Fruits & Vegetables':'🥦','Staples':'🌾','Dairy':'🥛','Home Care':'🧹','Snacks':'🍿','Beverages':'☕','Personal Care':'🧴','Electronics':'💻','Clothing':'👕' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await getProducts(params);
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); }, [search, category, statusFilter]);

  const handleTogglePublish = async (product) => {
    try {
      await togglePublish(product._id);
      toast.success(`"${product.name}" ${product.isPublished ? 'unpublished' : 'published'}!`);
      fetchProducts();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteModal._id);
      toast.success(`"${deleteModal.name}" deleted!`);
      setDeleteModal(null);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api','') || '';

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">📦 Products</h1>
            <p className="page-subtitle">{loading ? 'Loading...' : `${products.length} products`}</p>
          </div>
          <Link to="/products/add" className="btn btn-primary" style={{width:'auto'}}>➕ Add Product</Link>
        </div>

        {/* Filters */}
        <div className="search-bar">
          <div className="search-input-wrap" style={{flex:1}}>
            <span className="search-icon">🔍</span>
            <input className="form-input" style={{paddingLeft:42}} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {/* Status Filter */}
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{background: statusFilter==='published'?'#f0fdf4': statusFilter==='unpublished'?'#fff5f5':'white'}}>
            <option value="all">All Status</option>
            <option value="published">🟢 Published</option>
            <option value="unpublished">🔴 Unpublished</option>
          </select>
          {(search || category !== 'All' || statusFilter !== 'all') && (
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setCategory('All'); setStatusFilter('all'); }}>✕ Clear</button>
          )}
        </div>

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <EmptyState icon="📭" title="No products found" subtitle="Try different filters or add a product" actionLabel="➕ Add Product" actionTo="/products/add" />
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <div className="product-card" key={p._id}>
                {/* Published badge */}
                <div style={{position:'relative'}}>
                  <div className="product-img" onClick={() => navigate(`/products/${p._id}`)} style={{cursor:'pointer'}}>
                    {p.image
                      ? <img src={`${API_BASE}${p.image}`} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      : <span style={{fontSize:'3rem'}}>{EMOJI[p.category]||'📦'}</span>
                    }
                  </div>
                  {/* Status badge on image */}
                  <span style={{
                    position:'absolute', top:8, right:8,
                    padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700,
                    background: p.isPublished ? '#22c55e' : '#ef4444',
                    color:'white'
                  }}>
                    {p.isPublished ? '● Published' : '● Unpublished'}
                  </span>
                </div>

                <div className="product-body" onClick={() => navigate(`/products/${p._id}`)} style={{cursor:'pointer'}}>
                  <div className="product-category">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">₹{p.price}</div>
                  <div style={{marginTop:6}}>
                    <span className={`badge ${p.stock>20?'badge-success':p.stock>5?'badge-warning':'badge-danger'}`}>
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>

                <div className="product-actions" style={{flexWrap:'wrap', gap:6}}>
                  {/* Publish Toggle Button */}
                  <button
                    onClick={() => handleTogglePublish(p)}
                    style={{
                      flex:'1 1 100%',
                      padding:'7px', border:'none', borderRadius:6, cursor:'pointer',
                      fontWeight:700, fontSize:'0.82rem', fontFamily:'inherit',
                      background: p.isPublished ? '#fff5f5' : '#f0fdf4',
                      color: p.isPublished ? '#ef4444' : '#22c55e',
                      border: `1px solid ${p.isPublished ? '#fca5a5' : '#86efac'}`
                    }}
                  >
                    {p.isPublished ? '🔴 Unpublish' : '🟢 Publish'}
                  </button>
                  <Link to={`/products/edit/${p._id}`} className="btn btn-secondary btn-sm" style={{flex:1}}>✏️ Edit</Link>
                  <button className="btn btn-danger btn-sm" style={{flex:1}} onClick={() => setDeleteModal(p)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModal && (
        <ConfirmModal
          title="🗑️ Delete Product?"
          message={`Are you sure you want to delete "${deleteModal.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          loading={deleting}
          confirmText="Delete"
          danger
        />
      )}
    </>
  );
}
