# Food Delivery App

A full-stack food delivery application built with React Native (Expo) and Node.js.

## Features

- **Authentication**: Secure Login and Signup flow with JWT.
- **Restaurant Listing**: Browse restaurants with ratings and descriptions.
- **Menu Browsing**: View menu items with images and prices.
- **Cart Management**: Add items to cart, view total, and place orders.
- **Order Tracking**: View order status and history.
- **User Dashboard**: Personalized home with stats (orders, total spent, member since), quick actions, and recent orders.
- **Admin Dashboard**: Role-gated panel to view stats, manage orders (status updates), CRUD restaurants & menu items, and promote/demote users.
- **Role-Based Navigation**: Admins and users see entirely different tab layouts after login.
- **Dark Theme**: Sleek, consistent dark mode UI.
- **Protected Routes**: Secure navigation based on authentication state.

## Tech Stack

- **Frontend**: React Native, Expo, React Navigation, Axios, AsyncStorage
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (Supabase)
- **Assets**: Lucide React Native Icons

## Prerequisites

- Node.js (v14 or later)
- A PostgreSQL database — a free [Supabase](https://supabase.com) project, or local Postgres
- Expo Go app (for testing on device) or Android/iOS Simulator

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd food-delivery-app/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    - Create a `.env` file in the `backend` directory.
    - Prisma reads the database connection from `DATABASE_URL`. For Supabase, copy the **Session pooler** connection string (URI, port `5432`) from your project's *Connect* dialog.
    ```env
    PORT=4000
    DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
    JWT_SECRET=your_jwt_secret
    ```
    - For local Postgres instead, use a local URL, e.g. `DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres`.
4.  Create the database tables and generate the Prisma client:
    ```bash
    npx prisma db push
    ```
5.  Seed the database (sample restaurants/menu + a seeded admin and demo user):
    ```bash
    npm run seed
    ```
    The seed script prints the admin and demo-user login credentials in the console.
6.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd food-delivery-app/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npm start
    ```
4.  Scan the QR code with Expo Go or press `a` for Android Emulator / `i` for iOS Simulator.

## Accounts & Roles

Access is determined by a `role` field on each user (`user` or `admin`), not by email.
After login, admins are routed to the Admin Dashboard and regular users to the customer app.
New sign-ups are always `user`. The seed script creates one admin and one demo-user
account and prints their credentials in the console when you run `npm run seed`.

To promote another account, log in as an admin → **Users** tab → tap the shield icon.

## API Endpoints

### Auth
- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — log in (returns a JWT + user)
- `GET /api/auth/me` — current user *(auth required)*

### Restaurants & Orders
- `GET /api/restaurants` — list restaurants
- `GET /api/restaurants/:id` — restaurant with its menu
- `GET /api/restaurants/:id/menu` — menu items
- `POST /api/orders` — place an order
- `GET /api/orders` — current user's orders
- `GET /api/orders/:id/status` — order status

### Admin *(require `admin` role)*
- `GET /api/admin/stats` — dashboard totals and orders-by-status
- `GET /api/admin/orders` · `PATCH /api/admin/orders/:id/status` — view & update orders
- `POST` / `PUT /:id` / `DELETE /:id` on `/api/admin/restaurants` — manage restaurants
- `POST` / `PUT /:id` / `DELETE /:id` on `/api/admin/menu-items` — manage menu items
- `GET /api/admin/users` · `PATCH /api/admin/users/:id/role` — list users & change roles

## Project Structure

- `backend/`: Node.js + Express API (Prisma ORM)
    - `controllers/`: Request handlers (`auth`, `restaurant`, `order`, `admin`) + `seed.js`
    - `routes/`: API route definitions (incl. `admin.routes.js`)
    - `prisma/`: Prisma schema (`schema.prisma`)
    - `lib/`: Prisma client singleton
    - `utils/`: Auth middleware (JWT, `requireAdmin`)
- `frontend/`: React Native Expo app
    - `src/screens/`: Customer screens (Home, Menu, Cart, Orders, Profile, UserDashboard)
    - `src/screens/admin/`: Admin screens (Dashboard, Orders, Restaurants, Menu, Users)
    - `src/navigation/`: Role-based navigation
    - `src/context/`: React Context (Auth)
    - `src/config/`: Image mappings
    - `src/api.js`: Axios API client
    - `assets/`: Images and icons

## License

MIT
