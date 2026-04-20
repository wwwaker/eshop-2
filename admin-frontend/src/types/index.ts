/**
 * 管理员系统类型定义模块
 * 定义前端应用中使用的所有数据结构类型
 */

/**
 * 用户接口
 * 描述系统用户信息，包括普通用户和管理员
 */
export interface User {
  id: number; // 用户ID
  username: string; // 用户名
  password?: string; // 密码（可选，仅在创建/更新时使用）
  email: string; // 邮箱
  phone?: string; // 手机号（可选）
  address?: string; // 收货地址（可选）
  role: string; // 角色（admin/user）
  createdAt?: string; // 创建时间（可选）
  updatedAt?: string; // 更新时间（可选）
}

/**
 * 商品分类接口
 * 描述商品分类信息
 */
export interface Category {
  id: number; // 分类ID
  name: string; // 分类名称
  description: string; // 分类描述
  sortOrder: number; // 排序顺序
  createdAt: string; // 创建时间
}

/**
 * 商品接口
 * 描述商品信息
 */
export interface Product {
  id: number; // 商品ID
  name: string; // 商品名称
  description: string; // 商品描述
  price: number; // 商品价格
  stock: number; // 商品库存
  categoryId: number; // 分类ID
  imageUrl: string; // 商品图片URL
  status: string; // 商品状态（active/inactive）
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  categoryName?: string; // 分类名称（可选，用于显示）
}

/**
 * 订单接口
 * 描述订单信息
 */
export interface Order {
  id: number; // 订单ID
  orderNo: string; // 订单编号
  userId: number; // 用户ID
  totalAmount: number; // 总金额
  status: string; // 订单状态（pending/paid/shipped/delivered/cancelled）
  receiverName: string; // 收货人姓名
  receiverPhone: string; // 收货人电话
  receiverAddress: string; // 收货人地址
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  user?: User; // 用户信息（可选，用于显示）
  items?: OrderItem[]; // 订单项（可选，用于显示）
}

/**
 * 订单项接口
 * 描述订单中的商品信息
 */
export interface OrderItem {
  id: number; // 订单项ID
  orderId: number; // 订单ID
  productId: number; // 商品ID
  productName: string; // 商品名称
  productPrice: number; // 商品价格
  quantity: number; // 商品数量
  subtotal: number; // 小计金额
  product?: Product; // 商品信息（可选，用于显示）
}

/**
 * 购物车项接口
 * 描述购物车中的商品信息
 */
export interface CartItem {
  id: number; // 购物车项ID
  userId: number; // 用户ID
  productId: number; // 商品ID
  quantity: number; // 商品数量
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  product: Product; // 商品信息
  subtotal: number; // 小计金额
}

/**
 * API响应接口
 * 描述后端API返回的统一响应格式
 */
export interface ApiResponse<T> {
  success: boolean; // 操作是否成功
  data?: T; // 响应数据（可选）
  error?: string; // 错误信息（可选）
  message?: string; // 提示信息（可选）
}

/**
 * 仪表盘数据接口
 * 描述系统统计数据
 */
export interface DashboardData {
  todayOrders: number; // 今日订单数
  todayNewUsers: number; // 今日新增用户数
  todaySales: number; // 今日销售额
  activeUsers: { // 活跃用户数据
    total: number; // 总用户数
    today: number; // 今日活跃用户数
    week: number; // 本周活跃用户数
    month: number; // 本月活跃用户数
  };
  hotProducts: { // 热门商品
    id: number; // 商品ID
    name: string; // 商品名称
    price: number; // 商品价格
    imageUrl: string; // 商品图片URL
    totalSold: number; // 总销量
  }[];
  salesTrend: { // 销售趋势
    date: string; // 日期
    orderCount: number; // 订单数
    totalAmount: number; // 总金额
  }[];
  newProducts: number; // 新增商品数
  totalProducts?: number; // 总商品数（可选）
  totalCategories?: number; // 总分类数（可选）
  totalOrders?: number; // 总订单数（可选）
  totalUsers?: number; // 总用户数（可选）
  // 后端可能返回的字段
  userActivity?: { // 用户活动数据（后端可能返回的格式）
    totalUsers: number; // 总用户数
    activeUsersToday: number; // 今日活跃用户数
    activeUsersWeek: number; // 本周活跃用户数
    activeUsersMonth: number; // 本月活跃用户数
  };
  todayNewProducts?: number; // 今日新增商品数（后端可能返回的字段）
  todaySalesObject?: { // 今日销售数据（后端可能返回的格式）
    todayTotalAmount: number; // 今日总金额
    todayOrderCount: number; // 今日订单数
  };
}

/**
 * 系统日志接口
 * 描述系统操作日志信息
 */
export interface SysLog {
  id: number; // 日志ID
  logLevel: string; // 日志级别（INFO/ERROR/WARN/DEBUG）
  logContent: string; // 日志内容
  createTime: string; // 创建时间
  className: string; // 类名
  methodName: string; // 方法名
  requestUrl: string; // 请求URL
  username: string; // 操作用户名
  ip: string; // IP地址
}
