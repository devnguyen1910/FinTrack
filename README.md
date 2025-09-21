# 🏦 FinTrack - Comprehensive Financial Management System

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/devnguyen1910/FinTrack)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.0-blue.svg)](https://reactjs.org/)

**FinTrack** không chỉ là một ứng dụng quản lý tài chính cá nhân - đây là một hệ sinh thái tài chính toàn diện giúp bạn nắm vững mọi khía cạnh của đời sống tài chính, từ thu chi cá nhân đến phân tích thị trường và dự báo kinh tế.

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Giới thiệu

FinTrack được thiết kế để trở thành trợ lý tài chính thông minh của bạn, kết hợp công nghệ AI hiện đại với giao diện người dùng trực quan. Hệ thống không chỉ giúp bạn theo dõi thu chi mà còn cung cấp những insight sâu sắc về thị trường tài chính và xu hướng kinh tế.

### 🎯 Tầm nhìn
Tạo ra một nền tảng tài chính toàn diện giúp người dùng:
- Quản lý tài chính cá nhân hiệu quả
- Hiểu rõ bối cảnh kinh tế vĩ mô
- Đưa ra quyết định đầu tư thông minh
- Xây dựng kế hoạch tài chính bền vững

## 🚀 Tính năng chính

### 💰 Quản lý tài chính cá nhân
- **Thu chi thông minh**: Theo dõi giao dịch với AI bill scanning
- **Ngân sách động**: Hệ thống ngân sách thích ứng với xu hướng chi tiêu
- **Mục tiêu tài chính**: Đặt và theo dõi mục tiêu tiết kiệm/đầu tư
- **Báo cáo chi tiết**: Phân tích sâu về tình hình tài chính
- **Lịch tài chính**: Quản lý các sự kiện tài chính quan trọng

### 📊 Phân tích thị trường & Kinh tế
- **Dashboard thị trường**: Theo dõi chỉ số chứng khoán, tỷ giá, vàng
- **Phân tích kỹ thuật**: Biểu đồ candlestick, indicators, signals
- **Tin tức tài chính**: Tích hợp tin tức từ các nguồn uy tín
- **Chỉ số kinh tế**: GDP, CPI, lãi suất, tỷ lệ thất nghiệp
- **Heat map thị trường**: Visualize hiệu suất các ngành, cổ phiếu

### 🤖 Trí tuệ nhân tạo
- **Cố vấn AI**: Tư vấn tài chính cá nhân hóa
- **Dự báo xu hướng**: ML prediction cho thu chi và thị trường
- **Risk assessment**: Đánh giá rủi ro danh mục đầu tư  
- **Smart alerts**: Thông báo thông minh về cơ hội/rủi ro
- **Pattern recognition**: Nhận diện pattern trong behavior tài chính

### 🏦 Quản lý đầu tư nâng cao
- **Portfolio tracking**: Theo dõi danh mục đầu tư real-time
- **Asset allocation**: Phân bổ tài sản tối ưu
- **Performance analytics**: Phân tích hiệu suất chi tiết
- **Backtesting**: Test chiến lược đầu tư với dữ liệu lịch sử
- **Rebalancing alerts**: Cảnh báo tái cân bằng danh mục

### 💱 Tiền tệ & Forex
- **Multi-currency support**: Hỗ trợ 150+ loại tiền tệ
- **Real-time exchange rates**: Tỷ giá real-time từ 10+ exchanges
- **Currency strength meter**: Đo sức mạnh tiền tệ
- **Forex signals**: Tín hiệu trading forex từ AI
- **Central bank tracker**: Theo dõi chính sách ngân hàng TW

### 📈 Phân tích dòng tiền
- **Cash flow forecasting**: Dự báo dòng tiền cá nhân/doanh nghiệp
- **Liquidity analysis**: Phân tích tính thanh khoản
- **Working capital optimization**: Tối ưu vốn lưu động
- **Scenario planning**: Lập kế hoạch đa kịch bản
- **Stress testing**: Test khả năng chịu đựng tài chính

### 📱 Tính năng tiện ích
- **Multi-platform sync**: Đồng bộ across devices
- **Offline mode**: Làm việc offline, sync khi online
- **Data export**: Export PDF, Excel, CSV reports
- **Bank integration**: Kết nối với 50+ ngân hàng (API)
- **Tax calculator**: Tính thuế thu nhập cá nhân

## 🛠 Cài đặt

### Yêu cầu hệ thống
- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 9.0.0  
- **MongoDB**: ≥ 6.0 (local hoặc Atlas)
- **Redis**: ≥ 7.0 (cho caching)
- **Python**: ≥ 3.9 (cho ML models)

### 1. Clone repository
```bash
git clone https://github.com/devnguyen1910/FinTrack.git
cd FinTrack
```

### 2. Cài đặt Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Cài đặt Backend
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env với các config của bạn

# Build và start server
npm run build
npm start
```

## 🎮 Sử dụng

### 1. Đăng ký tài khoản
- Truy cập `http://localhost:3000`
- Tạo tài khoản mới hoặc đăng nhập
- Thiết lập profile và preferences

### 2. Dashboard tổng quan
- Xem tổng quan tình hình tài chính
- Theo dõi chỉ số thị trường quan trọng
- Nhận alerts và recommendations từ AI

### 3. Quản lý giao dịch
- Thêm giao dịch manual hoặc scan bill
- Phân loại tự động bằng AI
- Set up recurring transactions

## 🏗 Kiến trúc hệ thống

### Frontend Architecture
```
├── src/
│   ├── components/          # UI Components
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components  
│   │   ├── ui/             # Reusable UI components
│   │   └── widgets/        # Specialized widgets
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
```

### Backend Architecture
```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
```

### Technology Stack

**Frontend**
- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization

**Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **JWT** - Authentication

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Refresh token
POST /api/auth/logout       # Logout
```

### Financial Data Endpoints
```
GET    /api/transactions    # Get transactions
POST   /api/transactions    # Create transaction
PUT    /api/transactions/:id # Update transaction
DELETE /api/transactions/:id # Delete transaction

GET    /api/budgets         # Get budgets
POST   /api/budgets         # Create budget
PUT    /api/budgets/:id     # Update budget
DELETE /api/budgets/:id     # Delete budget
```

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! 

### Development Setup
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT.

## 👥 Team

- **Dev Nguyen** - Lead Developer & Product Owner
- **FinTrack AI Team** - ML/AI Development
- **Community Contributors** - Feature enhancements

---

<div align="center">
  <strong>🚀 Powered by AI • Built with ❤️ in Vietnam</strong>
</div>
