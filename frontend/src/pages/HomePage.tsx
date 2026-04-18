import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import { Product, Category } from '../types';

/**
 * 首页组件
 * 展示商品列表和分类筛选功能，支持按分类和关键词搜索
 */
const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

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
      loadProductsByCategory(selectedCategory);
    } else if (searchKeyword) {
      searchProducts(searchKeyword);
    } else {
      loadProducts();
    }
  }, [selectedCategory, searchKeyword]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('加载商品失败');
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (categoryId: number) => {
    setLoading(true);
    try {
      const data = await productApi.getByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError('加载商品失败');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      loadProducts();
      return;
    }
    setLoading(true);
    try {
      const data = await productApi.search(keyword);
      setProducts(data);
    } catch (err) {
      setError('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('加载分类失败:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchKeyword);
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>欢迎来到EShop</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '200px' }}>
          <h3>商品分类</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchKeyword('');
                  navigate('/');
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  backgroundColor: selectedCategory === null && !searchKeyword ? '#e9ecef' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedCategory === null && !searchKeyword ? '#e9ecef' : '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCategory === null && !searchKeyword ? '#e9ecef' : 'transparent'}
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
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem',
                    backgroundColor: selectedCategory === category.id ? '#e9ecef' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedCategory === category.id ? '#e9ecef' : '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCategory === category.id ? '#e9ecef' : 'transparent'}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h2>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : '全部商品'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map((product) => (
              <div key={product.id} style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    {product.imageUrl && !imageErrors[product.id] ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                        style={{ maxWidth: '100%', maxHeight: '100%', transition: 'transform 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        无图片
                      </div>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{product.description && product.description.length > 50 ? product.description.substring(0, 50) + '...' : (product.description || '')}</p>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#dc3545' }}>¥{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                  <p style={{
                    margin: '0',
                    fontSize: '0.8rem',
                    color: product.stock && product.stock > 0 ? '#28a745' : '#dc3545'
                  }}>
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
