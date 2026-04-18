import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

/**
 * 用户上下文类型定义
 * 包含用户状态和操作方法
 */
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

/**
 * 用户上下文
 * 用于在组件树中共享用户状态
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * 使用用户上下文的Hook
 * @throws Error 如果在UserProvider外部使用
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * 用户上下文提供者属性
 */
interface UserProviderProps {
  children: ReactNode;
}

/**
 * 用户上下文提供者组件
 * 管理全局用户状态，包括登录状态、用户信息更新和登出功能
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  /**
   * 更新用户信息
   * 同时更新状态和本地存储
   */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /**
   * 用户登出
   * 清除用户状态和本地存储
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, isAuthenticated: !!user, logout }}>
      {children}
    </UserContext.Provider>
  );
};
