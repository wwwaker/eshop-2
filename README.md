# EShop 电商系统

## 项目结构

```
eshop-2/
├── backend/         # Spring Boot 后端
├── frontend/        # React 前端（商城系统）
├── admin-frontend/  # React 前端（管理员系统）
└── .gitignore
```

## 技术栈

### 后端

- Spring Boot 3.2.0
- Java 21
- MyBatis
- MySQL 8.0+

### 前端

- React 18
- TypeScript
- React Router 6
- Axios

## 环境要求

### 后端环境

1. JDK 21
2. Maven 3.6+
3. MySQL 8.0+

### 前端环境

1. Node.js 18.0+
2. npm 9.0+

## 配置步骤

### 1. 数据库配置

1. 创建数据库 `eshop`
2. 执行数据库初始化脚本：
   - `backend/src/main/resources/db/schema.sql`（创建表结构）
   - `backend/src/main/resources/db/data.sql`（初始化数据）
3. 修改后端数据库配置：
   - 文件：`backend/src/main/resources/application.properties.example`
   - 修改 `spring.datasource.url`、`spring.datasource.username`、`spring.datasource.password` 为你的数据库配置

### 2. 后端部署

```bash
# 进入后端目录
cd backend
# 启动开发服务器
mvn spring-boot:run
```

后端服务默认运行在 `http://localhost:8080`

### 3. 前端部署

#### 商城前端

```bash
# 进入前端目录
cd frontend
# 安装依赖
npm install
# 构建项目
npm run build
# 启动开发服务器
npm start
```

商城前端默认运行在 `http://localhost:3000`

#### 管理员前端

```bash
# 进入管理员前端目录
cd admin-frontend
# 安装依赖
npm install
# 构建项目
npm run build
# 启动开发服务器
npm start
```

管理员前端默认运行在 `http://localhost:3001`

## 访问方式

- **商城系统**：`http://localhost:3000`
- **管理员系统**：`http://localhost:3001`
- **后端API**：`http://localhost:8080/api`

## 默认账号

### 管理员账号

- 用户名：admin
- 密码：admin123

### 测试用户账号

- 用户名：user
- 密码：user123

## 注意事项

1. 确保MySQL服务已启动
2. 确保后端服务先于前端服务启动
3. 前端API基础URL配置在 `src/services/api.ts` 文件中，可根据部署环境修改
4. 图片上传功能默认将图片存储在 `frontend/public/images` 目录

