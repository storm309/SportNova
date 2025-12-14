# 🚀 QUICK START GUIDE - BACKEND

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your values:
# - MONGO_URI (your MongoDB connection string)
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - GEMINI_API_KEY (your Google Gemini API key)
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running on your system
# Windows: mongod
# Mac/Linux: sudo systemctl start mongodb
```

### 4. Run Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Verify Server
```bash
# Check health endpoint
curl http://localhost:5000/health

# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── middleware/
│   ├── authMiddleware.js        # JWT authentication
│   ├── roleMiddleware.js        # Role checking
│   └── rateLimiter.js           # Rate limiting
├── models/
│   ├── User.js                  # User schema
│   └── Performance.js           # Performance schema
├── routes/
│   ├── authRoutes.js            # /auth endpoints
│   ├── performanceRoutes.js     # /performance endpoints
│   ├── coachRoutes.js           # /coach endpoints
│   ├── adminRoutes.js           # /admin endpoints
│   └── recommendationsRoutes.js # /recommendations endpoints
├── utils/
│   ├── validators.js            # Input validation
│   ├── errorHandler.js          # Error handling
│   └── logger.js                # Request logging
├── uploads/                     # Video uploads folder
├── logs/                        # Log files
└── server.js                    # Main application
```

---

## 🔌 API Endpoints Quick Reference

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (requires auth)

### Performance (`/performance`)
- `POST /performance/add` - Add performance (requires auth)
- `GET /performance/my` - Get my performances (requires auth)
- `GET /performance/all` - Get all performances (coach/admin only)

### Coach (`/coach`)
- `GET /coach/players` - List all players (coach/admin/scout)
- `GET /coach/player/:id/performance` - Player stats (requires auth)
- `GET /coach/compare?p1=id1&p2=id2` - Compare players (requires auth)

### Admin (`/admin`)
- `GET /admin/users` - List all users (admin only)
- `PATCH /admin/users/:id/role` - Change role (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)
- `DELETE /admin/performance/:id` - Delete performance (admin only)

### Recommendations (`/recommendations`)
- `POST /recommendations/generate` - Get AI recommendations (requires auth)

### System
- `GET /health` - Health check

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "player"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Performance (replace TOKEN)
```bash
curl -X POST http://localhost:5000/performance/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sport": "Basketball",
    "speed": 85,
    "stamina": 78,
    "strength": 90
  }'
```

### Get My Performance
```bash
curl -X GET http://localhost:5000/performance/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 User Roles

- **player**: Add/view own performance, get recommendations
- **coach**: View all players, compare players, access all performance data
- **scout**: View players and their performance
- **admin**: Full access - manage users, roles, delete data

---

## 📝 Environment Variables

```bash
# Required
MONGO_URI=mongodb://localhost:27017/sports-platform
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=5000
NODE_ENV=development
```

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3000
```

### JWT Token Errors
```bash
# Make sure JWT_SECRET is set in .env
# Regenerate token by logging in again
```

### Rate Limit Errors
```bash
# Wait 15 minutes or adjust limits in:
# backend/middleware/rateLimiter.js
```

---

## 📚 Documentation Files

- **BACKEND_DOCUMENTATION.md** - Complete API documentation
- **PRESENTATION_GUIDE.md** - Presentation explanation
- **REVIEW_SUMMARY.md** - Changes and improvements
- **README.md** - This file

---

## 🚀 Production Deployment

### Before Deploying:
1. Set `NODE_ENV=production` in environment
2. Use strong JWT_SECRET (32+ characters)
3. Use MongoDB Atlas (cloud) instead of local
4. Enable HTTPS
5. Set proper CORS origins
6. Review rate limits
7. Set up monitoring
8. Configure backups

### Deployment Platforms:
- **Heroku**: Easy deployment, free tier
- **Railway**: Modern, simple
- **AWS**: Scalable, professional
- **DigitalOcean**: Affordable VPS
- **Render**: Free backend hosting

---

## 🎓 Learning Resources

### Node.js & Express
- [Express Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### MongoDB
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://jwt.io/introduction)

---

## 💡 Tips

1. **Use .env**: Never commit secrets to Git
2. **Test Endpoints**: Use Postman or Thunder Client
3. **Check Logs**: Review logs/ folder for debugging
4. **Monitor Performance**: Watch response times in logs
5. **Backup Database**: Regular MongoDB backups
6. **Update Dependencies**: Check for security updates

---

## 🆘 Need Help?

1. Check logs in `logs/` folder
2. Review error messages carefully
3. Verify environment variables
4. Check MongoDB connection
5. Ensure all dependencies installed
6. Review documentation files

---

**Happy Coding! 🎉**
