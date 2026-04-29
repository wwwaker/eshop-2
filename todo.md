# EShop-2 电子商城系统 — 修改与优化清单

> 基于项目全面审查，按优先级整理。标注 ⭐ 为课程作业加分项。

---

## 一、必须修复的 Bug

- [ ] **验证码功能无效**：`sendRegisterCode` 生成验证码但未存储，注册时也不校验，整个验证码机制是摆设
  - 位置：`UserServiceImpl.java:70-78`
  - 修复：将验证码存入 Session，注册时从 Session 取出校验

- [ ] **确认密码校验失效**：RegisterPage 未传 `confirmPassword` 给 Presenter，校验永远无法正确执行
  - 位置：`frontend/src/pages/RegisterPage.tsx:40`、`frontend/src/presenters/RegisterPresenter.ts:28`
  - 修复：在调用 `register()` 时传入 `confirmPassword` 字段

- [ ] **`shipOrder` 空指针异常**：`findById` 可能返回 null，直接调用 `getStatus()` 会 NPE
  - 位置：`OrderServiceImpl.java:164-170`
  - 修复：添加 null 检查，订单不存在时抛出业务异常

- [ ] **`updateQuantity` 数据丢失**：新建 CartItem 只设 id+quantity，update 可能将 userId/productId 置 null
  - 位置：`CartServiceImpl.java:66-72`
  - 修复：先从数据库查出完整 CartItem，再更新 quantity

- [ ] **图片上传竞态条件**：管理后台商品表单中图片上传和商品保存并行发起，保存时用的是旧数据
  - 位置：`admin-frontend/src/pages/ProductFormPage.tsx:82-92`
  - 修复：等待图片上传完成后再提交商品表单

- [ ] **ProfilePresenter.loadProfile 实现错误**：用 `updateProfile` 接口做查询，且 `as any` 绕过类型检查
  - 位置：`frontend/src/presenters/ProfilePresenter.ts:24`
  - 修复：调用正确的查询接口获取用户信息

- [ ] **管理后台 API 方法被覆盖**：`api.ts` 中 `Object.assign` 覆盖了 `productApi.create/update/getById`，类型变为 `any`
  - 位置：`admin-frontend/src/services/api.ts:387-418`
  - 修复：统一 API 方法定义，避免覆盖

- [ ] **AdminController 重复 import**：`java.util.Map` 被 import 了两次
  - 位置：`AdminController.java:4-5`

---

## 二、安全问题修复

- [ ] **管理接口无认证保护**：所有 `/api/admin/*` 的 CRUD 接口无需登录即可调用
  - 修复：在 AdminController 的管理接口方法中添加 Session 校验，未登录返回 401
  - 示例：抽取 `checkAdminAuth(HttpSession session)` 私有方法统一校验

- [ ] **用户登录无会话**：UserController 登录成功后不创建 Session，前端无法维持登录态
  - 位置：`UserController.java:150`
  - 修复：登录成功后将用户信息存入 HttpSession

- [ ] **水平越权**：购物车/订单接口通过 URL 的 `userId` 访问，任何用户可操作他人数据
  - 修复：从 Session 中获取当前用户 ID，与请求中的 userId 比对

- [ ] **订单状态可被任何人修改**：`PUT /api/orders/{id}/status` 无权限校验
  - 修复：校验当前用户是否为订单所有者或管理员

- [ ] **密码加密不安全**：使用无盐 SHA-256，易被彩虹表攻击
  - 位置：`PasswordUtil.java`
  - 修复：改用 BCrypt（Spring Boot 自带 `BCryptPasswordEncoder`，无需额外依赖）

- [ ] **前端密码存入 localStorage**：完整 User 对象含 password 字段存入 localStorage
  - 修复：存储前剔除 password 字段，后端登录响应也不应返回密码

- [ ] **SQL 注入风险**：4 个 Mapper XML 中 ORDER BY 使用 `${}` 拼接
  - 修复：在 Service 层对 sortField/sortOrder 做白名单校验
  ```java
  Set<String> allowedFields = Set.of("id", "created_at", "price", "stock", "total_amount");
  Set<String> allowedOrders = Set.of("ASC", "DESC");
  if (!allowedFields.contains(sortField) || !allowedOrders.contains(sortOrder.toUpperCase())) {
      throw new RuntimeException("非法排序参数");
  }
  ```

- [ ] **文件上传无类型限制**：可上传任意文件类型
  - 位置：`UploadController.java`
  - 修复：添加文件扩展名白名单（如 jpg/png/gif/webp）

- [ ] **邮箱验证码接口无频率限制**：可被用于邮件轰炸
  - 修复：在 Session 中记录上次发送时间，60 秒内不允许重复发送

- [ ] **硬编码假 Token**：管理员登录返回 `"dummy-token"`
  - 位置：`AdminController.java:212`
  - 修复：基于用户信息+时间戳生成简单 Token，或直接移除 Token 机制改用 Session

---

## 三、后端代码优化

- [ ] **添加全局异常处理器**：创建 `@RestControllerAdvice` 类，统一异常响应格式
  - 定义 `BusinessException` 自定义异常类
  - 统一返回 `{ "success": false, "error": "..." }` 格式

- [ ] **统一响应格式**：定义 `ApiResponse<T>` 封装类
  ```java
  public class ApiResponse<T> {
      private boolean success;
      private T data;
      private String error;
  }
  ```

- [ ] **使用 DTO 替代 Map 接收请求体**：CartController/OrderController/UserController 中用 `Map<String, Object>` 接收参数
  - 定义 `LoginRequest`、`CartAddRequest`、`OrderCreateRequest` 等 DTO 类
  - 配合 `@Valid` + `@NotBlank`/`@NotNull` 注解做参数校验

- [ ] **添加缺失的事务注解**：
  - `OrderServiceImpl.shipOrder()`
  - `CartServiceImpl.addToCart()`
  - `UserServiceImpl.register()`
  - `UserServiceImpl.save()`

- [ ] **解决 N+1 查询**：
  - `CartServiceImpl.findByUserId()`：对每个 CartItem 单独查 Product
  - `OrderServiceImpl.findById()`：对每个 OrderItem 单独查 Product
  - 修复：在 Mapper XML 中使用 JOIN 查询，或批量查询 Product

- [ ] **修复库存超卖**：将"先查后改"改为数据库原子操作
  - `ProductMapper.xml` 的 `updateStock` 改为：`UPDATE products SET stock = stock - #{quantity} WHERE id = #{id} AND stock >= #{quantity}`
  - Service 层判断返回值是否为 0（扣减失败则提示库存不足）

- [ ] **分页逻辑抽取公共方法**：5 个 Service 中 `findAllWithPagination` 逻辑几乎相同
  - 定义 `PageResult<T>` 泛型类和 `PageRequest` 封装类

- [ ] **状态字段改用枚举**：
  - `Order.status` → `OrderStatus` 枚举（PENDING/PAID/SHIPPED/COMPLETED/CANCELLED）
  - `Product.status` → `ProductStatus` 枚举（ON_SALE/OFF_SALE）
  - `User.role` → `UserRole` 枚举（USER/ADMIN）

- [ ] **删除操作添加关联数据处理**：
  - 删除分类时，先检查是否有商品，有则提示不可删除或自动迁移
  - 删除用户时，先清理其购物车数据

- [ ] **Service 层添加日志记录**：关键操作（下单、取消、发货、注册等）添加 `log.info` 输出

- [ ] **修复命名不一致**：
  - `SysLog.createTime` → `createdAt`，与其他实体统一
  - `Category` 添加 `updatedAt` 字段
  - `OrderItem` 添加 `createdAt` 字段

- [ ] **SysLogDao 添加 `@Mapper` 注解**

- [ ] **去除 JPA 依赖**：pom.xml 中同时引入了 JPA 和 MyBatis，只用 MyBatis 则移除 JPA

---

## 四、前端代码优化

- [ ] **统一 MVP 调用链路**：
  - `OrderListPage`/`OrderDetailPage` 中的 `handlePay/handleCancel/handleReceive` 直接调用 API，应通过 Presenter
  - `Navbar` 直接调用 `categoryApi.getAll()`，应通过 Presenter

- [ ] **添加路由守卫组件**：创建 `PrivateRoute` 组件，统一处理登录检查，避免每个页面重复编写

- [ ] **添加 401 响应拦截器**：在 axios 拦截器中处理 401 状态码，自动跳转登录页

- [ ] **添加 404 页面**：两个前端均未定义

- [ ] **添加 Error Boundary**：防止组件渲染异常导致整个应用崩溃

- [ ] **消除 `any` 类型**：Presenter 中大量 `any`，补充完整的 TypeScript 类型

- [ ] **修复内存泄漏**：
  - `CartPresenter.ts` 的 `setTimeout` 未在 `detachView` 时清理
  - `ProductDetailPage.tsx` 的 `setTimeout` 未在组件卸载时清理

- [ ] **抽取重复代码**：
  - `getStatusText`/`getStatusStyle` 在 OrderListPage 和 OrderDetailPage 中重复
  - `handleImageError` 逻辑在多个页面重复

- [ ] **API 基础 URL 使用环境变量**：
  - 创建 `.env` 文件：`REACT_APP_API_BASE_URL=http://localhost:8080/api`
  - 代码中改为 `process.env.REACT_APP_API_BASE_URL`

- [ ] **管理后台添加前端角色检查**：`ProtectedRoute` 不仅检查是否登录，还要检查用户角色是否为 ADMIN

- [ ] **编辑用户时密码非必填**：`UserFormPage.tsx` 编辑模式下密码字段应为可选

- [ ] **HomePresenter.loadCategories 的 catch 为空**：错误被静默吞掉，应显示错误提示

---

## 五、数据库优化

- [ ] **添加缺失索引**：
  ```sql
  CREATE INDEX idx_orders_user_id ON orders(user_id);
  CREATE INDEX idx_orders_created_at ON orders(created_at);
  CREATE INDEX idx_products_category_id ON products(category_id);
  CREATE INDEX idx_order_items_order_id ON order_items(order_id);
  CREATE INDEX idx_order_items_product_id ON order_items(product_id);
  CREATE INDEX idx_sys_logs_create_time ON sys_logs(create_time);
  CREATE INDEX idx_users_email ON users(email);
  ```

- [ ] **添加 CHECK 约束**：
  ```sql
  ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0);
  ALTER TABLE products ADD CONSTRAINT chk_stock CHECK (stock >= 0);
  ALTER TABLE cart_items ADD CONSTRAINT chk_quantity CHECK (quantity > 0);
  ALTER TABLE order_items ADD CONSTRAINT chk_item_quantity CHECK (quantity > 0);
  ALTER TABLE order_items ADD CONSTRAINT chk_product_price CHECK (product_price > 0);
  ```

- [ ] **添加邮箱唯一约束**：
  ```sql
  ALTER TABLE users ADD UNIQUE INDEX uk_email (email);
  ```

- [ ] **订单收货信息添加条件约束**：已付款/已发货订单的收货信息不应为空（可在 Service 层校验）

---

## 六、功能扩充方向 ⭐

### 基础功能补充

- [ ] **订单超时自动取消**：使用 `@Scheduled` 定时任务，每分钟检查超时未支付订单并自动取消
  - 订单表添加 `pay_deadline` 字段
  - 创建订单时设置 30 分钟支付截止时间

- [ ] ⭐ **商品评价系统**：
  - 新建 `reviews` 表（id, user_id, product_id, rating, content, created_at）
  - 用户可对已完成的订单商品评分+评论
  - 商品详情页展示评价列表和平均评分

- [ ] ⭐ **收货地址管理**：
  - 新建 `addresses` 表（id, user_id, receiver_name, phone, address, is_default）
  - 用户可管理多个收货地址，下单时选择

- [ ] **商品收藏功能**：
  - 新建 `favorites` 表（user_id, product_id, created_at）
  - 商品详情页添加收藏按钮
  - 个人中心展示收藏列表

- [ ] ⭐ **优惠券系统**：
  - 新建 `coupons` 表（id, code, discount, min_amount, start_time, end_time, stock）
  - 新建 `user_coupons` 表（user_id, coupon_id, used, order_id）
  - 下单时可选择使用优惠券

### 管理后台增强

- [ ] ⭐ **数据导出功能**：订单/用户/商品列表导出为 CSV
  - 后端使用 Apache Commons CSV 或 EasyExcel 生成文件
  - 前端通过文件下载获取

- [ ] **商品批量操作**：批量上架/下架/删除
  - 前端表格添加多选框
  - 后端添加批量操作接口

- [ ] ⭐ **数据统计图表**：集成 ECharts
  - 仪表盘销售趋势折线图
  - 品类销售占比饼图
  - 用户增长曲线

- [ ] **系统公告管理**：
  - 新建 `announcements` 表
  - 管理后台可发布/编辑公告
  - 用户端首页展示公告

### 用户体验提升

- [ ] ⭐ **响应式布局**：使用 CSS 媒体查询适配移动端
  - 商品网格在小屏幕改为单列
  - 导航栏在移动端改为汉堡菜单
  - 表格在移动端改为卡片列表

- [ ] **商品搜索增强**：添加搜索历史、热门搜索、搜索结果高亮

- [ ] **订单物流状态展示**：在订单详情中展示物流进度条（待付款→已付款→已发货→已送达）

- [ ] **消息通知**：订单状态变更时在页面顶部显示通知提示

---

## 七、代码规范与文档

- [ ] **添加 Swagger API 文档**：集成 SpringDoc，自动生成接口文档
  - 添加依赖：`springdoc-openapi-starter-webmvc-ui`
  - 在 Controller 方法上添加 `@Operation` 注解

- [ ] **添加单元测试**：至少覆盖 Service 层核心方法
  - 使用 `@SpringBootTest` + JUnit 5
  - 优先测试：`createOrder`、`addToCart`、`login`、`register`

- [ ] **完善 README**：添加项目介绍、技术栈、启动步骤、默认账号、功能截图

- [ ] **CORS 配置修正**：
  - `allowedHeaders` 不使用 `*`，改为显式列出
  - 添加 `maxAge(3600)` 减少预检请求

- [ ] **日志切面改为异步写入**：`LogAspect` 中 `sysLogService.save()` 改为 `@Async` 异步执行
