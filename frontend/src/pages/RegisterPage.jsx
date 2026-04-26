import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './LoginPage.css';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản mới</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Số điện thoại" placeholder="0901234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Mật khẩu" type="password" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" block loading={loading}>Đăng ký</Button>
        </form>
        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
