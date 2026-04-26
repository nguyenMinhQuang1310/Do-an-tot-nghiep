import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Package, Shirt, FolderTree, Users, Home, LogOut } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Link to="/admin">FASHION<span>.</span></Link>
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/orders"><Package size={18} /> Đơn hàng</NavLink>
          <NavLink to="/admin/products"><Shirt size={18} /> Sản phẩm</NavLink>
          <NavLink to="/admin/categories"><FolderTree size={18} /> Danh mục</NavLink>
          <NavLink to="/admin/users"><Users size={18} /> Người dùng</NavLink>
          <div className="admin-nav-divider" />
          <NavLink to="/"><Home size={18} /> Về trang chủ</NavLink>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}><LogOut size={18} /> Đăng xuất</button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
