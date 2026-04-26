import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import './AdminTable.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

export default function UserManagePage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getUsers({ page, limit: 15 })
      .then((data) => { setUsers(data.users); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const handleToggle = async (id) => {
    try { await adminService.toggleUserActive(id); toast('Đã cập nhật'); load(); }
    catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div className="admin-table-page">
      <h1 className="page-title">Quản lý người dùng</h1>
      {loading ? <div className="page-loading"><Spinner /></div> : (
        <>
          <table className="admin-table">
            <thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td><Badge status={u.role === 'admin' ? 'confirmed' : 'active'}>{u.role}</Badge></td>
                  <td><Badge status={u.isActive ? 'active' : 'inactive'}>{u.isActive ? 'Active' : 'Locked'}</Badge></td>
                  <td>{fmtDate(u.createdAt)}</td>
                  <td>
                    <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`} onClick={() => handleToggle(u._id)}>
                      {u.isActive ? 'Khóa' : 'Mở'}
                    </button>
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
