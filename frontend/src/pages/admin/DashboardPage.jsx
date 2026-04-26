import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';
import './DashboardPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getOverview(),
      adminService.getRevenue({ groupBy: 'day' }),
      adminService.getBestSelling({ limit: 10 }),
    ]).then(([o, r, b]) => { setOverview(o); setRevenue(r); setBestSelling(b); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><Spinner /></div>;

  const maxRev = Math.max(...revenue.map((r) => r.revenue), 1);

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card-label">Doanh thu</div><div className="stat-card-value revenue">{fmt(overview?.totalRevenue || 0)}</div></div>
        <div className="stat-card"><div className="stat-card-label">Tổng đơn hàng</div><div className="stat-card-value">{overview?.totalOrders || 0}</div></div>
        <div className="stat-card"><div className="stat-card-label">Đơn chờ xử lý</div><div className="stat-card-value">{overview?.pendingOrders || 0}</div></div>
        <div className="stat-card"><div className="stat-card-label">Sản phẩm</div><div className="stat-card-value">{overview?.totalProducts || 0}</div></div>
      </div>

      {revenue.length > 0 && (
        <div className="chart-section">
          <h2>Doanh thu theo ngày</h2>
          <div className="chart-bars">
            {revenue.slice(-14).map((r, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div className="chart-bar-value">{r.revenue > 0 ? (r.revenue / 1e6).toFixed(1) + 'M' : ''}</div>
                <div className="chart-bar" style={{ height: `${(r.revenue / maxRev) * 100}%` }} />
                <div className="chart-bar-label">{r._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="best-selling">
        <h2>Sản phẩm bán chạy</h2>
        {bestSelling.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>Chưa có dữ liệu</p> :
          bestSelling.map((b, i) => (
            <div key={i} className="best-row">
              <div style={{ display: 'flex', alignItems: 'center' }}><span className="rank">{i + 1}</span>{b.productName}</div>
              <span style={{ color: 'var(--color-text-muted)' }}>{b.totalQuantity} đã bán · {fmt(b.totalRevenue)}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
