# 🛒 DMart Product Management App

Full-stack web application built with React.js, Node.js, Express, and MongoDB.

## 📁 Project Structure
```
dmart-app/
├── frontend/          # React.js app
│   └── src/
│       ├── pages/     # Login, Register, OTP, Home, Products, Add/Edit
│       ├── components/ # Navbar
│       ├── services/  # Axios API calls
│       └── context/   # Auth context
└── backend/           # Node.js + Express
    ├── models/        # User, Product (Mongoose)
    ├── routes/        # /api/auth, /api/products
    └── middleware/    # JWT auth
```

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set your MONGO_URI
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Demo Credentials
- Email: `admin@dmart.com`
- Password: `admin123`

---

## 🌐 Deployment Guide

### Deploy Backend → Render.com (Free)

1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = any random string
   - `PORT` = 5000
6. Deploy → Copy the URL (e.g. `https://dmart-api.onrender.com`)

### Deploy Frontend → Vercel (Free)

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://dmart-api.onrender.com/api`
5. Deploy!

### MongoDB Atlas (Free)

1. https://cloud.mongodb.com → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow 0.0.0.0/0
4. Connect → Copy connection string
5. Use as MONGO_URI in Render

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/send-otp | Send OTP to email |
| POST | /api/auth/verify-otp | Verify OTP & login |

### Products (🔒 = requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST 🔒 | /api/products | Create product |
| PUT 🔒 | /api/products/:id | Update product |
| DELETE 🔒 | /api/products/:id | Delete product |

---

## ✅ Features
- 🔐 JWT Authentication (Login/Register/OTP)
- 📦 Full Product CRUD
- 🖼️ Image Upload (Multer)
- 🔍 Search & Category Filter
- 📊 Dashboard with stats
- ⚠️ Low stock alerts
- 📱 Responsive design
- ✅ Form validation + error handling
- 🌱 Auto-seeded sample data
