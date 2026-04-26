import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const thumb = product.images?.[0] || 'https://placehold.co/300x400/1a1a1a/999?text=No+Image';
  const minPrice = product.minPrice ?? product.variants?.[0]?.price;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <img className="product-card-img" src={thumb} alt={product.name} loading="lazy" />
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        {product.brand && <div className="product-card-brand">{product.brand}</div>}
        {minPrice != null && <div className="product-card-price">{formatPrice(minPrice)}</div>}
      </div>
    </div>
  );
}
