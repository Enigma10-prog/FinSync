# Financial Advisor Application

A comprehensive financial advisory platform built with React (Frontend) and Node.js/Express (Backend) with MongoDB database.

## 🚀 Features

- **Credit Card Recommendations**: AI-powered credit card suggestions based on user profile
- **Tax Calculator**: Advanced tax calculation for both old and new regimes
- **Financial Dashboard**: Comprehensive financial overview and tracking
- **User Management**: Secure authentication and profile management
- **Real-time Data**: Live credit card data and financial insights

## 🏗️ Architecture

```
financial-advisor/
├── project/                 # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── backend/                 # Backend (Node.js + Express + MongoDB)
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Authentication & validation
│   └── package.json
└── README.md
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### Option 1: Quick Start (Windows)

1. **Double-click** `start-all.bat` to start both servers automatically
2. Wait for both servers to start
3. Open your browser to `http://localhost:5173`

### Option 2: Manual Setup

#### 1. Start MongoDB
```bash
# Start MongoDB service
mongod
```

#### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example)
copy env.example .env

# Setup database with sample data
node setup.js

# Start backend server
npm run dev
```

#### 3. Setup Frontend
```bash
cd project

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Credit Cards
- `GET /api/credit-cards` - Get all credit cards
- `POST /api/credit-cards/recommend` - Get personalized recommendations
- `GET /api/credit-cards/:id` - Get specific card details
- `POST /api/credit-cards/compare` - Compare multiple cards

### Tax Calculation
- `POST /api/tax/calculate` - Calculate tax liability
- `GET /api/tax/history` - Get calculation history
- `POST /api/tax/suggestions` - Get tax saving suggestions

### Dashboard
- `GET /api/dashboard/overview` - Get financial overview
- `PUT /api/dashboard/overview` - Update dashboard
- `GET /api/dashboard/net-worth` - Get net worth analysis

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/financial-profile` - Get financial profile

## 🗄️ Database Schema

### User Model
- Personal information (name, email, phone, DOB)
- Employment details (type, income, employer)
- Financial profile (credit score, investments, expenses)
- Preferences (risk appetite, financial goals)

### Credit Card Model
- Basic info (name, issuer, category)
- Eligibility criteria (income, credit score)
- Features (rewards, benefits, insurance)
- Fees and charges

### Tax Calculation Model
- Income details (salary, other income)
- Deductions (80C, 80D, HRA, etc.)
- Results for both tax regimes
- Optimization suggestions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financial-advisor
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### MongoDB Connection

The application connects to MongoDB at `mongodb://localhost:27017/financial-advisor` by default.

## 🚀 Usage

### 1. Credit Card Recommendations

1. Fill out the recommendation form with your:
   - Monthly income
   - Credit score range
   - Employment type
   - Spending patterns
   - Preferences

2. Submit the form to get personalized credit card recommendations

3. Compare cards side-by-side

4. Apply directly through the provided links

### 2. Tax Calculator

1. Enter your income details
2. Add deductions and investments
3. Choose tax regime (old/new)
4. Get detailed tax calculation
5. View optimization suggestions

### 3. Financial Dashboard

1. Update your financial profile
2. Track assets and liabilities
3. Monitor cash flow
4. Set and track financial goals

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd project
npm test
```

## 📁 Project Structure

```
project/src/
├── components/
│   ├── creditcards/
│   │   └── CardRecommender.tsx    # Main credit card component
│   ├── tax/
│   ├── dashboard/
│   └── auth/
├── services/
│   └── api.ts                     # API service layer
├── types/                         # TypeScript interfaces
└── utils/                         # Utility functions

backend/
├── controllers/                   # Request handlers
├── models/                       # Database schemas
├── routes/                       # API route definitions
├── services/                     # Business logic
├── middleware/                   # Auth & validation
└── config/                       # Database & app config
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd project
npm run build
# Deploy dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set
4. Check that both servers are running on correct ports

## 🔄 Updates

- **v1.0.0**: Initial release with core features
- Credit card recommendations
- Tax calculation engine
- Financial dashboard
- User authentication system
- Easy finance management

---

**Happy Financial Planning! 💰📊** 
