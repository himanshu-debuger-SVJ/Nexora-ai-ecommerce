import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-10 text-ink-400">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>
      {orders.length === 0 && <p className="text-ink-400 text-sm">No orders yet.</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-ink-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Order #{order._id.slice(-6)}</p>
              <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full capitalize">{order.status}</span>
            </div>
            <p className="text-xs text-ink-400 mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="space-y-1 mb-2">
              {order.items.map((item) => (
                <p key={item._id} className="text-sm text-ink-600">{item.product?.name} × {item.quantity}</p>
              ))}
            </div>
            <p className="text-sm font-bold">Total: ₹{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}