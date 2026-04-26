import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { addressService } from '../services/addressService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import './AccountPage.css';

const emptyAddr = { fullName: '', phone: '', street: '', ward: '', district: '', cityProvince: '', note: '' };

export default function AccountPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyAddr);

  const loadAddr = () => addressService.getAddresses().then(setAddresses);
  useEffect(() => { loadAddr(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) await addressService.updateAddress(editId, form);
      else await addressService.createAddress(form);
      toast(editId ? 'Đã cập nhật' : 'Đã thêm địa chỉ');
      setShowModal(false); setEditId(null); setForm(emptyAddr); loadAddr();
    } catch (err) { toast(err.message, 'error'); }
  };

  const openEdit = (a) => { setEditId(a._id); setForm({ fullName: a.fullName, phone: a.phone, street: a.street, ward: a.ward, district: a.district, cityProvince: a.cityProvince, note: a.note || '' }); setShowModal(true); };
  const handleDelete = async (id) => { if (!confirm('Xóa địa chỉ này?')) return; await addressService.deleteAddress(id); toast('Đã xóa'); loadAddr(); };
  const handleDefault = async (id) => { await addressService.setDefault(id); toast('Đã đặt mặc định'); loadAddr(); };

  return (
    <div className="container account-page">
      <h1 className="page-title">Tài khoản</h1>
      <div className="account-grid">
        <div className="account-section">
          <h2>Thông tin cá nhân</h2>
          <div className="profile-row"><span>Họ tên</span><span>{user.fullName}</span></div>
          <div className="profile-row"><span>Email</span><span>{user.email}</span></div>
          <div className="profile-row"><span>SĐT</span><span>{user.phone || '—'}</span></div>
          <div className="profile-row"><span>Vai trò</span><Badge status={user.role === 'admin' ? 'active' : 'confirmed'}>{user.role}</Badge></div>
        </div>

        <div className="account-section">
          <h2>Sổ địa chỉ <Button variant="outline" size="sm" onClick={() => { setEditId(null); setForm(emptyAddr); setShowModal(true); }}>+ Thêm</Button></h2>
          {addresses.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>Chưa có địa chỉ nào.</p> :
            addresses.map((a) => (
              <div key={a._id} className="addr-card">
                <div className="addr-card-header"><strong>{a.fullName} — {a.phone}</strong>{a.isDefault && <Badge status="active">Mặc định</Badge>}</div>
                <p>{a.street}, {a.ward}, {a.district}, {a.cityProvince}</p>
                <div className="addr-card-actions">
                  <button onClick={() => openEdit(a)}>Sửa</button>
                  <button onClick={() => handleDelete(a._id)}>Xóa</button>
                  {!a.isDefault && <button onClick={() => handleDefault(a._id)}>Đặt mặc định</button>}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button><Button onClick={handleSave}>Lưu</Button></>}>
        <form className="addr-form" onSubmit={handleSave}>
          <Input label="Họ tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <Input label="SĐT" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Đường" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
          <Input label="Phường/Xã" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} required />
          <Input label="Quận/Huyện" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
          <Input label="Tỉnh/Thành" value={form.cityProvince} onChange={(e) => setForm({ ...form, cityProvince: e.target.value })} required />
          <Input label="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
