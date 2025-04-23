const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Get port from environment and store in Express
const PORT = process.env.PORT || 5000;
let currentPort = PORT;
let maxPortTries = 10; // Try up to 10 different ports

// Start server with automatic port increment if needed
function startServer(port) {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    })
    .on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // Handle specific listen errors
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          if (maxPortTries <= 0) {
            console.error('Could not find an available port after multiple attempts');
            process.exit(1);
          }
          
          const nextPort = parseInt(port) + 1;
          console.error(`Port ${port} is already in use. Trying port ${nextPort}`);
          
          // Reduce remaining tries and try next port
          maxPortTries--;
          startServer(nextPort);
          break;
        default:
          throw error;
      }
    });
}

// Initial server start
startServer(currentPort); 