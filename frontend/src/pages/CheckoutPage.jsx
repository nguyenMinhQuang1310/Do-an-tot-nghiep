import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/ui/Toast';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { Banknote, Landmark } from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import './CheckoutPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    addressService.getAddresses()
      .then((data) => { setAddresses(data); const def = data.find((a) => a.isDefault); if (def) setSelectedAddr(def._id); else if (data.length) setSelectedAddr(data[0]._id); })
      .finally(() => setLoading(false));
  }, []);

  const handleOrder = async () => {
    if (!selectedAddr) { toast('Vui lòng chọn địa chỉ giao hàng', 'error'); return; }
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({ addressId: selectedAddr, paymentMethod });
      await fetchCart();
      toast('Đặt hàng thành công!');
      navigate(`/orders/${order._id}`);
    } catch (err) { toast(err.message, 'error'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-loading"><Spinner /></div>;
  if (!cart.items.length) { navigate('/cart'); return null; }

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Thanh toán</h1>
      <div className="checkout-grid">
        <div>
          <div className="checkout-section">
            <h2>Địa chỉ giao hàng</h2>
            {addresses.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>Chưa có địa chỉ. <a href="/account">Thêm địa chỉ</a></p> : (
              <div className="address-list">
                {addresses.map((a) => (
                  <label key={a._id} className={`address-option ${selectedAddr === a._id ? 'selected' : ''}`}>
                    <input type="radio" name="address" checked={selectedAddr === a._id} onChange={() => setSelectedAddr(a._id)} />
                    <div className="address-details">
                      <strong>{a.fullName} — {a.phone}</strong>
                      <span>{a.street}, {a.ward}, {a.district}, {a.cityProvince}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="checkout-section">
            <h2>Phương thức thanh toán</h2>
            <div className="payment-options">
              {[
                ['cod', 'Thanh toán khi nhận hàng (COD)', Banknote], 
                ['bank_transfer', 'Chuyển khoản ngân hàng', Landmark]
              ].map(([val, label, Icon]) => (
                <label key={val} className={`payment-option ${paymentMethod === val ? 'selected' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon size={18} /> {label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="checkout-items">
          <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Đơn hàng ({cart.itemCount} sản phẩm)</h2>
          {cart.items.map((item) => (
            <div key={item._id} className="checkout-item">
              <span>{item.productName} ({item.size}/{item.color}) x{item.quantity}</span>
              <span>{fmt(item.subtotal)}</span>
            </div>
          ))}
          <div className="checkout-total"><span>Tổng</span><span>{fmt(cart.totalAmount)}</span></div>
          <Button block style={{ marginTop: 'var(--space-md)' }} size="lg" onClick={handleOrder} loading={submitting}>Đặt hàng</Button>
        </div>
      </div>
    </div>
  );
}
