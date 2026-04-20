/**
 * 用户上下文组件
 * 管理管理员系统的全局用户状态
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

/**
 * 用户上下文类型
 */
interface UserContextType {
  user: User | null; // 当前登录的用户信息
  isAuthenticated: boolean; // 是否已认证
  isLoading: boolean; // 是否正在加载认证状态
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: (user: User) => void; // 登出方法
}

// 创建用户上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * 用户上下文钩子
 * 用于在组件中访问用户状态
 * @returns 用户上下文
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * 用户提供者组件
 * 包装应用，提供用户状态管理
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // 用户状态
  const [isLoading, setIsLoading] = useState(true); // 加载状态

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * 检查认证状态
   * 从后端获取当前登录用户信息
   */
  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 登录方法
   * @param username 用户名
   * @param password 密码
   * @returns 登录是否成功
   */
  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  /**
   * 登出方法
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  // 上下文值
  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser: (user: User) => setUser(user),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
