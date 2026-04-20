import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { colors, spacing } from '../styles';

/**
 * 管理员系统布局组件
 * 提供管理员系统的整体布局，包含侧边栏和主内容区域
 */
const AdminLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex' as const }}>
      <Sidebar />
      <div style={{ flex: 1, padding: spacing.xl, backgroundColor: colors.backgroundLight, minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;