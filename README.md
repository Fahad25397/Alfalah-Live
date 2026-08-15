# Alfalah Honey - Full Stack E-Commerce Application

A complete e-commerce solution for Alfalah Honey store with React frontend and Node.js/Express backend.

## Project Structure

```
Alfalah/
├── frontend/           # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── vercel.json     # Vercel deployment config
│   └── package.json
├── backend/            # Node.js + Express + MongoDB backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── vercel.json         # Root Vercel config (for frontend)
└── package.json        # Root package.json
```

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Environment Setup

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import repository on Vercel
3. Set `VITE_API_URL` environment variable to your backend URL
4. Deploy

### Backend (Vercel / Railway / Render / Heroku)

The backend can be deployed to any Node.js hosting platform. For Vercel, you'll need to:
1. Create a `vercel.json` in the backend directory
2. Configure the serverless function entry point
3. Set environment variables

## Features

- **Product Management** - Full CRUD for products with variants
- **Order Management** - Guest checkout and admin order tracking
- **Shopping Cart** - Persistent cart with localStorage
- **Admin Dashboard** - Password-protected management panel
- **Multi-currency** - Configurable exchange rates
- **Responsive Design** - Works on all devices

## Tech Stack

### Frontend
- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Lucide React

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

## License

MIT