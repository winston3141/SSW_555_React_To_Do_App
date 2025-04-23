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