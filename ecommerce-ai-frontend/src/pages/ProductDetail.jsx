import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setMessage('');
    try {
      await api.post('/cart', { productId: id, quantity: 1 });
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="max-w-7xl mx-auto px-6 py-10 text-ink-400">Loading...</p>;
  if (!product) return <p className="max-w-7xl mx-auto px-6 py-10 text-ink-400">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-ink-400 mb-6">Home / {product.category} / {product.name}</div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-96 bg-ink-50 rounded-xl overflow-hidden">
  {product.images?.[0] && (
    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
  )}
</div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-ink-400 capitalize mb-4">{product.category}</p>
          <p className="text-3xl font-bold mb-6">₹{product.price}</p>
          <p className="text-sm text-ink-600 mb-6">{product.description}</p>
          <p className="text-sm text-ink-400 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="bg-purple-500 text-white rounded-full px-8 py-3 text-sm font-medium disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          {message && <p className="text-sm text-purple-500 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}