import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/ui/Toast';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Customer pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import OrderManagePage from './pages/admin/OrderManagePage';
import ProductManagePage from './pages/admin/ProductManagePage';
import ProductFormPage from './pages/admin/ProductFormPage';
import CategoryManagePage from './pages/admin/CategoryManagePage';
import UserManagePage from './pages/admin/UserManagePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Customer routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              </Route>

              {/* Admin routes */}
              <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/orders" element={<OrderManagePage />} />
                <Route path="/admin/products" element={<ProductManagePage />} />
                <Route path="/admin/products/new" element={<ProductFormPage />} />
                <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
                <Route path="/admin/categories" element={<CategoryManagePage />} />
                <Route path="/admin/users" element={<UserManagePage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
