# Food Delivery App

A full-stack food delivery application built with React Native (Expo) and Node.js.

## Features

- **Authentication**: Secure Login and Signup flow with JWT.
- **Restaurant Listing**: Browse restaurants with ratings and descriptions.
- **Menu Browsing**: View menu items with images and prices.
- **Cart Management**: Add items to cart, view total, and place orders.
- **Order Tracking**: View order status and history.
- **Dark Theme**: Sleek, consistent dark mode UI.
- **Protected Routes**: Secure navigation based on authentication state.

## Tech Stack

- **Frontend**: React Native, Expo, React Navigation, Axios, AsyncStorage
- **Backend**: Node.js, Express, Sequelize, MySQL
- **Assets**: Lucide React Native Icons

## Prerequisites

- Node.js (v14 or later)
- MySQL Server
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
    - Add your database credentials (see `.env.example` or code for keys).
    ```env
    PORT=4000
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=maddb
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server (this will also sync the database):
    ```bash
    npx nodemon server.js
    ```
5.  (Optional) Seed the database with initial data:
    ```bash
    node controllers/seed.js
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
