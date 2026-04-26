import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { recommendationService } from '../services/recommendationService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/product/ProductCard';
import './ProductDetailPage.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(''); setSelectedColor(''); setQty(1); setSimilarProducts([]);
    productService.getProductBySlug(slug)
      .then((d) => {
        setData(d); setMainImg(d.product?.images?.[0] || '');
        // Log view event (fire-and-forget)
        if (user && d.product) {
          recommendationService.logEvent({
            productId: d.product._id,
            eventType: 'view',
            sourceContext: { pageType: 'product_detail', route: `/products/${slug}` },
          }).catch(() => {});
        }
        // Load similar products
        if (d.product) {
          recommendationService.getSimilar(d.product._id)
            .then(setSimilarProducts).catch(() => {});
        }
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-loading"><Spinner /></div>;
  if (!data) return null;

  const { product, variants } = data;
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];
  const selectedVariant = variants.find((v) => v.size === selectedSize && v.color === selectedColor);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedVariant) { toast('Vui lòng chọn size và màu', 'error'); return; }
    setAdding(true);
    try {
      await addItem(selectedVariant._id, qty);
      toast('Đã thêm vào giỏ hàng!');
      // Log add_to_cart event
      recommendationService.logEvent({
        productId: product._id,
        variantId: selectedVariant._id,
        eventType: 'add_to_cart',
      }).catch(() => {});
    } catch (err) { toast(err.message, 'error'); }
    setAdding(false);
  };

  return (
    <div className="container pdetail">
      <div className="pdetail-grid">
        <div className="pdetail-gallery">
          <img className="pdetail-main-img" src={selectedVariant?.image || mainImg} alt={product.name} />
          {product.images?.length > 1 && (
            <div className="pdetail-thumbs">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" className={mainImg === img ? 'active' : ''} onClick={() => setMainImg(img)} />
              ))}
            </div>
          )}
        </div>

        <div className="pdetail-info">
          <h1>{product.name}</h1>
          {product.brand && <div className="pdetail-brand">{product.brand}</div>}
          <div className="pdetail-price">{selectedVariant ? fmt(selectedVariant.price) : variants.length > 0 ? `Từ ${fmt(Math.min(...variants.map(v => v.price)))}` : 'Liên hệ'}</div>

          {sizes.length > 0 && (
            <div className="pdetail-variants">
              <h3>Size</h3>
              <div className="variant-options">
                {sizes.map((s) => {
                  const hasStock = variants.some((v) => v.size === s && (!selectedColor || v.color === selectedColor) && v.stock > 0);
                  return <button key={s} className={`variant-btn ${selectedSize === s ? 'active' : ''} ${!hasStock ? 'out-of-stock' : ''}`} onClick={() => hasStock && setSelectedSize(s)}>{s}</button>;
                })}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="pdetail-variants">
              <h3>Màu sắc</h3>
              <div className="variant-options">
                {colors.map((c) => {
                  const hasStock = variants.some((v) => v.color === c && (!selectedSize || v.size === selectedSize) && v.stock > 0);
                  return <button key={c} className={`variant-btn ${selectedColor === c ? 'active' : ''} ${!hasStock ? 'out-of-stock' : ''}`} onClick={() => hasStock && setSelectedColor(c)}>{c}</button>;
                })}
              </div>
            </div>
          )}

          {selectedVariant && <div className="pdetail-stock">{selectedVariant.stock > 0 ? `Còn ${selectedVariant.stock} sản phẩm` : 'Hết hàng'}</div>}

          <div className="pdetail-qty">
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>Số lượng</span>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(selectedVariant?.stock || 99, qty + 1))}>+</button>
            </div>
          </div>

          <Button block size="lg" onClick={handleAdd} loading={adding} disabled={!selectedVariant || selectedVariant.stock === 0}>
            {selectedVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>

          {product.description && (
            <div className="pdetail-desc">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section style={{ marginTop: 'var(--space-2xl)' }}>
          <h2 className="section-title">Sản phẩm tương tự</h2>
          <div className="product-grid">
            {similarProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
