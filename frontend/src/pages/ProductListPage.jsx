import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Search } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import './ProductListPage.css';

const DEBUG_PRODUCTS = import.meta.env.DEV || import.meta.env.VITE_DEBUG_PRODUCTS === 'true';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const filters = {
    page: searchParams.get('page') || '1',
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    targetGender: searchParams.get('targetGender') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  useEffect(() => {
    categoryService.getCategories()
      .then((data) => {
        if (DEBUG_PRODUCTS) console.log('[ProductList][Categories][SUCCESS]', { count: data?.length || 0, data });
        setCategories(data);
      })
      .catch((err) => {
        if (DEBUG_PRODUCTS) console.error('[ProductList][Categories][ERROR]', err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });

    if (DEBUG_PRODUCTS) console.log('[ProductList][Products][REQUEST]', { filters, params });

    productService.getProducts(params)
      .then((data) => {
        if (DEBUG_PRODUCTS) {
          console.log('[ProductList][Products][SUCCESS]', {
            productCount: data?.products?.length || 0,
            pagination: data?.pagination,
            raw: data,
          });
        }
        setProducts(data.products || []);
        setPagination(data.pagination || {});
      })
      .catch((err) => {
        if (DEBUG_PRODUCTS) console.error('[ProductList][Products][ERROR]', err);
      })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="container plist-page">
      <div className="plist-layout">
        <aside className="plist-sidebar">
          <div>
            <h3>Danh mục</h3>
            <div className="filter-options">
              <label><input type="radio" name="cat" checked={!filters.categoryId} onChange={() => updateFilter('categoryId', '')} /> Tất cả</label>
              {categories.filter(c => c.isActive).map((c) => (
                <label key={c._id}><input type="radio" name="cat" checked={filters.categoryId === c._id} onChange={() => updateFilter('categoryId', c._id)} /> {c.name}</label>
              ))}
            </div>
          </div>
          <div>
            <h3>Giới tính</h3>
            <div className="filter-options">
              {[['', 'Tất cả'], ['men', 'Nam'], ['women', 'Nữ'], ['unisex', 'Unisex'], ['kids', 'Trẻ em']].map(([v, l]) => (
                <label key={v}><input type="radio" name="gender" checked={filters.targetGender === v} onChange={() => updateFilter('targetGender', v)} /> {l}</label>
              ))}
            </div>
          </div>
          <div>
            <h3>Sắp xếp</h3>
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="best_selling">Bán chạy</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </aside>

        <div>
          <div className="plist-header">
            <h1>{filters.search ? `Kết quả: "${filters.search}"` : 'Sản phẩm'}</h1>
            <span className="plist-count">{pagination.total || 0} sản phẩm</span>
          </div>
          {loading ? <div className="page-loading"><Spinner /></div> : products.length === 0 ? (
            <EmptyState 
              icon={<Search size={48} strokeWidth={1.5} />} 
              title="Không tìm thấy sản phẩm" 
              message="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm." 
            />
          ) : (
            <>
              <div className="product-grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => updateFilter('page', String(p))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
