# 🏆 SPORTS PLATFORM - BACKEND API DOCUMENTATION

## 📋 Table of Contents
- [Overview](#overview)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Security Features](#security-features)
- [Error Handling](#error-handling)

---

## 🎯 Overview

The Sports Platform Backend is a robust RESTful API built with Node.js, Express, and MongoDB. It manages user authentication, performance tracking, AI-powered recommendations, and role-based access control for players, coaches, scouts, and administrators.

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini 2.0 Flash
- **File Upload**: Multer
- **Security**: bcryptjs, Rate Limiting, Input Validation

---

## 🏗️ Backend Architecture

### Folder Structure
```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access control
│   └── rateLimiter.js        # Rate limiting protection
├── models/
│   ├── User.js               # User schema and model
│   └── Performance.js        # Performance data schema
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── performanceRoutes.js  # Performance management
│   ├── coachRoutes.js        # Coach-specific features
│   ├── adminRoutes.js        # Admin panel operations
│   └── recommendationsRoutes.js # AI recommendations
├── utils/
│   ├── validators.js         # Input validation utilities
│   ├── errorHandler.js       # Centralized error handling
│   └── logger.js             # Request and event logging
├── uploads/                  # Video file storage
├── logs/                     # Application logs
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── server.js                 # Main application entry point
```

### Request Flow
```
Client Request
    ↓
CORS & Body Parser
    ↓
Rate Limiter
    ↓
Request Logger
    ↓
Route Handler
    ↓
Authentication Middleware (if protected)
    ↓
Role Check (if required)
    ↓
Input Validation
    ↓
Controller Logic
    ↓
Database Operation
    ↓
Response / Error Handler
    ↓
Client Response
```

---

## 💾 Database Design

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  password: String (hashed, required),
  role: String (enum: player/coach/admin/scout),
  age: Number,
  gender: String,
  sport: String,
  height: Number,
  weight: Number,
  position: String,
  achievements: String,
  contactDetails: String,
  createdAt: Date
}
```

**Indexes**: 
- `email`: Unique index for fast lookups
- `role`: Index for role-based queries

### Performance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  sport: String (required, indexed),
  speed: Number (0-100),
  stamina: Number (0-100),
  strength: Number (0-100),
  videoUrl: String,
  videoFile: String,
  createdAt: Date (indexed)
}
```

**Indexes**: 
- `userId + createdAt`: Compound index for user performance history
- `sport`: Index for sport-based filtering

**Relationships**:
- One-to-Many: User → Performance (One user has many performance records)

---

## 🔌 API Endpoints

### Authentication Routes (`/auth`)

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "player"  // Optional: player, coach, admin, scout
}

Response (201):
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "player",
    "createdAt": "2025-12-13T..."
  }
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "player",
    ...
  }
}
```

---

### Performance Routes (`/performance`)

#### 1. Add Performance
```http
POST /performance/add
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- sport: "Basketball"
- speed: 85
- stamina: 78
- strength: 90
- videoUrl: "https://youtube.com/..." (optional)
- videoFile: <file> (optional, max 50MB)

Response (201):
{
  "message": "Performance saved",
  "performance": { ... }
}
```

#### 2. Get My Performance (Player)
```http
GET /performance/my?page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

#### 3. Get All Performance (Coach/Admin)
```http
GET /performance/all?page=1&limit=20&sport=Basketball
Authorization: Bearer <token>
Role: coach or admin

Response (200):
{
  "data": [
    {
      "_id": "...",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "sport": "Basketball"
      },
      "sport": "Basketball",
      "speed": 85,
      "stamina": 78,
      "strength": 90,
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

### Coach Routes (`/coach`)

#### 1. Get All Players
```http
GET /coach/players?page=1&limit=20&sport=Football
Authorization: Bearer <token>
Role: coach, admin, or scout

Response (200):
{
  "data": [ ... ],
  "pagination": { ... }
}
```

#### 2. Get Player Performance
```http
GET /coach/player/:id/performance
Authorization: Bearer <token>

Response (200):
[ ... performance records ... ]
```

#### 3. Compare Players
```http
GET /coach/compare?p1=<playerId1>&p2=<playerId2>
Authorization: Bearer <token>

Response (200):
{
  "p1": { "speed": 85, "stamina": 78, "strength": 90 },
  "p2": { "speed": 80, "stamina": 85, "strength": 88 }
}
```

---

### Admin Routes (`/admin`)

#### 1. Get All Users
```http
GET /admin/users?page=1&limit=20&role=player
Authorization: Bearer <token>
Role: admin

Response (200):
{
  "data": [ ... users ... ],
  "pagination": { ... }
}
```

#### 2. Change User Role
```http
PATCH /admin/users/:id/role
Authorization: Bearer <token>
Role: admin

{
  "role": "coach"
}

Response (200):
{ ...updated user... }
```

#### 3. Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <token>
Role: admin

Response (200):
{ "message": "User & performances deleted" }
```

#### 4. Delete Performance
```http
DELETE /admin/performance/:id
Authorization: Bearer <token>
Role: admin

Response (200):
{ "message": "Performance deleted" }
```

---

### Recommendations Routes (`/recommendations`)

#### Generate AI Recommendations
```http
POST /recommendations/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "sport": "Basketball",
  "count": 5
}

Response (200):
{
  "sport": "Basketball",
  "role": "player",
  "count": 5,
  "recommendations": [
    {
      "title": "Improve Ball Handling",
      "description": "Practice dribbling drills daily...",
      "category": "Technique"
    },
    ...
  ]
}
```

---

### Health Check Route

```http
GET /health

Response (200):
{
  "status": "OK",
  "timestamp": "2025-12-13T...",
  "uptime": 12345.67
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. **User Registration/Login** → Server validates credentials
2. **Token Generation** → JWT token created with user ID and role
3. **Token Storage** → Client stores token (localStorage/cookies)
4. **Protected Requests** → Client sends token in Authorization header
5. **Token Verification** → Server validates token using authMiddleware
6. **User Context** → Decoded user info available in `req.user`

### JWT Token Structure
```javascript
{
  id: "user_mongodb_id",
  role: "player|coach|admin|scout",
  iat: 1234567890,
  exp: 1234567890
}
```

### Role-Based Access Control
- **Player**: Can add/view own performance, get recommendations
- **Coach**: Can view all players, compare players, access performance data
- **Scout**: Can view players and their performance
- **Admin**: Full access - manage users, roles, delete data

---

## 🛡️ Security Features

### 1. Password Security
- Passwords hashed using bcryptjs (10 rounds)
- Passwords never returned in API responses
- Minimum password length: 6 characters

### 2. Input Validation
- Email format validation
- Performance metrics range validation (0-100)
- MongoDB ObjectId validation
- Request body sanitization

### 3. Rate Limiting
- **Auth endpoints**: 10 requests per 15 minutes per IP
- **API endpoints**: 100 requests per 15 minutes per IP
- Prevents brute force attacks and API abuse

### 4. Error Handling
- Sensitive error details hidden in production
- Consistent error response format
- MongoDB errors properly handled
- JWT errors caught and translated

### 5. File Upload Security
- File type validation (videos only)
- File size limit: 50MB
- Secure filename generation

### 6. CORS Protection
- Whitelisted origins only
- Credentials support enabled
- Configurable methods

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Resource created
- **400**: Bad request / Validation error
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **429**: Too many requests (rate limit)
- **500**: Internal server error

### Common Error Scenarios
1. **Invalid Token**: 401 - "Invalid or expired token"
2. **Access Denied**: 403 - "Access denied" or "Admin access only"
3. **Validation Failed**: 400 - "Validation failed" + error list
4. **Resource Not Found**: 404 - "User not found" / "Performance not found"
5. **Rate Limit**: 429 - "Too many requests. Please try again later."

---

## 📊 Logging & Monitoring

### Request Logging
- All requests logged with timestamp, method, URL, status, duration
- Logs stored in `logs/` directory
- Daily log files: `YYYY-MM-DD.log`
- Event logging in `events.log`

### Log Format
```json
{
  "timestamp": "2025-12-13T10:30:45.123Z",
  "method": "POST",
  "url": "/auth/login",
  "status": 200,
  "duration": "45ms",
  "ip": "::1",
  "userAgent": "..."
}
```

---

## 🚀 Performance Optimizations

1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Pagination**: All list endpoints support pagination
3. **Query Optimization**: Populate only required fields
4. **Connection Pooling**: Mongoose connection pooling enabled
5. **Rate Limiting**: Prevents server overload
6. **Async/Await**: Non-blocking I/O operations

---

## 🔧 Environment Variables

Required variables in `.env`:
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/sports-platform
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
```

---

## 📦 Dependencies

### Production
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment configuration
- **multer**: File upload handling
- **@google/generative-ai**: AI recommendations

### Development
- **nodemon**: Auto-restart during development

---

## 🎓 Best Practices Implemented

1. ✅ **Separation of Concerns**: Routes, models, middleware, utilities separated
2. ✅ **Error Handling**: Centralized error handler with async wrapper
3. ✅ **Input Validation**: All user inputs validated
4. ✅ **Security**: Password hashing, JWT, rate limiting, CORS
5. ✅ **Logging**: Comprehensive request and event logging
6. ✅ **Code Quality**: Consistent error responses, proper HTTP codes
7. ✅ **Scalability**: Pagination, indexing, optimized queries
8. ✅ **Documentation**: Clear code comments and API docs
9. ✅ **Configuration**: Environment-based configuration
10. ✅ **Graceful Shutdown**: Proper server cleanup on termination

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Verify MONGO_URI in .env
- Check network connectivity

### JWT Errors
- Verify JWT_SECRET is set
- Check token expiration (7 days)
- Ensure proper Authorization header format

### Rate Limit Issues
- Wait for reset time (15 minutes)
- Check IP whitelisting if needed
- Adjust limits in rateLimiter.js

---

**Last Updated**: December 13, 2025  
**Version**: 2.0.0
