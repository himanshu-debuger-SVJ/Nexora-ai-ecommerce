import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  let filtered = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-ink-400 mb-2">Home / Shop</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shop</h1>
        <p className="text-sm text-ink-400">{filtered.length} products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-sm">Categories</h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setCategoryFilter('')}
                className={`block text-left w-full ${categoryFilter === '' ? 'text-purple-500 font-medium' : 'text-ink-600'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`block text-left w-full capitalize ${categoryFilter === cat ? 'text-purple-500 font-medium' : 'text-ink-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="default">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <div className="md:col-span-3">
          {loading && <p className="text-ink-400 text-sm">Loading products...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-ink-400 text-sm">No products found.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="border border-ink-200 rounded-xl p-4 hover:shadow-lg transition-shadow block"
              >
                <div className="h-32 bg-ink-50 rounded-lg mb-3 overflow-hidden">
  {item.images?.[0] && (
    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
  )}
</div>
                <p className="text-sm font-medium mb-1">{item.name}</p>
                <p className="text-sm font-bold">₹{item.price}</p>
                <p className="text-xs text-ink-400 capitalize">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}