import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import './AdminTable.css';

export default function CategoryManagePage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');

  const load = () => { import('../../services/categoryService').then(m => m.categoryService.getCategories().then(setCategories)); };
  useEffect(load, []);

  const handleSave = async () => {
    try {
      if (editId) await adminService.updateCategory(editId, { name });
      else await adminService.createCategory({ name });
      toast(editId ? 'Đã cập nhật' : 'Đã tạo danh mục');
      setShowModal(false); setEditId(null); setName(''); load();
    } catch (err) { toast(err.message, 'error'); }
  };

  const handleToggle = async (id) => {
    try { await adminService.toggleCategoryActive(id); load(); } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div className="admin-table-page">
      <div className="admin-table-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Quản lý danh mục</h1>
        <Button onClick={() => { setEditId(null); setName(''); setShowModal(true); }}>+ Thêm danh mục</Button>
      </div>
      <table className="admin-table">
        <thead><tr><th>Tên</th><th>Slug</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td style={{ color: 'var(--color-text-muted)' }}>{c.slug}</td>
              <td><Badge status={c.isActive ? 'active' : 'inactive'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></td>
              <td>
                <div className="admin-table-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => { setEditId(c._id); setName(c.name); setShowModal(true); }}>Sửa</button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleToggle(c._id)}>{c.isActive ? 'Ẩn' : 'Hiện'}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Sửa danh mục' : 'Thêm danh mục'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button><Button onClick={handleSave}>Lưu</Button></>}>
        <Input label="Tên danh mục" value={name} onChange={(e) => setName(e.target.value)} />
      </Modal>
    </div>
  );
}
