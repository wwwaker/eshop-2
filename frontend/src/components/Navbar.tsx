import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { categoryApi } from '../services/api';
import { Category } from '../types';

/**
 * 导航栏组件
 * 提供商城网站的顶部导航功能，包括Logo、分类导航、商品搜索、用户登录状态显示等功能
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [isCategoryClicked, setIsCategoryClicked] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKeyword)}`);
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

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/?category=${categoryId}`);
    setShowCategories(false);
    setIsCategoryClicked(false);
    setSearchKeyword('');
  };

  return (
    <>
      <nav style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
            EShop
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              首页
            </Link>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsCategoryClicked(!isCategoryClicked);
                  setShowCategories(!isCategoryClicked);
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  if (!isCategoryClicked) {
                    setShowCategories(true);
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  if (!isCategoryClicked) {
                    setShowCategories(false);
                  }
                }}
              >
                分类
                <span style={{ 
                  transition: 'transform 0.3s',
                  fontSize: '0.8rem',
                  marginLeft: '0.25rem'
                }}>{isCategoryClicked ? '▲' : '▼'}</span>
              </button>
              {showCategories && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#343a40',
                    border: '1px solid #495057',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    minWidth: '150px',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={() => {
                    if (!isCategoryClicked) {
                      setShowCategories(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isCategoryClicked) {
                      setShowCategories(false);
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setIsCategoryClicked(false);
                        setShowCategories(false);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '0.2rem',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                    </button>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.3rem',
                          borderRadius: '4px',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {category.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isAuthenticated && (
              <>
                <Link to="/cart" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  购物车
                </Link>
                <Link to="/orders" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  订单
                </Link>
                <Link to="/profile" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  个人中心
                </Link>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '300px' }}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索商品..."
              style={{ padding: '0.3rem', borderRadius: '4px 0 0 4px', border: 'none' }}
            />
            <button type="submit" style={{ padding: '0 0.6rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0 4px 4px 0' }}>
              搜索
            </button>
          </form>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>欢迎, {user?.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.3rem 0.6rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                退出登录
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                登录
              </Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                注册
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
