import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>FASHION<span>.</span></h3>
          <p>Website thời trang với trải nghiệm mua sắm hiện đại, tích hợp gợi ý sản phẩm thông minh bằng AI.</p>
        </div>
        <div className="footer-links">
          <h4>Danh mục</h4>
          <Link to="/products?targetGender=men">Thời trang Nam</Link>
          <Link to="/products?targetGender=women">Thời trang Nữ</Link>
          <Link to="/products?targetGender=unisex">Unisex</Link>
          <Link to="/products?targetGender=kids">Trẻ em</Link>
        </div>
        <div className="footer-links">
          <h4>Hỗ trợ</h4>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/orders">Đơn hàng</Link>
          <Link to="/account">Tài khoản</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FASHION. Đồ án tốt nghiệp — Website bán hàng thời trang.</p>
      </div>
    </footer>
  );
}
