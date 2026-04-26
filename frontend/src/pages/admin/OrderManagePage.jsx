import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import './AdminTable.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const STATUSES = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

export default function OrderManagePage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (filterStatus) params.orderStatus = filterStatus;
    adminService.getAllOrders(params)
      .then((data) => { setOrders(data.orders); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, filterStatus]);

  const handleStatus = async (id, status) => {
    try { await adminService.updateOrderStatus(id, status); toast(`Đã chuyển sang ${status}`); load(); }
    catch (err) { toast(err.message, 'error'); }
  };

  const handlePayment = async (id) => {
    try { await adminService.updatePaymentStatus(id); toast('Đã xác nhận thanh toán'); load(); }
    catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div className="admin-table-page">
      <h1 className="page-title">Quản lý đơn hàng</h1>
      <div className="admin-filters">
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">Tất cả trạng thái</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div className="page-loading"><Spinner /></div> : (
        <>
          <table className="admin-table">
            <thead><tr><th>Mã đơn</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th><th>Thanh toán</th><th>Ngày</th><th>Thao tác</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.userId?.fullName || '—'}</td>
                  <td>{fmt(o.totalAmount)}</td>
                  <td><Badge status={o.orderStatus}>{o.orderStatus}</Badge></td>
                  <td><Badge status={o.paymentStatus}>{o.paymentStatus}</Badge></td>
                  <td>{fmtDate(o.createdAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      {o.orderStatus === 'pending' && <button className="btn btn-sm btn-outline" onClick={() => handleStatus(o._id, 'confirmed')}>Xác nhận</button>}
                      {o.orderStatus === 'confirmed' && <button className="btn btn-sm btn-outline" onClick={() => handleStatus(o._id, 'shipping')}>Giao hàng</button>}
                      {o.orderStatus === 'shipping' && <button className="btn btn-sm btn-primary" onClick={() => handleStatus(o._id, 'delivered')}>Đã giao</button>}
                      {o.paymentStatus === 'unpaid' && o.paymentMethod === 'bank_transfer' && !['cancelled', 'delivered'].includes(o.orderStatus) && (
                        <button className="btn btn-sm btn-secondary" onClick={() => handlePayment(o._id)}>Xác nhận TT</button>
                      )}
                      {['pending', 'confirmed'].includes(o.orderStatus) && <button className="btn btn-sm btn-danger" onClick={() => handleStatus(o._id, 'cancelled')}>Hủy</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
