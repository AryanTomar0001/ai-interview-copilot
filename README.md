# AI Interview Copilot - Production Ready System

A full-stack AI-powered interview preparation platform with authentication, usage limits, and analytics.

## 🏗️ System Architecture

```
Frontend (React + Vite + Tailwind)
        ↓
Node.js Backend (Auth + Limits + History)
        ↓
FastAPI Backend (AI Processing)
```

## 📦 Project Structure

```
ai-interview-copilot/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/        # Login, Signup, Upload, Questions, Interview, Result, Dashboard
│   │   ├── components/   # Reusable components
│   │   ├── context/      # AuthContext, AppContext
│   │   └── services/     # API integration
│   └── package.json
│
├── auth-server/          # Node.js authentication server
│   ├── src/
│   │   ├── controllers/  # Auth, User, Attempt, Limit controllers
│   │   ├── routes/       # API routes
│   │   ├── models/       # MongoDB models (User, Attempt)
│   │   ├── middleware/   # Auth & rate limiting
│   │   ├── config/       # Database & constants
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── backend/              # FastAPI AI backend (existing)
    └── app/
```

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Protected routes
- ✅ Token expiration handling
- ✅ Logout functionality

### Usage Limits
- ✅ Max 5 interview attempts per day
- ✅ Max 3 resume uploads per day
- ✅ Automatic daily reset at midnight
- ✅ Real-time limit checking

### User Dashboard
- ✅ Total attempts count
- ✅ Average score tracking
- ✅ Weak areas identification
- ✅ Attempt history with timestamps
- ✅ Score visualization

### Interview Features
- ✅ Resume upload with PDF validation
- ✅ AI-generated personalized questions
- ✅ Voice recording with timer
- ✅ Real-time transcription
- ✅ AI-powered evaluation
- ✅ Detailed feedback with improvements

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Python 3.8+
- FastAPI backend running

### 1. MongoDB Setup

Install MongoDB locally or use MongoDB Atlas:

```bash
# Local MongoDB
# Download from: https://www.mongodb.com/try/download/community

# Or use MongoDB Atlas (cloud):
# https://www.mongodb.com/cloud/atlas
```

### 2. Auth Server Setup

```bash
cd auth-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ai-interview-copilot
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# JWT_EXPIRE=7d
# NODE_ENV=development

# Start the server
npm run dev
```

The auth server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. FastAPI Backend

Ensure your FastAPI backend is running on `http://localhost:8000`

```bash
cd backend
# Follow existing setup instructions
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/user/me` - Get user profile
- `GET /api/user/history` - Get attempt history
- `GET /api/user/stats` - Get user statistics

### Attempts
- `POST /api/attempt/save` - Save interview attempt

### Limits
- `GET /api/limit/check-attempt` - Check attempt limit
- `GET /api/limit/check-resume` - Check resume upload limit
- `POST /api/limit/increment-resume` - Increment resume counter

## 🎨 Frontend Pages

1. **Login/Signup** - User authentication
2. **Upload** - Resume upload with drag & drop
3. **Questions** - AI-generated questions by category
4. **Interview** - Voice recording interface
5. **Result** - Detailed feedback and scoring
6. **Dashboard** - Analytics and history

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with expiration
- Protected API routes
- CORS configuration
- Input validation
- MongoDB injection prevention

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  dailyAttempts: Number,
  dailyResumeUploads: Number,
  lastResetDate: Date,
  createdAt: Date
}
```

### Attempt Model
```javascript
{
  userId: ObjectId,
  question: String,
  answer: String,
  score: Number (0-100),
  feedback: Object,
  createdAt: Date
}
```

## 🎯 Usage Limits

- **Daily Attempts**: 5 per day
- **Daily Resume Uploads**: 3 per day
- **Auto Reset**: Midnight (00:00) local time

## 🧪 Testing

### Test User Flow
1. Sign up with new account
2. Upload resume (check limit: 0/3)
3. Generate questions
4. Answer a question (check limit: 0/5)
5. View results
6. Check dashboard for stats
7. Try multiple attempts to test limits

### Test Limit System
1. Make 5 attempts in one day
2. Try 6th attempt - should be blocked
3. Upload 3 resumes
4. Try 4th upload - should be blocked
5. Wait until next day - limits reset

## 🚀 Production Deployment

### Environment Variables

**Auth Server (.env)**
```
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=strong_random_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

**Frontend**
```
VITE_API_URL=your_fastapi_backend_url
```

### Build Commands

```bash
# Frontend
cd frontend
npm run build

# Auth Server
cd auth-server
npm start
```

## 🎨 Design System

- **Colors**: Black primary, Gray backgrounds, Green/Yellow/Red for difficulty
- **Typography**: Clean, modern sans-serif
- **Components**: Rounded cards (rounded-xl), Shadows (shadow-md)
- **Layout**: Centered, responsive, mobile-friendly

## 📝 Notes

- Frontend uses Context API for state management (no Redux)
- All API calls include proper error handling
- Loading states and disabled buttons during API calls
- Clean separation between Node.js auth and FastAPI AI logic
- Production-ready code with proper structure

## 🤝 Contributing

This is a production-ready system. Follow the existing patterns when adding features.

## 📄 License

ISC
