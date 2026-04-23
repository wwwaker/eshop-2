import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Product, Category } from '../types';
import { HomeView } from '../contracts';
import { homePresenter } from '../presenters';
import { containers, typography, navigation, images, status, spacing, layout, colors, shadows } from '../styles';
import { pageStyles } from '../pageStyles';
import PageLoader from '../components/PageLoader';
import useDelayedLoading from '../hooks/useDelayedLoading';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageSize, setPageSize] = useState(10);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const view: HomeView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showProducts: (products: Product[]) => setProducts(products),
    showCategories: (categories: Category[]) => setCategories(categories),
    updateSearchKeyword: (keyword: string) => setSearchKeyword(keyword),
    updateSelectedCategory: (categoryId: number | null) => setSelectedCategory(categoryId),
    showImageError: (productId: number) => setImageErrors(prev => ({ ...prev, [productId]: true })),
    updatePagination: (page: number, totalPages: number, totalElements: number) => {
      setPage(page);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
    }
  }), []);

  useEffect(() => {
    homePresenter.attachView(view);
    homePresenter.loadCategories();

    return () => {
      homePresenter.detachView();
    };
  }, [view]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const categoryId = searchParams.get('category');
    
    if (urlSearch) {
      setSearchKeyword(urlSearch);
      setSelectedCategory(null);
      homePresenter.searchProducts(urlSearch);
    } else if (categoryId) {
      const catId = parseInt(categoryId);
      setSelectedCategory(catId);
      homePresenter.filterByCategory(catId);
    } else {
      setSearchKeyword('');
      setSelectedCategory(null);
      // 确保重置HomePresenter中的状态
      homePresenter.filterByCategory(null);
    }
  }, [searchParams]);

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const shouldShowLoader = useDelayedLoading(loading);

  if (loading && !shouldShowLoader) {
    return null;
  }

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <div style={containers.errorContainer}>{error}</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <div style={{ ...pageStyles.heroSection, padding: spacing.xl }}>
        <h1 style={{ ...typography.h1, ...pageStyles.heroTitle, marginBottom: spacing.sm }}>欢迎来到EShop</h1>
        <p style={pageStyles.heroDescription}>精选好物每日更新，支持分类筛选、关键词搜索与快速下单。</p>
        <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap' as const }}>
          <span style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: colors.accentSoft, color: colors.primary }}>商品 {totalElements} 件</span>
          <span style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: '#eef2ff', color: colors.primary }}>分类 {categories.length} 个</span>
          <span style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: '#ecfdf5', color: colors.success }}>当前第 {page} 页</span>
        </div>
      </div>

      <div style={{ display: 'flex' as const, gap: spacing.lg, alignItems: 'flex-start' as const }}>
        <div
          style={{
            ...layout.categorySidebar,
            position: 'sticky',
            top: '96px',
            ...pageStyles.glassCard,
            borderRadius: '14px',
            padding: spacing.md,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: shadows.sm
          }}
        >
          <h3 style={typography.h3}>商品分类</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchKeyword('');
                  navigate('/');
                }}
                  style={{
                    ...navigation.navButton(selectedCategory === null && !searchKeyword),
                    borderRadius: '10px'
                  }}
                onMouseEnter={(e) => {
                  if (!(selectedCategory === null && !searchKeyword)) {
                    e.currentTarget.style.backgroundColor = colors.light;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(selectedCategory === null && !searchKeyword)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                全部商品
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => {
                    navigate(`/?category=${category.id}`);
                  }}
                  style={{
                    ...navigation.navButton(selectedCategory === category.id),
                    borderRadius: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = colors.light;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            ...layout.mainContent,
            ...pageStyles.glassCard,
            borderRadius: '16px',
            border: `1px solid ${colors.borderLight}`,
            padding: spacing.lg,
            boxShadow: shadows.sm
          }}
        >
          <h2 style={typography.h2}>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : '全部商品'}</h2>
          
          {/* 排序和分页控制 */}
          <div style={layout.sortControl}>
            <div style={layout.sortControlGroup}>
              <span style={{ fontSize: '14px' }}>排序方式:</span>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortField(field);
                  setSortOrder(order);
                  homePresenter.onSortChange(field, order);
                }}
                style={layout.sortSelect}
              >
                <option value="id-desc">最新上架</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
              </select>
            </div>
            <div style={layout.sortControlGroup}>
              <span style={{ fontSize: '14px' }}>每页显示:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  setPageSize(size);
                  homePresenter.onPageSizeChange(size);
                }}
                style={layout.sortSelect}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          <div style={containers.productGrid}>
            {products.map((product) => (
              <div key={product.id} style={containers.productCard} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, containers.productCardHover);
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = shadows.sm;
              }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
                    {product.imageUrl && !imageErrors[product.id] ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                        style={images.product}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, images.productHover)}
                        onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                      />
                    ) : (
                      <div style={images.placeholder}>
                        无图片
                      </div>
                    )}
                  </div>
                  <h3 style={typography.h3}>{product.name}</h3>
                  <p style={typography.textSmall}>{product.description && product.description.length > 50 ? product.description.substring(0, 50) + '...' : (product.description || '')}</p>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: colors.danger }}>¥{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                  <p style={{ ...status.stock, color: product.stock && product.stock > 0 ? colors.success : colors.danger }}>
                    库存: {product.stock || 0}
                  </p>
                  <div style={{ marginTop: spacing.sm, color: colors.primary, fontSize: '0.85rem', fontWeight: 600 }}>
                    查看详情 →
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* 分页控件 */}
          <div style={layout.pagination}>
            <button
              onClick={() => homePresenter.onPageChange(1)}
              disabled={page === 1}
              style={{
                ...layout.paginationButton,
                ...(page === 1 ? layout.paginationButtonDisabled : {})
              }}
            >
              首页
            </button>
            <button
              onClick={() => homePresenter.onPageChange(page - 1)}
              disabled={page === 1}
              style={{
                ...layout.paginationButton,
                ...(page === 1 ? layout.paginationButtonDisabled : {})
              }}
            >
              上一页
            </button>
            <span style={layout.paginationInfo}>
              第 {page} 页，共 {totalPages} 页，{totalElements} 条商品
            </span>
            <button
              onClick={() => homePresenter.onPageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                ...layout.paginationButton,
                ...(page === totalPages ? layout.paginationButtonDisabled : {})
              }}
            >
              下一页
            </button>
            <button
              onClick={() => homePresenter.onPageChange(totalPages)}
              disabled={page === totalPages}
              style={{
                ...layout.paginationButton,
                ...(page === totalPages ? layout.paginationButtonDisabled : {})
              }}
            >
              末页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;