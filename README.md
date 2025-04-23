# React Todo App

A full-stack todo list application built with React, TypeScript, and Node.js with MongoDB backend.

## Features

- Add new todos
- Mark todos as completed
- Delete todos
- Edit existing todos
- User authentication (register, login)
- Persistent storage with MongoDB
- Responsive design

## Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start development server (frontend only)
npm run dev

# Start backend server separately
cd backend
npm run dev
```

## Using Docker

The application can be run using Docker Compose for easier setup:

```bash
# Start both frontend and backend using Docker
docker-compose up
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:5000

## Port Handling

The application is designed to work with different port configurations:

1. By default, the backend runs on port 5000
2. If port 5000 is already in use, the server will automatically try the next available port (5001, 5002, etc.)
3. The frontend will automatically detect which port the backend is running on
4. You can customize the port by changing the PORT value in backend/.env

This ensures the application can be deployed in any local environment without port conflicts.

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
MONGO_URI=mongodb://mongodb:27017/todoapp
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Authentication

The app includes user authentication:
1. Register a new account with email and password
2. Login to access your personal todo items
3. Protected routes ensure only authenticated users can access certain features

## Data Persistence

All user account information and todo data is stored in MongoDB. The app follows this data flow:

1. **User Authentication**: When you register or login, your credentials are verified with the backend
2. **JWT Token**: Upon successful login, the server generates a JWT token that is stored in your browser's localStorage
3. **API Requests**: All requests to the API include this token, allowing the server to identify you
4. **Todo Data Storage**: Your todo lists and items are stored in MongoDB collections
5. **Data Association**: All todo items are associated with your user account
6. **Data Fetching**: When you load the app, it fetches your specific todo data from the database
7. **Auto-login**: If you refresh the page, the app checks localStorage for your token and automatically logs you in

This ensures your data persists across sessions and is available on any device you log in from.

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite
  - CSS
  - Context API for state management

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT for authentication
  - Mongoose ODM

- DevOps:
  - Docker & Docker Compose 