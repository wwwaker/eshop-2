/**
 * 类型定义模块
 * 定义前端应用中使用的所有数据结构类型
 */

/**
 * 用户类型
 * 包含用户的基本信息，如用户名、密码、邮箱、手机号、地址、角色等
 */
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 商品类型
 * 包含商品的完整信息，如名称、描述、价格、库存、分类、图片等
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 商品分类类型
 * 包含商品分类的基本信息，如名称、描述、排序等
 */
export interface Category {
  id: number;
  name: string;
  description: string;
  sortOrder: number;
  createdAt: string;
}

/**
 * 购物车项类型
 * 包含购物车中商品的信息，如数量、小计金额、关联的商品信息等
 */
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  subtotal: number;
}

/**
 * 订单项类型
 * 包含订单中商品的信息，如商品名称、价格、数量、小计金额等
 */
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

/**
 * 订单类型
 * 包含订单的完整信息，如订单号、总金额、状态、收货信息、订单项列表等
 */
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  totalAmount: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User;
}

/**
 * 分页响应类型
 * 用于处理后端返回的分页数据
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
