import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useToast } from '../components/ui/Toast';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import './OrderListPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const fmtDT = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';
const STEPS = ['pending', 'confirmed', 'shipping', 'delivered'];
const STEP_LABELS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { orderService.getOrderById(id).then(setOrder).finally(() => setLoading(false)); }, [id]);

  const handleCancel = async () => {
    if (!confirm('Bạn chắc chắn muốn hủy đơn hàng?')) return;
    try { const o = await orderService.cancelOrder(id); setOrder(o); toast('Đã hủy đơn hàng'); } catch (err) { toast(err.message, 'error'); }
  };

  if (loading) return <div className="page-loading"><Spinner /></div>;
  if (!order) return null;

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStepIdx = STEPS.indexOf(order.orderStatus);

  return (
    <div className="container order-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Đơn hàng #{order._id.slice(-8).toUpperCase()}</h1>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
          <Badge status={order.paymentStatus}>{order.paymentStatus}</Badge>
        </div>
      </div>

      {!isCancelled && (
        <div className="order-timeline">
          {STEPS.map((step, i) => (
            <div key={step} className="timeline-step">
              <div className={`timeline-dot ${i < currentStepIdx ? 'done' : i === currentStepIdx ? 'active' : ''}`} />
              <div className="timeline-content">
                <strong>{STEP_LABELS[step]}</strong>
                <span>{step === 'pending' && fmtDT(order.createdAt)}{step === 'confirmed' && fmtDT(order.confirmedAt)}{step === 'shipping' && fmtDT(order.shippedAt)}{step === 'delivered' && fmtDT(order.deliveredAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        <div className="order-detail-section">
          <h3>Sản phẩm</h3>
          {order.items.map((item, i) => (
            <div key={i} className="order-item-row">
              <img src={item.image} alt={item.productName} />
              <div><div className="name">{item.productName}</div><div className="meta">{item.size} / {item.color} · x{item.quantity}</div></div>
              <div className="price">{fmt(item.subtotal)}</div>
            </div>
          ))}
          <div className="order-info-row" style={{ marginTop: 'var(--space-md)', fontWeight: 600 }}><span>Tổng</span><span style={{ color: 'var(--color-primary)' }}>{fmt(order.totalAmount)}</span></div>
        </div>

        <div>
          <div className="order-detail-section">
            <h3>Thông tin giao hàng</h3>
            <div className="order-info-row"><span>Người nhận</span><span>{order.shippingAddress.fullName}</span></div>
            <div className="order-info-row"><span>SĐT</span><span>{order.shippingAddress.phone}</span></div>
            <div className="order-info-row"><span>Địa chỉ</span><span>{order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.cityProvince}</span></div>
          </div>
          <div className="order-detail-section" style={{ marginTop: 'var(--space-md)' }}>
            <h3>Thanh toán</h3>
            <div className="order-info-row"><span>Phương thức</span><span>{order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</span></div>
            <div className="order-info-row"><span>Trạng thái</span><Badge status={order.paymentStatus}>{order.paymentStatus}</Badge></div>
          </div>
          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <Button variant="danger" block style={{ marginTop: 'var(--space-md)' }} onClick={handleCancel}>Hủy đơn hàng</Button>
          )}
        </div>
      </div>
    </div>
  );
}
