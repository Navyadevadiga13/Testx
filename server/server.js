const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
console.log('ADMIN_USERNAME loaded:', JSON.stringify(process.env.ADMIN_USERNAME));
console.log('ADMIN_PASSWORD loaded:', JSON.stringify(process.env.ADMIN_PASSWORD));

// Fix for MongoDB querySrv ECONNREFUSED issue on some networks
if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv')) {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = express();
const PORT = process.env.PORT || 5008;

// --- 1. MIDDLEWARE ---
app.use(helmet());
app.use(morgan('dev'));

// ✅ CORS FIX — allow all localhost origins + handle preflight OPTIONS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://testx.cc',
      'https://www.testx.cc'
    ];
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight OPTIONS requests for all routes
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));

// --- 2. RATE LIMITING ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use('/api', limiter);

// --- 3. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/psychometric-db')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// --- 4. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/appointment', require('./routes/appointmentRoutes'));

// --- 5. ERROR HANDLERS ---
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ Handle port already in use gracefully
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running safely at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Run: taskkill /F /PID $(netstat -ano | findstr :${PORT})`);
    process.exit(1);
  }
});