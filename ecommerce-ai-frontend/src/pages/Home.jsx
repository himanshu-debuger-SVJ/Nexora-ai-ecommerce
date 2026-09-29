import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const categories = [
  { name: 'Fashion', emoji: '👕' },
  { name: 'Electronics', emoji: '🎧' },
  { name: 'Home & Living', emoji: '🏠' },
  { name: 'Beauty', emoji: '💄' },
  { name: 'Sports', emoji: '🏃' },
  { name: 'Books', emoji: '📚' },
  { name: 'Toys', emoji: '🧸' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch((err) => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-purple-500/20 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-purple-400 text-sm font-medium mb-3">Your Personal Shopping Assistant</p>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              Smarter Shopping.<br />Powered by AI.
            </h1>
            <p className="text-ink-400 mb-8 max-w-md">
              Get personalized recommendations, find the best deals, and discover products that match your style, needs, and budget.
            </p>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-5 py-3 max-w-md">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <input
                type="text"
                placeholder="Tell me what you're looking for..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
              />
              <button className="bg-purple-500 rounded-full p-2 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="hidden md:block h-80 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-400/20" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-ink-200 hover:border-purple-400 transition-colors"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs text-ink-600">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Trending Right Now</h2>
          <Link to="/shop" className="text-sm text-purple-500 font-medium">View All</Link>
        </div>

        {loading && <p className="text-ink-400 text-sm">Loading products...</p>}
        {!loading && products.length === 0 && (
          <p className="text-ink-400 text-sm">No products yet — add some from the admin panel.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
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
              <p className="text-xs text-ink-400">{item.category}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}