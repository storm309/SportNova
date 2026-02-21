# ⚽ SportNova

![SportNova Hero](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-ISC-blue) ![Version](https://img.shields.io/badge/Version-2.0.0-orange)

An AI-powered, full-stack sports performance management platform built with modern web technologies. SportNova connects players, coaches, scouts, and administrators in a single ecosystem to track, analyze, and improve athletic performance.

## ✨ Key Features

- **Multi-Role Access Control**: Dedicated dashboards for Players, Coaches, Scouts, and Admins.
- **AI-Powered Insights**: Integrated with Google Gemini 2.0 AI for personalized training recommendations and smart sports insights.
- **Performance Tracking**: Upload and analyze player statistics (speed, stamina, strength) alongside video evidence.
- **Player Scouting & Comparison**: Compare athlete metrics side-by-side to make data-driven decisions.
- **Secure Architecture**: JWT-based authentication, request rate-limiting, centralized error handling, and structured logging.

---

## 🚀 Tech Stack

### Frontend
- **React 19** + **Vite** — Fast, modern component rendering
- **Tailwind CSS** — Utility-first styling
- **React Router v7** — Dynamic client-side routing
- **Recharts** — Data visualization
- **Framer Motion** — Fluid UI animations
- **Axios** — API communication

### Backend
- **Node.js** + **Express.js** — Robust RESTful API
- **MongoDB** + **Mongoose** — Flexible NoSQL database schema
- **Google Generative AI** — Advanced AI features and conversational search
- **JWT & Bcrypt** — Secure authentication and password hashing
- **Multer** — Video and file upload handling

---

## 📂 Project Structure

```text
SportNova/
├── frontend/          # React + Vite Application
│   ├── src/
│   │   ├── api/       # Axios configuration and interceptors
│   │   ├── components/# Reusable UI components
│   │   ├── context/   # React Context (Auth)
│   │   └── pages/     # Route-level components
│   └── tailwind.config.js
│
└── backend/           # Node + Express API
    ├── config/        # Database connection
    ├── middleware/    # Auth, Role, and Rate-limiting middleware
    ├── models/        # Mongoose schemas (User, Performance)
    ├── routes/        # Express routers
    ├── utils/         # Error handling, validators, and loggers
    └── server.js      # Application entry point
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/storm309/SportNova.git
cd SportNova
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🌟 Future Improvements
- [ ] Migrate to TypeScript for improved type safety
- [ ] Implement Docker containerization for easier deployment
- [ ] Add comprehensive Unit and Integration Testing (Jest/Cypress)
- [ ] Implement WebSockets for real-time chat

---

## 👨‍💻 Author

**Shivam Kumar Pandey**  
*Full Stack Developer*
