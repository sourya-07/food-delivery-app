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
    This prints the login credentials:
    - **Admin**: `admin@food.app` / `admin123`
    - **User**: `user@food.app` / `user123`
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

## Project Structure

- `backend/`: Node.js Express API
    - `controllers/`: Request handlers
    - `models/`: Sequelize models
    - `routes/`: API route definitions
    - `config/`: Database configuration
- `frontend/`: React Native Expo App
    - `src/screens/`: Application screens
    - `src/navigation/`: Navigation configuration
    - `src/context/`: React Context (Auth)
    - `src/config/`: Configuration files (Images)
    - `assets/`: Images and icons

## License

MIT
