import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * 管理员系统侧边栏组件
 * 提供管理员系统的导航菜单，包含各个管理模块的链接
 */
const Sidebar: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <div style={{ width: '200px', height: '100vh', backgroundColor: '#343a40', color: 'white', padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
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
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              仪表盘
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/products" 
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              商品管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/categories" 
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              分类管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/orders" 
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              订单管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/users" 
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              用户管理
            </NavLink>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <NavLink 
              to="/logs" 
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#adb5bd',
                backgroundColor: isActive ? '#495057' : 'transparent'
              })}
            >
              日志管理
            </NavLink>
          </li>
        </ul>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Sidebar;