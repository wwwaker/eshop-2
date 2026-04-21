import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Product, Category } from '../types';
import { HomeView } from '../contracts';
import { homePresenter } from '../presenters';
import { containers, typography, navigation, images, status, spacing, layout, colors, borders, shadows } from '../styles';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
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
    showImageError: (productId: number) => setImageErrors(prev => ({ ...prev, [productId]: true }))
  }), []);

  useEffect(() => {
    homePresenter.attachView(view);
    homePresenter.loadCategories();
    homePresenter.loadProducts();

    return () => {
      homePresenter.detachView();
    };
  }, [view]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchKeyword(urlSearch);
      setSelectedCategory(null);
    } else {
      setSearchKeyword('');
    }

    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      homePresenter.filterByCategory(selectedCategory);
    } else if (searchKeyword) {
      homePresenter.searchProducts(searchKeyword);
    } else {
      homePresenter.loadProducts();
    }
  }, [selectedCategory, searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    homePresenter.searchProducts(searchKeyword);
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return <div style={containers.loadingContainer}>加载中...</div>;
  }

  if (error) {
    return <div style={containers.errorContainer}>{error}</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <div style={layout.marginBottom.lg}>
        <h1 style={typography.h1}>欢迎来到EShop</h1>
      </div>

      <div style={{ display: 'flex' as const, gap: spacing.lg }}>
        <div style={layout.categorySidebar}>
          <h3 style={typography.h3}>商品分类</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchKeyword('');
                  navigate('/');
                }}
                style={navigation.navButton(selectedCategory === null && !searchKeyword)}
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
                  style={navigation.navButton(selectedCategory === category.id)}
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

        <div style={layout.mainContent}>
          <h2 style={typography.h2}>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : '全部商品'}</h2>
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
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;