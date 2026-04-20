/**
 * 管理员系统API服务模块
 * 封装与后端管理员API的所有交互方法
 */
import axios from 'axios';
import { User, Category, Product, Order, ApiResponse } from '../types';

// API基础URL，可以根据环境配置修改为服务器的IP地址
const API_BASE_URL = 'http://localhost:8080/api/admin';

// 创建axios实例，配置基础URL和请求头
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 携带凭证信息
});

// 响应拦截器，统一处理后端响应格式
axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;
    // 如果响应已经是 ApiResponse 格式，直接返回
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return response;
    }
    // 否则，将数据包装成 ApiResponse 格式
    response.data = {
      success: true,
      data: data
    };
    return response;
  },
  (error) => {
    // 错误处理
    if (error.response) {
      const errorData = error.response.data;
      error.response.data = {
        success: false,
        error: errorData.message || errorData.error || '服务器错误',
        data: null
      };
    } else {
      error.response = {
        data: {
          success: false,
          error: '网络错误，请检查网络连接',
          data: null
        }
      };
    }
    return Promise.reject(error);
  }
);

/**
 * 认证相关API
 * 提供登录、登出和获取当前用户信息的方法
 */
export const authApi = {
  /**
   * 管理员登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录响应，包含token和用户信息
   */
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>('/login', { username, password });
    return response.data;
  },
  
  /**
   * 管理员登出
   * @returns 登出响应
   */
  logout: async () => {
    const response = await axiosInstance.post<ApiResponse<void>>('/logout');
    return response.data;
  },
  
  /**
   * 获取当前登录的管理员用户信息
   * @returns 当前用户信息
   */
  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>('/user');
    return response.data;
  },
};

/**
 * 仪表盘数据API
 * 提供获取系统统计数据的方法
 */
export const dashboardApi = {
  /**
   * 获取仪表盘数据
   * @returns 仪表盘统计数据
   */
  getDashboardData: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>('/dashboard');
    return response.data;
  },
};

/**
 * 用户管理API
 * 提供用户的增删改查方法
 */
export const userApi = {
  /**
   * 获取所有用户列表
   * @returns 用户列表
   */
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/users');
    return response.data;
  },
  
  /**
   * 根据ID获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
  
  /**
   * 更新用户信息
   * @param user 用户信息
   * @returns 更新后的用户信息
   */
  update: async (user: User) => {
    const response = await axiosInstance.put<ApiResponse<User>>(`/users/${user.id}`, user);
    return response.data;
  },
  
  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除响应
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },
  
  /**
   * 创建用户
   * @param user 用户信息（不包含id、createdAt）
   * @returns 创建的用户信息
   */
  create: async (user: Omit<User, 'id' | 'createdAt'>) => {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', user);
    return response.data;
  },

  /**
   * 获取用户列表（支持筛选、排序）
   * @param queryParams 查询参数字符串
   * @returns 用户列表
   */
  getAllWithFilters: async (queryParams: string) => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(`/users?${queryParams}`);
    return response.data;
  },
};

/**
 * 商品管理API
 * 提供商品的增删改查方法
 */
export const productApi = {
  /**
   * 获取所有商品列表
   * @returns 商品列表
   */
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },
  
  /**
   * 根据ID获取商品信息
   * @param id 商品ID
   * @returns 商品信息
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  
  /**
   * 创建新商品
   * @param product 商品信息（不包含id、createdAt、updatedAt）
   * @returns 创建的商品信息
   */
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosInstance.post<ApiResponse<Product>>('/products', product);
    return response.data;
  },
  
  /**
   * 更新商品信息
   * @param product 商品信息
   * @returns 更新后的商品信息
   */
  update: async (product: Product) => {
    const response = await axiosInstance.put<ApiResponse<Product>>(`/products/${product.id}`, product);
    return response.data;
  },
  
  /**
   * 删除商品
   * @param id 商品ID
   * @returns 删除响应
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },
  
  /**
   * 批量移动商品到其他分类
   * @param fromCategoryId 源分类ID
   * @param toCategoryId 目标分类ID
   * @returns 移动的商品数量
   */
  moveToCategory: async (fromCategoryId: number, toCategoryId: number) => {
    const response = await axiosInstance.post<ApiResponse<number>>('/products/move', {
      fromCategoryId,
      toCategoryId,
    });
    return response.data;
  },

  /**
   * 获取商品列表（支持筛选、排序、分页）
   * @param queryParams 查询参数字符串
   * @returns 商品列表
   */
  getAllWithFilters: async (queryParams: string) => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>(`/products?${queryParams}`);
    return response.data;
  },
};

/**
 * 分类管理API
 * 提供分类的增删改查方法
 */
export const categoryApi = {
  /**
   * 获取所有分类列表
   * @returns 分类列表
   */
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },
  
  /**
   * 根据ID获取分类信息
   * @param id 分类ID
   * @returns 分类信息
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
  
  /**
   * 创建新分类
   * @param category 分类信息（不包含id、createdAt）
   * @returns 创建的分类信息
   */
  create: async (category: Omit<Category, 'id' | 'createdAt'>) => {
    const response = await axiosInstance.post<ApiResponse<Category>>('/categories', category);
    return response.data;
  },
  
  /**
   * 更新分类信息
   * @param category 分类信息
   * @returns 更新后的分类信息
   */
  update: async (category: Category) => {
    const response = await axiosInstance.put<ApiResponse<Category>>(`/categories/${category.id}`, category);
    return response.data;
  },
  
  /**
   * 删除分类
   * @param id 分类ID
   * @returns 删除响应
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },

  /**
   * 获取分类列表（支持筛选、排序）
   * @param queryParams 查询参数字符串
   * @returns 分类列表
   */
  getAllWithFilters: async (queryParams: string) => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>(`/categories?${queryParams}`);
    return response.data;
  },
};

/**
 * 订单管理API
 * 提供订单的查询和状态更新方法
 */
export const orderApi = {
  /**
   * 获取所有订单列表
   * @returns 订单列表
   */
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  },
  
  /**
   * 根据ID获取订单信息
   * @param id 订单ID
   * @returns 订单信息
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },
  
  /**
   * 标记订单为已发货
   * @param id 订单ID
   * @returns 更新后的订单信息
   */
  shipOrder: async (id: number) => {
    const response = await axiosInstance.post<ApiResponse<Order>>(`/orders/${id}/ship`);
    return response.data;
  },

  /**
   * 获取订单列表（支持筛选、排序）
   * @param queryParams 查询参数字符串
   * @returns 订单列表
   */
  getAllWithFilters: async (queryParams: string) => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(`/orders?${queryParams}`);
    return response.data;
  },
};

/**
 * 图片上传API
 * 提供文件上传相关的方法
 */
export const uploadApi = {
  /**
   * 上传图片
   * @param file 图片文件
   * @returns 上传结果，包含图片URL
   */
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<any>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
};

/**
 * 商品管理API（补充方法）
 */
// 直接扩展现有 productApi 对象
Object.assign(productApi, {
  /**
   * 创建商品
   * @param product 商品信息
   * @returns 创建结果
   */
  create: async (product: any) => {
    const response = await axiosInstance.post<ApiResponse<Product>>('/products', product);
    return response.data;
  },
  
  /**
   * 更新商品
   * @param id 商品ID
   * @param product 商品信息
   * @returns 更新结果
   */
  update: async (id: number, product: any) => {
    const response = await axiosInstance.put<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data;
  },
  
  /**
   * 根据ID获取商品
   * @param id 商品ID
   * @returns 商品信息
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
});
