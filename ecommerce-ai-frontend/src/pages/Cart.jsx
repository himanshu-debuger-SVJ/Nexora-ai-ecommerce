import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get('/cart')
      .then((res) => setCart(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const handleRemove = async (productId) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

    const handleCheckout = async () => {
    setPlacing(true);
    try {
      // 1. Create the order in our DB (status: pending)
      const orderRes = await api.post('/orders');
      const order = orderRes.data;

      // 2. Create a Razorpay order for this order's total
      const payRes = await api.post('/payments/create-order', { orderId: order._id });
      const { razorpayOrderId, amount, currency, keyId } = payRes.data;

      // 3. Open Razorpay checkout widget
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Nexora',
        description: `Order #${order._id.slice(-6)}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/orders');
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#6c4cff' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start checkout');
    } finally {
      setPlacing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) return <p className="max-w-7xl mx-auto px-6 py-10 text-ink-400">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart ({cart.length})</h1>

      {cart.length === 0 && (
        <p className="text-ink-400 text-sm">
          Your cart is empty. <Link to="/shop" className="text-purple-500 font-medium">Start shopping</Link>
        </p>
      )}

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between border border-ink-200 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-ink-50 rounded-lg overflow-hidden">
  {item.product?.images?.[0] && (
    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
  )}
</div>
              <div>
                <p className="text-sm font-medium">{item.product?.name}</p>
                <p className="text-xs text-ink-400">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold">₹{item.product?.price * item.quantity}</p>
              <button onClick={() => handleRemove(item.product._id)} className="text-xs text-red-500">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-ink-200 pt-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">₹{total}</p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={placing}
            className="w-full bg-purple-500 text-white rounded-full py-3 text-sm font-medium disabled:opacity-50"
          >
            {placing ? 'Placing order...' : 'Proceed to Checkout'}
          </button>
        </div>
      )}
    </div>
  );
}