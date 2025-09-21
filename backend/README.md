# FinTrack Backend API

Backend REST API cho ứng dụng quản lý tài chính cá nhân FinTrack được xây dựng với Node.js, Express, TypeScript và MongoDB.

## 🚀 Tính năng

- ✅ **Authentication & Authorization** - JWT-based với bcrypt password hashing
- ✅ **User Management** - Đăng ký, đăng nhập, quản lý profile
- ✅ **Transaction Management** - CRUD operations cho giao dịch thu chi
- ✅ **Budget Management** - Theo dõi ngân sách theo danh mục
- ✅ **Goal Management** - Quản lý mục tiêu tài chính
- ✅ **Recurring Transactions** - Giao dịch định kỳ tự động
- ✅ **Data Validation** - Express-validator cho tất cả endpoints
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Security** - Helmet, CORS, Rate limiting
- ✅ **Logging** - Morgan HTTP request logger
- ✅ **Database** - MongoDB với Mongoose ODM

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 5.x
- npm hoặc yarn

## ⚡ Cài đặt nhanh

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình environment

```bash
# Sao chép file environment mẫu
cp .env.example .env

# Chỉnh sửa file .env với thông tin của bạn
nano .env
```

**Cấu hình cần thiết trong `.env`:**

```env
# Environment
NODE_ENV=development
PORT=5000

# Database - Thay đổi URL MongoDB của bạn
MONGODB_URI=mongodb://localhost:27017/fintrack

# JWT - ⚠️ QUAN TRỌNG: Thay đổi secret key này
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS - URL của frontend
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Google Gemini AI (cho tính năng AI)
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Khởi động MongoDB

**Cách 1: MongoDB Community (Cài đặt local)**
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS với Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

**Cách 2: MongoDB Atlas (Cloud)**
- Tạo tài khoản tại [MongoDB Atlas](https://cloud.mongodb.com)
- Tạo cluster mới (free tier)
- Lấy connection string và cập nhật `MONGODB_URI` trong `.env`

**Cách 3: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Khởi động server

```bash
# Development mode với hot reload
npm run dev

# Build production
npm run build

# Start production
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### Xác thực token
```http
GET /api/auth/verify
Authorization: Bearer <your-jwt-token>
```

### Transaction Endpoints

#### Lấy danh sách giao dịch
```http
GET /api/transactions?page=1&limit=20&type=EXPENSE&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <your-jwt-token>
```

#### Tạo giao dịch mới
```http
POST /api/transactions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "type": "EXPENSE",
  "category": "Ăn uống",
  "amount": 150000,
  "description": "Ăn trưa tại nhà hàng",
  "date": "2024-01-15T12:00:00.000Z",
  "priority": "Medium"
}
```

#### Cập nhật giao dịch
```http
PUT /api/transactions/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "amount": 200000,
  "description": "Ăn trưa tại nhà hàng (cập nhật)"
}
```

#### Xóa giao dịch
```http
DELETE /api/transactions/:id
Authorization: Bearer <your-jwt-token>
```

### Health Check
```http
GET /health
```

## 🏗️ Cấu trúc dự án

```
backend/
├── src/
│   ├── controllers/         # Business logic
│   │   ├── authController.ts
│   │   └── transactionController.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Transaction.ts
│   │   ├── Budget.ts
│   │   ├── Goal.ts
│   │   └── RecurringTransaction.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── budgets.ts
│   │   ├── goals.ts
│   │   ├── recurring.ts
│   │   └── user.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   └── server.ts            # Main server file
├── dist/                    # Compiled JavaScript (auto-generated)
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Bảo mật

- **JWT Authentication** - Stateless authentication với access tokens
- **Password Hashing** - bcrypt với salt rounds = 12
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Chỉ cho phép origin được cấu hình
- **Helmet** - Security headers tự động
- **Input Validation** - express-validator cho tất cả endpoints
- **MongoDB Injection Protection** - Mongoose built-in protection

## 🚦 Error Handling

API trả về response theo format chuẩn:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

Bạn có thể test API endpoints bằng:

**Postman Collection**
1. Import file `FinTrack-API.postman_collection.json` (sẽ tạo sau)
2. Set environment variable `baseUrl` = `http://localhost:5000`
3. Set `token` variable sau khi login thành công

**cURL Examples**
```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"testuser","password":"password123"}'
```

## 🔧 Development

### Scripts có sẵn

```bash
# Development với hot reload
npm run dev

# Build TypeScript
npm run build

# Watch build (tự động build khi có thay đổi)
npm run build:watch

# Start production server
npm start

# Clean build directory
npm run clean
```

### Thêm endpoint mới

1. Tạo model trong `src/models/`
2. Tạo controller trong `src/controllers/`
3. Tạo routes trong `src/routes/`
4. Import route vào `src/server.ts`

## 🐛 Troubleshooting

### Lỗi thường gặp

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Kiểm tra MongoDB đã được khởi động chưa
- Xác nhận `MONGODB_URI` trong `.env` đúng

**2. JWT Error**
```
Error: JWT_SECRET is not configured
```
- Thêm `JWT_SECRET` vào file `.env`

**3. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
- Thay đổi `PORT` trong `.env` hoặc kill process đang dùng port 5000

**4. Validation Errors**
- Kiểm tra request body có đúng format không
- Xem chi tiết lỗi trong response message

### Debug Mode

Để bật debug logging:
```bash
NODE_ENV=development DEBUG=* npm run dev
```

## 📈 Monitoring & Logs

- **HTTP Requests** - Morgan logger
- **Error Tracking** - Console error logs
- **Performance** - Response time headers
- **Health Check** - `/health` endpoint

## 🚀 Deployment

### Production Checklist

- [ ] Thay đổi `JWT_SECRET` thành secret key mạnh
- [ ] Cập nhật `MONGODB_URI` với production database
- [ ] Set `NODE_ENV=production`
- [ ] Cấu hình `CORS_ORIGIN` với domain thực tế
- [ ] Setup process manager (PM2)
- [ ] Setup reverse proxy (Nginx)
- [ ] Enable HTTPS
- [ ] Setup monitoring (logs, performance)

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name fintrack-api

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🎯 Next Steps:**

1. **Cài đặt backend theo hướng dẫn trên**
2. **Test API endpoints với Postman hoặc cURL**
3. **Tích hợp frontend với backend APIs**
4. **Implement các controller còn lại (budgets, goals, etc.)**
5. **Thêm tính năng AI integration với Gemini API**