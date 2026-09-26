import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-navy-950 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-lg font-bold">Nexora</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 bg-navy-800 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <Link to="/assistant" className="hover:text-white transition-colors">AI Assistant</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link to="/cart"><ShoppingCart className="w-5 h-5" /></Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="text-sm text-ink-400 hover:text-white">Orders</Link>
              <button onClick={handleLogout} className="text-sm text-ink-400 hover:text-white">Log out</button>
              <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-xs font-medium">
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Log in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}