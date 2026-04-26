import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import './OrderListPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    orderService.getMyOrders({ page, limit: 10 })
      .then((data) => { setOrders(data.orders); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="page-loading"><Spinner /></div>;

  return (
    <div className="container orders-page">
      <h1 className="page-title">Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <EmptyState title="Chưa có đơn hàng" message="Bạn chưa đặt đơn hàng nào." />
      ) : (
        <>
          {orders.map((o) => (
            <div key={o._id} className="order-card" onClick={() => navigate(`/orders/${o._id}`)}>
              <div className="order-card-header">
                <span className="order-card-id">#{o._id.slice(-8).toUpperCase()}</span>
                <Badge status={o.orderStatus}>{o.orderStatus}</Badge>
              </div>
              <div className="order-card-items">{o.items.length} sản phẩm</div>
              <div className="order-card-footer">
                <span className="order-card-date">{fmtDate(o.createdAt)}</span>
                <span className="order-card-total">{fmt(o.totalAmount)}</span>
              </div>
            </div>
          ))}
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
