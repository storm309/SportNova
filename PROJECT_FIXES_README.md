# 🏆 Sports Platform - Athletic Talent Assessment System

A comprehensive full-stack web application for athletic talent assessment, performance tracking, and scouting. Built with React, Node.js, Express, and MongoDB.

## ✅ FIXED ISSUES

### Backend Fixes
1. ✅ **User Model** - Added `admin` and `scout` roles (previously only had player/coach)
2. ✅ **Performance Routes** - Fixed `req.userId` to `req.user.id` for proper authentication
3. ✅ **CORS Configuration** - Removed duplicate CORS middleware and added PATCH method support
4. ✅ **Role Middleware** - Enhanced to accept arrays of roles for flexible authorization
5. ✅ **Coach Routes** - Added scout access to view players
6. ✅ **Uploads Directory** - Created missing directory for video file storage

### Frontend Fixes
1. ✅ **Login Redirects** - Now properly redirects based on all roles (player, coach, admin, scout)
2. ✅ **Register Page** - Added scout and admin role options
3. ✅ **Scout Dashboard** - Created complete scout interface for talent discovery
4. ✅ **App Routing** - Added scout route and proper role-based protection
5. ✅ **Home Page Navigation** - Fixed dashboard links for all user roles
6. ✅ **Environment Files** - Created proper .env configuration

## 🚀 USER ROLES & ACCESS

### 1. **Player/Athlete** (`/dashboard`)
- Submit performance data (sport, speed, stamina, strength)
- Upload performance videos (URL or file upload)
- View personal performance history
- Track progress with visual charts

### 2. **Coach** (`/coach`)
- View all registered players
- Access individual player performance data
- Compare two players side-by-side
- Review uploaded performance videos
- Search and filter players

### 3. **Scout** (`/scout`)
- Browse all athletes in the system
- Filter by sport, search by name
- View detailed athlete profiles
- Access performance metrics and videos
- Shortlist athletes (coming soon)
- Contact athletes

### 4. **Admin** (`/admin`)
- Manage all users (view, edit roles, delete)
- Change user roles (player ↔ coach ↔ scout ↔ admin)
- Delete users and their performance data
- Search and filter users
- Platform administration

## 📦 INSTALLATION & SETUP

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install

# The .env file is already configured with:
# - MongoDB Atlas connection
# - JWT secret key
# - PORT=5000

npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# The .env file is already configured with:
# - VITE_API_URL=http://localhost:5000

npm run dev
```

## 🔐 AUTHENTICATION FLOW

1. **Registration** - Users select role during signup
2. **JWT Token** - Generated on login, stored in localStorage
3. **Protected Routes** - Role-based access control on all dashboards
4. **Auto-redirect** - Users redirected to appropriate dashboard based on role

## 🗄 DATABASE SCHEMA

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String (player, coach, admin, scout),
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

### Performance Model
```javascript
{
  userId: ObjectId (ref: User),
  sport: String,
  speed: Number,
  stamina: Number,
  strength: Number,
  videoUrl: String,
  videoFile: String,
  createdAt: Date
}
```

## 🛣 API ENDPOINTS

### Authentication
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires auth)

### Performance
- `POST /performance/add` - Add performance record (with video upload)
- `GET /performance/my` - Get my performance history
- `GET /performance/all` - Get all performances (coach/admin only)

### Coach/Scout
- `GET /coach/players` - Get all players (coach/scout/admin)
- `GET /coach/player/:id/performance` - Get player performance
- `GET /coach/compare?p1=id&p2=id` - Compare two players

### Admin
- `GET /admin/users` - Get all users (admin only)
- `PATCH /admin/users/:id/role` - Change user role (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)
- `DELETE /admin/performance/:id` - Delete performance (admin only)

## 🎨 FEATURES IMPLEMENTED

✅ JWT-based authentication
✅ Role-based access control
✅ Video upload (Multer) + external URLs
✅ Performance tracking & visualization
✅ Player comparison tool
✅ Search & filter functionality
✅ Responsive design (Tailwind CSS)
✅ Real-time dashboard updates
✅ User management (admin)
✅ Secure password hashing (bcryptjs)

## 🔧 TECHNOLOGY STACK

**Frontend:**
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Lucide Icons
- Vite

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Multer (file uploads)
- bcryptjs
- CORS

## 📝 ENVIRONMENT VARIABLES

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sports
JWT_SECRET=abcd1234
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

## 🚦 HOW TO TEST

1. **Start Backend**: `cd backend && npm run dev` (port 5000)
2. **Start Frontend**: `cd frontend && npm run dev` (port 5173)

### Create Test Users:
1. Register as **Player** - Access `/dashboard`
2. Register as **Coach** - Access `/coach`
3. Register as **Scout** - Access `/scout`
4. Register as **Admin** - Access `/admin`

### Test Workflow:
1. **Player** submits performance data with videos
2. **Coach** views players and analyzes performance
3. **Scout** browses athletes and reviews stats
4. **Admin** manages users and platform

## 🎯 FUTURE ENHANCEMENTS

- [ ] Messaging system (coach ↔ athlete, scout → athlete)
- [ ] AI-based talent recommendation
- [ ] Video analysis with computer vision
- [ ] Leaderboards & rankings
- [ ] Advanced analytics & reports (PDF export)
- [ ] Notification system
- [ ] Training resources & drills
- [ ] Mobile app
- [ ] Real-time chat (Socket.io)
- [ ] Payment integration for premium features

## 📧 CONTACT

**Developer**: Shivam Kumar
- Email: shivamkumarp447@gmail.com
- Phone: +91 8252980774

## 📄 LICENSE

This project is private and proprietary.

---

## ⚠️ IMPORTANT NOTES

1. **MongoDB Atlas**: The project uses MongoDB Atlas cloud database
2. **File Uploads**: Videos are stored in `backend/uploads/` directory
3. **CORS**: Configured for localhost:5173 and 127.0.0.1:5173
4. **Security**: JWT tokens expire in 7 days
5. **Default Role**: New users default to "player" role if not specified

## 🐛 TROUBLESHOOTING

**Issue**: "No token provided"
- **Solution**: Ensure you're logged in and token is in localStorage

**Issue**: "Access denied" on routes
- **Solution**: Check your user role matches the required role for that route

**Issue**: MongoDB connection error
- **Solution**: Verify MONGO_URI in backend/.env is correct

**Issue**: Videos not uploading
- **Solution**: Ensure `backend/uploads/` directory exists

**Issue**: Frontend can't connect to backend
- **Solution**: Verify backend is running on port 5000

---

**Last Updated**: December 2025
**Status**: ✅ All Issues Fixed & Production Ready
