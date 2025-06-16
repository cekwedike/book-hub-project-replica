import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database (with error handling)
connectDB().catch(err => {
  console.warn('⚠️  MongoDB connection failed, but server will continue running');
  console.warn('   You can still test the API structure without database operations');
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Hub API',
      version: '1.0.0',
      description: 'A comprehensive book discovery and management API',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Book Hub API is running',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      books: '/api/books',
      search: '/api/books/search',
      genre: '/api/books/genre/:genre',
      author: '/api/books/author/:author'
    }
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    name: 'Book Hub API',
    version: '1.0.0',
    description: 'A comprehensive book discovery and management API',
    endpoints: {
      books: {
        getAll: 'GET /api/books',
        getById: 'GET /api/books/:id',
        search: 'GET /api/books/search?q=query',
        filter: 'GET /api/books?genre=Fantasy&minRating=4.5',
        create: 'POST /api/books',
        update: 'PUT /api/books/:id',
        delete: 'DELETE /api/books/:id'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api',
      'GET /api/books',
      'GET /api/books/search',
      'GET /api/books/genre/:genre',
      'GET /api/books/author/:author'
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Book Hub API ready at http://localhost:${PORT}`);
  console.log(`🔍 API Documentation available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check available at http://localhost:${PORT}/`);
}); 