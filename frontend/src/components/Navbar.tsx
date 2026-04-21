import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { categoryApi } from '../services/api';
import { Category } from '../types';
import { colors, spacing, layout, buttons, inputs, shadows, borders } from '../styles';

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
        backgroundColor: colors.dark,
        color: colors.background,
        padding: spacing.md,
        ...layout.flexBetween,
        alignItems: 'center'
      }}>
        <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.xl }}>
          <Link to="/" style={{ color: colors.background, textDecoration: 'none' as const, fontSize: '1.2rem', fontWeight: 'bold' as const }}>
            EShop
          </Link>
          <div style={{ ...layout.flex.row, gap: spacing.md }}>
            <Link to="/" style={{
              color: colors.background,
              textDecoration: 'none' as const,
              padding: spacing.sm,
              borderRadius: borders.radius.sm,
              transition: 'background-color 0.3s'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
                  color: colors.background,
                  border: 'none',
                  cursor: 'pointer' as const,
                  padding: spacing.sm,
                  fontSize: '1rem',
                  ...layout.flex.row,
                  alignItems: 'center',
                  gap: spacing.xs,
                  borderRadius: borders.radius.sm,
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
                  marginLeft: spacing.xs
                }}>{isCategoryClicked ? '▲' : '▼'}</span>
              </button>
              {showCategories && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: colors.dark,
                    border: `1px solid #495057`,
                    borderRadius: borders.radius.sm,
                    padding: spacing.sm,
                    minWidth: '150px',
                    zIndex: 1000,
                    boxShadow: shadows.sm
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
                  <div style={{ ...layout.flexBetween, marginBottom: spacing.sm }}>
                    <button
                      onClick={() => {
                        setIsCategoryClicked(false);
                        setShowCategories(false);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.background,
                        border: 'none',
                        cursor: 'pointer' as const,
                        fontSize: '0.8rem',
                        padding: spacing.xs,
                        borderRadius: borders.radius.sm,
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                    </button>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} style={{ marginBottom: spacing.sm }}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left' as const,
                          backgroundColor: 'transparent',
                          color: colors.background,
                          border: 'none',
                          cursor: 'pointer' as const,
                          padding: spacing.xs,
                          borderRadius: borders.radius.sm,
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
                <Link to="/cart" style={{
                  color: colors.background,
                  textDecoration: 'none' as const,
                  padding: spacing.sm,
                  borderRadius: borders.radius.sm,
                  transition: 'background-color 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  购物车
                </Link>
                <Link to="/orders" style={{
                  color: colors.background,
                  textDecoration: 'none' as const,
                  padding: spacing.sm,
                  borderRadius: borders.radius.sm,
                  transition: 'background-color 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  订单
                </Link>
                <Link to="/profile" style={{
                  color: colors.background,
                  textDecoration: 'none' as const,
                  padding: spacing.sm,
                  borderRadius: borders.radius.sm,
                  transition: 'background-color 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  个人中心
                </Link>
              </>
            )}
          </div>
        </div>
        <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.md }}>
          <form onSubmit={handleSearch} style={{ ...layout.flex.row, maxWidth: '300px' }}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索商品..."
              style={{
                padding: spacing.sm,
                borderRadius: '4px 0 0 4px',
                border: 'none',
                height: '36px',
                boxSizing: 'border-box'
              }}
            />
            <button type="submit" style={{
              padding: '0 0.6rem',
              backgroundColor: colors.primary,
              color: colors.background,
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer' as const,
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              搜索
            </button>
          </form>
          {isAuthenticated ? (
            <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.md }}>
              <span>欢迎, {user?.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.3rem 0.6rem',
                  backgroundColor: 'transparent',
                  color: colors.background,
                  border: `1px solid ${colors.background}`,
                  borderRadius: borders.radius.sm,
                  cursor: 'pointer' as const
                }}
              >
                退出登录
              </button>
            </div>
          ) : (
            <div style={{ ...layout.flex.row, gap: spacing.md }}>
              <Link to="/login" style={{
                color: colors.background,
                textDecoration: 'none' as const,
                padding: spacing.sm,
                borderRadius: borders.radius.sm,
                transition: 'background-color 0.3s'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                登录
              </Link>
              <Link to="/register" style={{
                color: colors.background,
                textDecoration: 'none' as const,
                padding: spacing.sm,
                borderRadius: borders.radius.sm,
                transition: 'background-color 0.3s'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
