import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { colors, spacing, navigation, buttons } from '../styles';

/**
 * 管理员系统侧边栏组件
 * 提供管理员系统的导航菜单，包含各个管理模块的链接
 */
const Sidebar: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <div style={{ width: '200px', height: '100vh', backgroundColor: colors.dark, color: colors.background, padding: spacing.md }}>
      <div style={{ marginBottom: spacing.xl }}>
        <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>EShop 管理系统</h2>
        {user && (
          <div style={{ fontSize: '0.9rem', color: '#adb5bd' }}>
            欢迎，{user.username}
          </div>
        )}
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/dashboard" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              仪表盘
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/products" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              商品管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/categories" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              分类管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/orders" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              订单管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/users" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              用户管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/logs" 
              style={({ isActive }) => navigation.navLink(isActive)}
            >
              日志管理
            </NavLink>
          </li>
        </ul>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={logout}
          style={buttons.logout}
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Sidebar;