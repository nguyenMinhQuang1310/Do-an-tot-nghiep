import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/ui/Toast';
import { ShoppingCart } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import './CartPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function CartPage() {
  const { cart, loading, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const handleQty = async (itemId, newQty) => {
    try { await updateQty(itemId, newQty); } catch (err) { toast(err.message, 'error'); }
  };

  if (loading) return <div className="page-loading"><Spinner /></div>;

  return (
    <div className="container cart-page">
      <h1 className="page-title">Giỏ hàng ({cart.itemCount})</h1>
      {cart.items.length === 0 ? (
        <EmptyState 
          icon={<ShoppingCart size={48} strokeWidth={1.5} />} 
          title="Giỏ hàng trống" 
          message="Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán."
        >
          <Button style={{ marginTop: 16 }} onClick={() => navigate('/products')}>Mua sắm ngay</Button>
        </EmptyState>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <img className="cart-item-img" src={item.image || item.thumbnail} alt={item.productName} />
                <div className="cart-item-info">
                  <h3>{item.productName}</h3>
                  <p>{item.size} / {item.color} · {item.sku}</p>
                  <div className="cart-item-price">{fmt(item.price)}</div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-subtotal">{fmt(item.subtotal)}</div>
                  <div className="qty-control">
                    <button onClick={() => item.quantity > 1 && handleQty(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item._id)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Tóm tắt</h2>
            <div className="cart-summary-row"><span>Tạm tính ({cart.itemCount} sản phẩm)</span><span>{fmt(cart.totalAmount)}</span></div>
            <div className="cart-summary-row"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
            <div className="cart-summary-total"><span>Tổng</span><span>{fmt(cart.totalAmount)}</span></div>
            <Button block style={{ marginTop: 16 }} onClick={() => navigate('/checkout')}>Thanh toán</Button>
          </div>
        </div>
      )}
    </div>
  );
}
