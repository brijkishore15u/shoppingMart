import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProducts, deleteProduct } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'Fruits & Vegetables', 'Staples', 'Dairy', 'Home Care', 'Snacks', 'Beverages', 'Personal Care', 'Electronics', 'Clothing'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, category]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteModal._id);
      toast.success(`"${deleteModal.name}" deleted successfully!`);
      setDeleteModal(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">📦 Products</h1>
            <p className="page-subtitle">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>
          <Link to="/products/add" className="btn btn-primary" style={{ width: 'auto' }}>
            ➕ Add Product
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="search-bar">
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              style={{ paddingLeft: 42 }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {(search || category !== 'All') && (
            <button
              className="btn btn-secondary"
              onClick={() => { setSearch(''); setCategory('All'); }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        <ErrorMessage message={error} onRetry={fetchProducts} />

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No products found"
            subtitle={search ? `No results for "${search}"` : 'Start by adding your first product'}
            actionLabel="➕ Add Product"
            actionTo="/products/add"
          />
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                onDelete={setDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {deleteModal && (
        <ConfirmModal
          title="🗑️ Delete Product?"
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
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
