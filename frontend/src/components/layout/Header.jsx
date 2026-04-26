import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Search, ShoppingCart, User } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">FASHION<span>.</span></Link>

        <nav className="header-nav">
          <Link to="/products">Sản phẩm</Link>
          <Link to="/products?targetGender=men">Nam</Link>
          <Link to="/products?targetGender=women">Nữ</Link>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input type="text" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>

          {user && (
            <Link to="/cart" className="header-cart" style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={20} />
              {cart.itemCount > 0 && <span className="cart-badge">{cart.itemCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="header-user" onClick={() => setShowDropdown(!showDropdown)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={18} /> {isAdmin ? 'Admin' : user.fullName?.split(' ').pop()}
              </span>
              {showDropdown && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <Link to="/account" onClick={() => setShowDropdown(false)}>Tài khoản</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)}>Đơn hàng</Link>
                  {isAdmin && <><hr /><Link to="/admin" onClick={() => setShowDropdown(false)}>Quản trị</Link></>}
                  <hr />
                  <button onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
