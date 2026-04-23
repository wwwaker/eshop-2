import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { categoryApi } from '../services/api';
import { Category } from '../types';
import { colors, spacing, layout, shadows, borders } from '../styles';

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
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        padding: `${spacing.md} ${spacing.xl}`,
        background: 'rgba(15, 23, 42, 0.86)',
        backdropFilter: 'blur(14px)',
        color: colors.background,
        borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
        ...layout.flexBetween,
        alignItems: 'center'
      }}
    >
      <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.xl }}>
        <Link
          to="/"
          style={{
            color: colors.background,
            textDecoration: 'none',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            letterSpacing: '0.02em'
          }}
        >
          EShop
        </Link>
        <span style={{ color: 'rgba(241,245,249,0.7)', fontSize: '0.85rem' }}>让购物更轻松</span>
        <div style={{ ...layout.flex.row, gap: spacing.sm }}>
          <Link
            to="/"
            style={{
              color: colors.background,
              textDecoration: 'none',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borders.radius.sm,
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
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
                cursor: 'pointer',
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: '1rem',
                ...layout.flex.row,
                alignItems: 'center',
                gap: spacing.xs,
                borderRadius: borders.radius.sm,
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)';
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
              <span style={{ transition: 'transform 0.2s', fontSize: '0.8rem', marginLeft: spacing.xs }}>
                {isCategoryClicked ? '▲' : '▼'}
              </span>
            </button>
            {showCategories && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.4rem)',
                  left: 0,
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: borders.radius.md,
                  padding: spacing.sm,
                  minWidth: '190px',
                  zIndex: 1200,
                  boxShadow: shadows.md
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
                {categories.map((category) => (
                  <div key={category.id} style={{ marginBottom: spacing.xs }}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        color: colors.background,
                        border: 'none',
                        cursor: 'pointer',
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borders.radius.sm,
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
              <Link
                to="/cart"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borders.radius.sm,
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                购物车
              </Link>
              <Link
                to="/orders"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borders.radius.sm,
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                订单
              </Link>
              <Link
                to="/profile"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borders.radius.sm,
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                个人中心
              </Link>
            </>
          )}
        </div>
      </div>
      <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.md }}>
        <form onSubmit={handleSearch} style={{ ...layout.flex.row, maxWidth: '360px' }}>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索商品..."
            style={{
              padding: `0.55rem ${spacing.md}`,
              borderRadius: `${borders.radius.sm} 0 0 ${borders.radius.sm}`,
              border: '1px solid rgba(148, 163, 184, 0.55)',
              borderRight: 'none',
              height: '38px',
              boxSizing: 'border-box',
              outline: 'none',
              backgroundColor: 'rgba(248,250,252,0.96)'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0 0.85rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              color: colors.background,
              border: 'none',
              borderRadius: `0 ${borders.radius.sm} ${borders.radius.sm} 0`,
              cursor: 'pointer',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            搜索
          </button>
        </form>
        {isAuthenticated ? (
          <div style={{ ...layout.flex.row, alignItems: 'center', gap: spacing.md }}>
            <span
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borders.radius.sm,
                backgroundColor: 'rgba(6, 182, 212, 0.18)',
                fontSize: '0.9rem'
              }}
            >
              欢迎，{user?.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                backgroundColor: 'transparent',
                color: colors.background,
                border: `1px solid rgba(241, 245, 249, 0.65)`,
                borderRadius: borders.radius.sm,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              退出登录
            </button>
          </div>
        ) : (
          <div style={{ ...layout.flex.row, gap: spacing.sm }}>
            <Link to="/login" style={{
              color: colors.background,
              textDecoration: 'none',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borders.radius.sm,
              transition: 'background-color 0.3s'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              登录
            </Link>
            <Link
              to="/register"
              style={{
                color: colors.background,
                textDecoration: 'none',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borders.radius.sm,
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              注册
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
