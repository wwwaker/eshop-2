import axios from 'axios';
import { User, Product, Category, CartItem, Order } from '../types';

/**
 * API服务模块
 * 封装与后端API交互的所有请求，包括用户、商品、分类、购物车和订单等模块
 */

// API基础URL配置，可以根据环境配置修改为服务器的IP地址
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * 用户相关API
 * 提供用户登录、注册、个人信息更新等功能
 */
export const userApi = {
  login: async (username: string, password: string, captcha: string) => {
    const response = await api.post('/users/login', { username, password, captcha });
    return response.data;
  },
  getCaptcha: async () => {
    const response = await api.get('/users/captcha');
    return response.data;
  },
  register: async (user: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/users/register', user);
    return response.data;
  },
  sendCode: async (email: string) => {
    const response = await api.post('/users/send-code', { email });
    return response.data;
  },
  updateProfile: async (user: Partial<User>) => {
    const response = await api.put('/users/profile', user);
    return response.data;
  },
  checkUsername: async (username: string) => {
    const response = await api.get(`/users/check-username?username=${username}`);
    return response.data;
  },
  checkEmail: async (email: string) => {
    const response = await api.get(`/users/check-email?email=${email}`);
    return response.data;
  },
};

/**
 * 商品相关API
 * 提供商品列表、分类查询、搜索商品等功能
 */
export const productApi = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data as Product[];
  },
  getByCategory: async (categoryId: number) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data as Product[];
  },
  search: async (keyword: string) => {
    const response = await api.get(`/products/search?keyword=${keyword}`);
    return response.data as Product[];
  },
  getSearchSuggestions: async (keyword: string) => {
    const response = await api.get(`/products/search-suggestions?keyword=${keyword}`);
    return response.data as string[];
  },
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data as Product;
  },
  getPaginated: async (page: number, size: number, search?: string, sortField?: string, sortOrder?: string, categoryId?: number) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (search) params.append('search', search);
    if (sortField) params.append('sortField', sortField);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (categoryId) params.append('categoryId', categoryId.toString());
    
    const response = await api.get(`/products/paginated?${params.toString()}`);
    return response.data;
  },
};

/**
 * 商品分类相关API
 * 提供分类列表和单个分类查询功能
 */
export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data as Category[];
  },
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data as Category;
  },
};

/**
 * 购物车相关API
 * 提供购物车商品管理、数量更新、清空购物车等功能
 */
export const cartApi = {
  getItems: async (userId: number) => {
    const response = await api.get(`/cart/${userId}`);
    return response.data as CartItem[];
  },
  addItem: async (userId: number, productId: number, quantity: number) => {
    const response = await api.post('/cart/add', { userId, productId, quantity });
    return response.data;
  },
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.put('/cart/update', { cartItemId, quantity });
    return response.data;
  },
  removeItem: async (cartItemId: number) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },
  clearCart: async (userId: number) => {
    const response = await api.delete(`/cart/clear/${userId}`);
    return response.data;
  },
  getTotal: async (userId: number) => {
    const response = await api.get(`/cart/total/${userId}`);
    return response.data;
  },
};

/**
 * 订单相关API
 * 提供订单创建、查询、状态更新等功能
 */
export const orderApi = {
  create: async (userId: number, receiverName: string, receiverPhone: string, receiverAddress: string) => {
    const response = await api.post('/orders/create', { userId, receiverName, receiverPhone, receiverAddress });
    return response.data as Order;
  },
  getUserOrders: async (userId: number) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data as Order[];
  },
  getById: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data as Order;
  },
  updateStatus: async (orderId: number, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};
