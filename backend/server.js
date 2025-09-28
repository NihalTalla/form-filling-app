const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'demo',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  connectionLimit: 10,
  queueLimit: 0
};

// Create database connection pool
let pool;

const createDbConnection = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error.message);
    
    // If database doesn't exist, try to create it
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('🔄 Database does not exist. Attempting to create...');
      await createDatabase();
    } else {
      throw error;
    }
  }
};

const createDatabase = async () => {
  try {
    const { DB_NAME, ...configWithoutDb } = dbConfig;
    const tempPool = mysql.createPool(configWithoutDb);
    
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' created successfully`);
    
    await tempPool.end();
    
    // Now connect to the created database
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ Connected to newly created database');
    connection.release();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
};

// Validation functions
const validateName = (name) => {
  if (!name || typeof name !== 'string') return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 100) return 'Name must be less than 100 characters';
  return null;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  if (email.length > 100) return 'Email must be less than 100 characters';
  return null;
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create user endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    const nameError = validateName(name);
    if (nameError) {
      return res.status(400).json({ message: nameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [trimmedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        message: 'This email address is already registered. Please use a different email.' 
      });
    }

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [trimmedName, trimmedEmail]
    );

    // Get the created user
    const [newUser] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    console.log(`✅ New user created: ${trimmedEmail}`);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ 
        message: 'This email address is already registered. Please use a different email.' 
      });
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      res.status(500).json({ 
        message: 'Database table not found. Please ensure the database is properly set up.' 
      });
    } else {
      res.status(500).json({ 
        message: 'Internal server error. Please try again later.' 
      });
    }
  }
});

// Get all users endpoint (for admin/testing purposes)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      message: 'Users retrieved successfully',
      users: users,
      count: users.length
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/users',
      'GET /api/users'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    message: 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    await createDbConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 API endpoint: http://localhost:${PORT}/api/users`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();