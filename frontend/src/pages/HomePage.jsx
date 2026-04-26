import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { recommendationService } from '../services/recommendationService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../hooks/useAuth';
import { Sparkles } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      productService.getProducts({ limit: 8, sort: 'newest' }),
      categoryService.getCategories(),
    ]).then(([p, c]) => { setProducts(p.products || []); setCategories(c || []); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      recommendationService.getForYou()
        .then(setRecommendations)
        .catch(() => {});
    } else {
      setRecommendations([]);
    }
  }, [user]);

  if (loading) return <div className="page-loading"><Spinner /></div>;

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <h1>Khám phá phong cách<br /><span>thời trang</span> của bạn</h1>
          <p>Bộ sưu tập mới nhất với gợi ý thông minh bằng AI, giúp bạn tìm trang phục hoàn hảo.</p>
          <Button size="lg" onClick={() => navigate('/products')}>Mua sắm ngay</Button>
        </div>
      </section>

      <div className="container">
        {categories.length > 0 && (
          <section className="home-section">
            <div className="home-section-header"><h2>Danh mục</h2></div>
            <div className="home-categories">
              {categories.filter(c => c.isActive).map((c) => (
                <div key={c._id} className="home-cat-card" onClick={() => navigate(`/products?categoryId=${c._id}`)}>
                  {c.name}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="home-section">
          <div className="home-section-header">
            <h2>Sản phẩm mới</h2>
            <Link to="/products">Xem tất cả →</Link>
          </div>
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>

        {user && recommendations.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Gợi ý cho bạn <Sparkles size={20} color="var(--color-primary)" /></h2>
            </div>
            <div className="product-grid">
              {recommendations.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
