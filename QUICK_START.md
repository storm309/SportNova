# 🚀 Quick Start Guide - Sports Platform

## ⚡ FASTEST WAY TO GET STARTED

### Step 1: Start Backend Server
```bash
cd backend
npm install  # Only needed first time
npm run dev
```
✅ Backend should start on http://localhost:5000

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm install  # Only needed first time
npm run dev
```
✅ Frontend should open on http://localhost:5173

## 🧪 TEST THE APPLICATION

### Create Your First Users:

#### 1. **Register as Player**
- Go to http://localhost:5173/register
- Name: John Athlete
- Email: player@test.com
- Password: test123
- Role: **Player**
- Click "Start Career"

#### 2. **Register as Coach**
- Name: Coach Mike
- Email: coach@test.com
- Password: test123
- Role: **Coach**

#### 3. **Register as Scout**
- Name: Scout Sarah
- Email: scout@test.com
- Password: test123
- Role: **Scout**

#### 4. **Register as Admin**
- Name: Admin Alex
- Email: admin@test.com
- Password: test123
- Role: **Admin**

## 🎮 TEST WORKFLOW

### As Player (player@test.com):
1. Login and go to Dashboard
2. Fill performance form:
   - Sport: Football
   - Speed: 85
   - Stamina: 90
   - Strength: 80
3. Click "Confirm Entry"
4. Your performance appears in the chart below

### As Coach (coach@test.com):
1. Login → Redirects to Coach Dashboard
2. See "John Athlete" in player list
3. Click on player to view performance
4. See the performance data you just added

### As Scout (scout@test.com):
1. Login → Redirects to Scout Dashboard
2. Browse all athletes
3. Filter by sport (Football)
4. Click athlete to view detailed performance

### As Admin (admin@test.com):
1. Login → Redirects to Admin Panel
2. See all registered users
3. Change roles (optional)
4. Delete test users (optional)

## ✅ VERIFICATION CHECKLIST

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected successfully
- [ ] Can register new users
- [ ] Can login with different roles
- [ ] Player can submit performance
- [ ] Coach can view players
- [ ] Scout can browse athletes
- [ ] Admin can manage users

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue: "Cannot find module..."
```bash
# Solution: Install dependencies
cd backend && npm install
cd frontend && npm install
```

### Issue: "MongoDB connection failed"
```bash
# The project uses MongoDB Atlas (cloud)
# Connection string is already in backend/.env
# No local MongoDB needed!
```

### Issue: "Port already in use"
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: "CORS error"
```bash
# Already fixed! CORS is properly configured
# Make sure backend is running first
```

## 📊 EXPECTED BEHAVIOR

### ✅ Role-Based Routing:
- Player → `/dashboard`
- Coach → `/coach`
- Scout → `/scout`
- Admin → `/admin`

### ✅ Protected Routes:
- Trying to access wrong role dashboard → "Access Denied"
- Not logged in → Redirects to `/login`

### ✅ Data Flow:
1. Player submits performance
2. Data saved to MongoDB
3. Coach sees it immediately
4. Scout can browse it
5. Admin can manage it

## 🎯 NEXT STEPS

Once everything works:
1. ✅ **Explore features** - Try all dashboards
2. ✅ **Test video upload** - Upload performance videos
3. ✅ **Test search** - Filter players by name/sport
4. ✅ **Test admin panel** - Change roles, delete users
5. ✅ **Check mobile view** - Responsive design works on mobile

## 🆘 STILL HAVING ISSUES?

Contact: shivamkumarp447@gmail.com

---

**Project Status**: ✅ All Fixed & Ready to Use!
**Last Updated**: December 2025
