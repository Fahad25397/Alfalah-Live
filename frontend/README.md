# Alfalah Honey - Frontend

A modern React + Vite e-commerce frontend for Alfalah Honey store.

## Tech Stack

- **React 19** - UI Library
- **Vite 8** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Swiper** - Carousel/slider

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── context/        # React Context providers (Cart, Currency)
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel deployment configuration
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

For production deployment on Vercel, set the `VITE_API_URL` environment variable in the Vercel dashboard to your backend API URL.

## Vercel Deployment

This project is configured for easy deployment on Vercel:

1. **Push to GitHub** - Push your code to a GitHub repository

2. **Import on Vercel** - Go to [Vercel](https://vercel.com) and import your repository

3. **Configure Environment Variables** - In Vercel dashboard, add:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app` or your deployed backend URL)

4. **Deploy** - Vercel will automatically detect the Vite configuration and deploy

### Vercel Configuration

The `vercel.json` file handles:
- Build command: `cd frontend && npm run build`
- Output directory: `frontend/dist`
- SPA routing rewrites (all routes redirect to index.html)
- Framework detection: Vite

## Backend API

This frontend expects a backend API with the following endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## Features

- **Product Catalog** - Browse products by category with search and sort
- **Shopping Cart** - Persistent cart with localStorage
- **Guest Checkout** - No account required for orders
- **Admin Dashboard** - Password-protected admin panel for managing products and orders
- **Multi-currency Support** - Manual currency rate configuration
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## Admin Access

Access the admin panel at `/admin` with the password: `00966552282515`

Or use the keyboard shortcut: `Ctrl + Shift + A`

## License

MIT