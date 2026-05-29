import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, error, refetch: fetch };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    import('../services/api').then(({ getProduct }) => {
      getProduct(id)
        .then(r => setProduct(r.data))
        .catch(err => setError(err.response?.data?.message || 'Product not found'))
        .finally(() => setLoading(false));
    });
  }, [id]);

  return { product, loading, error };
}
