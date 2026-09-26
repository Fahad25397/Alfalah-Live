# AL FALAH HONEY
## Website Documentation & User Manual

**Website Name:** Alfalah Honey
**Version:** 1.0.0
**Date:** September 2026
**Organization:** Alfalah Honey (Established 1990 in Peshawar)
**Website URL:** https://alfalahhoney.com

---

## 4. Table of Contents
1. Documentation Objective
2. Introduction
3. Website Overview
4. Technology Stack
5. Website Architecture
6. Website Navigation
7. Homepage Documentation
8. Product Documentation
9. User Manual
10. Administrator Manual
11. Forms and Input Validation
12. Shopping/Ordering System
13. Responsive Design
14. UI/UX Design
15. Images and Media Assets
16. Database Documentation
17. API Documentation
18. Security
19. Error Handling and Troubleshooting
20. Installation and Setup Guide
21. Environment Variables
22. Deployment Guide
23. Maintenance Guide
24. Backup and Recovery
25. Performance
26. Accessibility
27. SEO
28. Testing
29. Browser and Device Compatibility
30. Frequently Asked Questions
31. Glossary
32. Future Maintenance Recommendations
33. Conclusion

---

## 5. Introduction

**Purpose of the Alfalah Honey website:**
The Alfalah Honey website serves as an online storefront and e-commerce platform for Pakistan's trusted supplier of pure, organic, and traditional wellness products.

**Main objectives:**
- Provide a seamless online shopping experience for customers across Pakistan.
- Showcase premium products including Sidr Honey, Ajwa & Medjool dates, Zamzam water, cold-pressed olive oil, and desi ghee.
- Allow administrators to easily manage inventory, orders, and delivery settings.

**Target audience:**
Health-conscious individuals, regular consumers of organic and traditional dietary products in Pakistan, and returning customers of Alfalah Honey.

**Business purpose:**
To digitize the sales process of a physical store established in 1990, enabling nationwide reach through Cash on Delivery (COD) services.

**Problems the website addresses:**
- Overcomes geographical limitations of a physical store.
- Automates order collection and inventory display.
- Establishes a professional digital brand presence.

**Scope of the website:**
The system is a fully functional bespoke e-commerce platform featuring a custom storefront, shopping cart, checkout system, and a secured administrative dashboard for backend management.

---

## 6. Website Overview

Alfalah Honey offers a premium selection of organic and wellness products. Visitors can browse categories, view detailed product information, add items to a shopping cart, and place orders via Cash on Delivery. 

The website is structured around a single-page scrolling experience for the main content, complemented by interactive modal components for the cart, product details, and checkout. It features a responsive design that adapts fluidly across mobile and desktop devices. The visual concept is rooted in earthy tones (amber, brown, cream) reflecting the organic nature of honey and natural products.

---

## 7. Technology Stack

**Frontend:**
- **Framework:** Next.js (App Router, version 16.3.4)
- **Library:** React (version 19.2.8)
- **Styling:** Tailwind CSS (version 4)
- **Icons:** Lucide React
- **Charts:** Recharts (used in Admin Dashboard)

**Backend:**
- **Framework:** Node.js (via Next.js API Routes)
- **File Handling:** streamifier, browser-image-compression (client-side)

**Database:**
- **Technology:** MongoDB
- **ODM:** Mongoose (version 9.9.4)

**Third-Party Services:**
- **Image Hosting:** Cloudinary
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcryptjs (for password hashing)

---

## 8. Website Architecture

The system utilizes a modern Serverless architecture provided by Next.js.

- **Frontend Architecture:** React components render the UI. State management is handled via React Context API (`CartContext.jsx`) for global cart state, and local React hooks for component-level state.
- **Backend Architecture:** Next.js API routes (`src/app/api/*`) handle server-side logic, interacting directly with the MongoDB database using Mongoose models.
- **Database Architecture:** A NoSQL structure containing collections for `Products` and `Orders`.
- **External Services:** Images uploaded in the admin panel are sent to Cloudinary via the backend API. The resulting image URLs are stored in MongoDB.

**Data Flow:**
User Interface (Browser) → Next.js API Route → MongoDB Database → Response → User Interface

---

## 9. Website Navigation

The website features a fixed, backdrop-blurred navigation bar that adapts to screen sizes.

| Navigation Item | Purpose | Available Actions |
| :--- | :--- | :--- |
| **Home** | Main landing area | Scrolls to the Hero section |
| **Shop** | Product catalog | Scrolls to the Product Grid |
| **About** | Company information | Scrolls to the About section |
| **Contact** | Contact information | Scrolls to the Contact Us section |
| **Return Policy**| Return policy details | Scrolls to the Return Policy in the footer |

*Note: The website primarily operates as a single-page application (SPA) layout on the main storefront, with smooth scrolling to sections.*

---

## 10. Homepage Documentation

The homepage is composed of the following sequential sections:

1. **Navigation/Header (`Navbar.jsx`)**: Sticky header containing the logo, navigation links, mobile menu toggle, and a dynamic Cart button that displays total item count.
2. **Hero Section (`Hero.jsx`)**: The main introduction area featuring a prominent call-to-action to shop, along with high-quality visual elements introducing the brand.
3. **Product Grid (`ProductGrid.jsx`)**: Dynamically loads and displays the product catalog from the database. Users can filter by categories, view product cards, open product details, and add items to the cart.
4. **Satisfied Clients Section (`SatisfiedClientsSection.jsx`)**: A social proof section displaying client satisfaction metrics or testimonials.
5. **About Book Section (`AboutBookSection.jsx`)**: A specialized section providing deep background information on the brand, its history since 1990, and its sourcing philosophy.
6. **Contact Us (`ContactUs.jsx`)**: A section providing a contact form and direct contact details.
7. **Footer (`Footer.jsx`)**: Contains quick links, full contact information (address, phone, email), developer credits, the Return Policy, and a "Back to top" button.
8. **Floating WhatsApp Icon (`WhatsAppIcon.jsx`)**: A sticky icon in the corner allowing users to initiate a direct WhatsApp conversation with the business.
9. **Cart Drawer (`CartDrawer.jsx`)**: An off-canvas sliding drawer appearing from the right side when the cart is opened, summarizing selected items and leading to checkout.

---

## 11. Product Documentation

Products are categorized and displayed dynamically.

**Available Categories (Admin Defined):**
Honey, For Men, Dry Fruits, Zamzam Water, Olives & Oils, Dates, Jam, Desi Ghee, Daily Wellness.

**Product Display Details:**
- **Product Name (English & Urdu)**
- **Image:** High-quality image hosted on Cloudinary.
- **Description:** Detailed text about the product.
- **Variants:** Products can have multiple weight/size options (e.g., 500g, 1000g). Each variant has its own specific price.
- **Badges:** Indicators for "Sale" (with old price comparison) and "Out of Stock".

Users can select a specific variant (weight) before adding it to their cart.

---

## 12. User Manual

**Browse the Website:**
1. Scroll down the homepage to view different sections.
2. Use the top navigation bar to quickly jump to 'Shop', 'About', or 'Contact'.

**View Products & Details:**
1. Navigate to the 'Shop' section.
2. Click on a product card to open the `ProductDetailModal`.
3. Read the description and view available weight options.

**Add Products to Cart:**
1. On a product card or within the product detail modal, select the desired weight variant.
2. Click the "Add to Cart" button.
3. The Cart button in the top right will update its item count.

**Checkout & Place an Order:**
1. Click the "Cart" button in the top navigation bar.
2. The Cart Drawer will open on the right side. Review your items and adjust quantities using the + / - buttons.
3. Click "Proceed to Checkout".
4. Fill in the required details (Full Name, Phone, Address, City).
5. Review the total amount and click "Place Order".
6. Wait for the success confirmation. Payment is collected via Cash on Delivery.

---

## 13. Administrator Manual

The administrative panel allows store owners to manage the entire e-commerce operation.

**Accessing the Admin Panel:**
- Navigate to `https://alfalahhoney.com/admin` OR press `Ctrl + Shift + A` on the homepage.
- Enter the admin Email and Password to log in.

**Dashboard Features:**
- **Orders Management (Default Tab):**
  - View a paginated list of all customer orders.
  - Search orders and filter by Status (Pending, Shipped, Delivered, Cancelled).
  - Update the status of an order.
- **Products Management:**
  - View all active products.
  - **Add Product:** Click "Add New Product". Enter details, select a category, upload an image, define variants (weights and prices), and set stock status.
  - **Edit/Delete:** Modify existing products or remove them from the catalog.
- **Revenue Analytics:**
  - View graphical charts (via Recharts) displaying monthly revenue trends based on completed orders.
- **Delivery Settings:**
  - Configure delivery charges based on categories and weights.
- **Settings:**
  - Change the administrator password securely.

---

## 14. Forms and Input Validation

| Form | Purpose | Required Fields | Error Handling/Validation |
| :--- | :--- | :--- | :--- |
| **Checkout Form** | Collect order details | Full Name, Phone, Address, City | HTML5 required validation. Cannot submit if empty. |
| **Admin Login** | Secure access | Email, Password | API returns error for invalid credentials; UI shows alert. |
| **Add/Edit Product** | Manage inventory | Name, Category, Image, Description, Variants (Weight, Price) | Validates image presence; converts data to FormData. |
| **Change Password** | Security update | Current Password, New Password | Backend verifies current password before updating. |

---

## 15. Shopping/Ordering System

The customer journey is completely digitized:

1. **Product Selection:** User selects a product and a specific variant (weight).
2. **Cart Context:** The item is added to the local React state (`CartContext.jsx`), calculating the running total.
3. **Cart Drawer:** User reviews items. They can increase/decrease quantity or remove items entirely.
4. **Checkout Modal:** User provides delivery information. The system calculates the final total (including delivery charges if applicable).
5. **Order Submission:** Data is sent via POST request to `/api/orders`.
6. **Order Processing:** The backend saves the order in MongoDB with a default status of "Pending".
7. **Order Fulfillment:** The Admin reviews the order in the Admin Dashboard, prepares the package, and updates the status to "Shipped" or "Delivered".

---

## 16. Responsive Design

The website employs Tailwind CSS utility classes to ensure a seamless experience across all devices.

- **Desktop/Laptop:** Features a horizontally spread navigation bar with hover effects, multi-column product grids, and a spacious layout.
- **Tablet:** Product grids scale down to 2-3 columns. Font sizes adjust fluidly.
- **Mobile:** 
  - The navigation bar collapses into a hamburger menu (`Menu` icon).
  - Tapping the hamburger icon reveals a full-width dropdown menu.
  - Product grids condense to a single or dual column layout.
  - The Cart Drawer takes up more relative screen width for usability.
  - Buttons and tap targets are sized appropriately for touch interactions.

---

## 17. UI/UX Design

The visual identity is meticulously crafted to reflect the brand:
- **Color Scheme:** Primary tones of rich brown (`#3c2415`), warm amber/gold (`#EDC001`, `#f7d648`), and soft cream/off-white (`#faf8f5`, `#f4ecd8`).
- **Typography:** Uses a sophisticated serif font for headings (conveying tradition and trust) and clean sans-serif fonts for body text.
- **Interactive Elements:** Buttons utilize micro-interactions (scaling down slightly on click/active states), hover transitions, and subtle drop shadows.
- **Feedback:** Toast notifications provide immediate, non-intrusive feedback during administrative actions (e.g., "Login successful", "Product updated").

---

## 18. Images and Media Assets

- **Image Optimization:** The frontend utilizes `browser-image-compression` to shrink image sizes before uploading them to the server, saving bandwidth and storage.
- **Hosting:** All dynamic product images are uploaded to and served from **Cloudinary**.
- **Static Assets:** The brand logo (`logo.png`) and favicon (`icon.png`) are served directly from the `public` directory.
- **Icons:** The UI heavily utilizes vector icons from the `lucide-react` library (e.g., ShoppingBag, MapPin, Phone) to ensure crisp rendering on all displays.

---

## 19. Database Documentation

Database Technology: **MongoDB** (via Mongoose).

**Collection: `products`**
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `name` | String | Product name (English) |
| `urduName` | String | Product name (Urdu) |
| `description` | String | Detailed product info |
| `category` | String | e.g., Honey, Zamzam Water |
| `image` | String | Cloudinary URL |
| `order` | Number | Custom sorting index |
| `variants` | Array[Object] | Contains specific options |
| `variants[].weight` | String | e.g., "500g", "1L" |
| `variants[].price` | Number | Price for the specific variant |
| `variants[].isSale` | Boolean | Flags if item is on sale |
| `variants[].oldPrice` | Number | Original price for comparison |
| `variants[].outOfStock` | Boolean | Flags if variant is unavailable |

**Collection: `orders`**
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `customer` | Object | Contains fullName, phone, address, city |
| `items` | Array[Object] | Contains productId, name, weight, quantity, price |
| `totalAmount`| Number | Final calculated total |
| `status` | String | "Pending", "Shipped", "Delivered", etc. |
| `createdAt` | Date | Timestamp of order creation |

---

## 20. API Documentation

Internal Next.js API Routes (`/api/*`):

| Endpoint | Method | Purpose | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/admin/login` | POST | Authenticate admin, returns JWT token | None |
| `/api/admin/me` | GET | Verify current token validity | JWT Required |
| `/api/admin/change-password` | POST | Update admin password | JWT Required |
| `/api/products` | GET | Fetch paginated product list | None |
| `/api/products` | POST | Create a new product (handles form-data image) | JWT Required |
| `/api/products/[id]` | PUT | Update existing product | JWT Required |
| `/api/products/[id]` | DELETE | Remove a product | JWT Required |
| `/api/orders` | GET | Fetch paginated orders | JWT Required |
| `/api/orders` | POST | Submit a new customer order | None |
| `/api/orders/[id]` | PUT | Update order status | JWT Required |

---

## 21. Security

Implemented Security Measures:
- **Authentication:** Admin panel is secured using JSON Web Tokens (JWT). The token is stored in the browser's `localStorage` and sent with subsequent sensitive requests.
- **Password Protection:** The administrator password is not stored in plain text. It is hashed using `bcryptjs` (salt rounds: 10) and verified securely.
- **API Security:** All POST/PUT/DELETE routes for products and GET/PUT routes for orders utilize a `verifyAuth()` middleware to ensure only the authenticated administrator can make changes.
- **Environment Variables:** Secrets (Database URI, JWT Secret, Admin Hash, Cloudinary Secret) are strictly kept in server-side environment variables and are never exposed to the client bundle.

---

## 22. Error Handling and Troubleshooting

| Problem | Possible Cause | Solution |
| :--- | :--- | :--- |
| **Admin login fails** | Incorrect email/password | Verify credentials. Ensure `ADMIN_PASSWORD_HASH` in `.env` is correct. |
| **Cannot add product** | Image too large or missing | Ensure an image is attached. Check Cloudinary API limits. |
| **Products not loading** | Database connection error | Verify `MONGO_URI` is correct and IP is whitelisted in MongoDB Atlas. |
| **Checkout fails** | API error / Network drop | Check server logs. Ensure the user filled all required fields. |

---

## 23. Installation and Setup Guide

To run the project locally for development:

**Requirements:**
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary Account

**Installation:**
1. Open the project directory: `cd alfalah-next`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables (Create a `.env.local` file based on section 21/24).
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the website at `http://localhost:3000`

---

## 24. Environment Variables

The application requires the following variables in a `.env.local` or `.env` file:

| Variable | Purpose | Required |
| :--- | :--- | :--- |
| `PORT` | Server port (e.g., 5000) | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for signing auth tokens | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of the admin password | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Exposed to client for image handling | Yes |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the application | Yes |

*Note: Never share actual secret keys in documentation or version control.*

---

## 25. Deployment Guide

As a Next.js application, the project is optimized for deployment on platforms like Vercel, Railway, or AWS Amplify.

**General Deployment Steps (e.g., Vercel):**
1. Connect the Git repository to Vercel.
2. Ensure the Framework Preset is set to "Next.js".
3. Add all the Environment Variables listed in Section 24 to the deployment platform's dashboard.
4. Click "Deploy". The platform will automatically run `npm run build` and `npm run start`.
5. Verify API functionality (specifically database connections and Cloudinary uploads) in the production environment.

---

## 26. Maintenance Guide

- **Updating Products:** Log into the Admin Dashboard (`/admin`). Navigate to the Products tab. Click the Edit (pencil) icon on any product to update prices, stock status, or descriptions.
- **Managing Orders:** Check the Admin Dashboard daily. Update order statuses from "Pending" to "Shipped" or "Delivered" as packages are processed to keep records accurate.
- **Updating Dependencies:** Periodically run `npm outdated` and `npm update` to ensure security patches for Next.js, React, and Mongoose are applied.

---

## 27. Backup and Recovery

*Identified Status: Not natively implemented in the codebase.*

**Recommended Future Practice:**
- **Database Backup:** Configure automated daily snapshots within the MongoDB Atlas dashboard.
- **Media Backup:** Cloudinary maintains its own redundancy, but periodic exports of the media library are recommended.

---

## 28. Performance

Implemented performance features:
- **Client-side Image Compression:** Utilizing `browser-image-compression` in the admin panel ensures administrators do not upload massive, unoptimized photos to the server.
- **Server-Side Rendering / Static Site Generation:** Next.js inherently optimizes page load times and code-splitting.
- **Suspense Boundaries:** Implemented around the `ProductGrid` (`<Suspense fallback={...}>`) in `page.jsx` to prevent the UI from blocking while database queries execute.

---

## 29. Accessibility

- **Semantic HTML:** Utilizes HTML5 tags (`<main>`, `<header>`, `<footer>`, `<nav>`).
- **ARIA Attributes:** Navigation buttons and modals include `aria-label` and `aria-current` attributes to assist screen readers (e.g., `aria-label="Toggle Navigation Menu"`).
- **Keyboard Navigation:** The application includes keyboard shortcuts (e.g., `Ctrl+Shift+A` for Admin access) and utilizes standard focusable elements for forms.

---

## 30. SEO

The application implements advanced Technical SEO via a custom `<SEO />` component leveraging `react-helmet-async`.

**Implemented Features:**
- Dynamic Title and Meta Descriptions.
- **JSON-LD Structured Data Schema:**
  - `LocalBusiness`: Defines address, geo-coordinates, opening hours, aggregate ratings, and contact info.
  - `Organization`: Links brand logos and social media profiles.
  - `WebSite`: Provides a search action template for search engines.
  - `BreadcrumbList`: Enhances site structure understanding for search engines.

---

## 31. Testing

*Identified Status: No automated test suites (e.g., Jest, Cypress) were identified in the project files.*

**Recommended Manual Test Cases:**
| Test ID | Feature | Test Case | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-01 | Cart | Add item to cart | Cart count increments, item appears in Drawer |
| TC-02 | Checkout | Submit empty form | HTML validation prevents submission |
| TC-03 | Admin Auth | Login with bad password | API returns 401 Unauthorized, UI alerts user |
| TC-04 | Admin Prod | Upload >5MB Image | Client compresses image before successful upload |

---

## 32. Browser and Device Compatibility

The Tailwind CSS styling ensures compatibility across modern browsers. The application is designed to function properly on:
- Google Chrome (Desktop & Mobile)
- Apple Safari (macOS & iOS)
- Microsoft Edge
- Mozilla Firefox

---

## 33. Frequently Asked Questions

*Based on website content and features.*

**Q: Do I need an account to place an order?**
A: No, checkout operates on a guest-checkout basis. You simply provide delivery details when placing an order.

**Q: What payment methods are accepted?**
A: Currently, Alfalah Honey operates exclusively on a Cash on Delivery (COD) model across Pakistan.

**Q: How do I know if a product is out of stock?**
A: Products marked out of stock by the administrator will display a clear "Out of Stock" badge on the storefront.

**Q: How does the Return Policy work?**
A: Alfalah Honey offers an "Open-Door" Verification Policy. You can inspect the product at the time of delivery while the rider takes a verification video. If unsatisfied, you can return it immediately.

---

## 34. Glossary

- **API (Application Programming Interface):** The set of rules allowing the frontend website to communicate with the backend server.
- **Cloudinary:** A third-party cloud service used to store and serve the product images.
- **JWT (JSON Web Token):** A secure string used to verify that the administrator is logged in.
- **MongoDB:** The database system used to store products and orders.
- **Variant:** A specific version of a product, usually differentiated by weight/size (e.g., a 500g jar vs a 1000g jar of Honey).

---

## 35. Recommended Future Improvements

*The following features are not currently implemented but are recommended for future growth:*

- **Automated Email Notifications:** Integrate a service like SendGrid to automatically email customers their order confirmation and shipping updates.
- **Payment Gateway Integration:** Add online payment options (e.g., Stripe, JazzCash, EasyPaisa) alongside COD.
- **Customer Accounts:** Allow users to create accounts to track their order history and save delivery addresses.
- **Automated Testing:** Implement Jest and Cypress test suites to ensure long-term stability during updates.

---

## 36. Conclusion

The Alfalah Honey e-commerce platform is a robust, modern web application built on the reliable Next.js and MongoDB stack. It successfully digitizes a traditional business, providing a highly aesthetic and user-friendly storefront for customers, paired with a secure, fully-featured administrative dashboard for the business owners. With its strong SEO foundation, optimized image handling, and responsive design, the platform is well-positioned to drive nationwide sales and scale efficiently in the future.
