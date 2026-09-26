import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [bulletPoints, setBulletPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = () => {
    api.get('/products').then((res) => setProducts(res.data));
  };

  const handleGenerateDescription = async () => {
    if (!form.name || !bulletPoints) return;
    setGenerating(true);
    try {
      const res = await api.post('/products/generate-description', {
        name: form.name,
        bulletPoints,
        category: form.category,
      });
      setForm((f) => ({ ...f, description: res.data.description }));
    } catch (err) {
      alert('Failed to generate description');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [],
      });
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      setBulletPoints('');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-semibold mb-4">Add Product</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" required />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" required />
            <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" required />
            <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" required />

            <div className="border border-dashed border-ink-200 rounded-lg p-3">
              <p className="text-xs text-ink-400 mb-2">AI description generator — enter bullet points:</p>
              <input placeholder="e.g. eco-friendly, durable, lightweight" value={bulletPoints}
                onChange={(e) => setBulletPoints(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm mb-2" />
              <button type="button" onClick={handleGenerateDescription} disabled={generating}
                className="text-xs bg-purple-500/10 text-purple-500 px-3 py-1.5 rounded-full font-medium disabled:opacity-50">
                {generating ? 'Generating...' : '✨ Generate Description'}
              </button>
            </div>

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" rows={3} required />

            <button type="submit" disabled={saving}
              className="w-full bg-purple-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Products ({products.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((p) => (
              <div key={p._id} className="flex items-center justify-between border border-ink-200 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-ink-400">₹{p.price} · {p.category}</p>
                </div>
                <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}