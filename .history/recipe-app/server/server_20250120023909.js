const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Import routes
const ingredientRoutes = require("./routes/ingredients");
const categoryRoutes = require("./routes/categories");
const menuRouter = require("./routes/menus");
const roleRouter = require("./routes/roles");
const userRouter = require("./routes/users");
const authRoutes = require("./routes/auth");
const resetPasswordRoutes = require("./routes/resetPassword");
const videoRoutes = require("./routes/videoRoutes");
const statsRouter = require("./routes/stats");
const attendanceRouter = require("./routes/attendance");

const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tien:Dtmghsk29903@cluster0.4owga.mongodb.net/recipe_db';

// Request Logger Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}]`);
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', req.method !== 'GET' ? JSON.stringify(req.body, null, 2) : 'No body in GET request');
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('Params:', JSON.stringify(req.params, null, 2));
        console.log('------------------------');
    });
    next();
});

// Basic Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = [
    'https://countlory.onrender.com',
    'https://demcalo.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        routes: app._router.stack
            .filter(r => r.route)
            .map(r => ({
                path: r.route.path,
                methods: Object.keys(r.route.methods)
            }))
    });
});

// Log mounted routes
console.log('=== MOUNTED ROUTES ===');
// API Routes with explicit prefixes
const apiRoutes = [
    { path: '/api/ingredients', router: ingredientRoutes },
    { path: '/api/categories', router: categoryRoutes },
    { path: '/api/menus', router: menuRouter },
    { path: '/api/roles', router: roleRouter },
    { path: '/api/users', router: userRouter },
    { path: '/api/auth', router: authRoutes },
    { path: '/api/auth', router: resetPasswordRoutes },
    { path: '/api/videos', router: videoRoutes },
    { path: '/api/stats', router: statsRouter },
    { path: '/api/attendance', router: attendanceRouter }
];

apiRoutes.forEach(({ path, router }) => {
    app.use(path, router);
    console.log(`Mounted route: ${path}`);
});

// MongoDB Connection with enhanced error handling
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(async () => {
    console.log("📦 MongoDB Connected Successfully");
    
    // Log database information
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    for (const { path } of apiRoutes) {
        const modelName = path.split('/').pop();
        if (mongoose.models[modelName]) {
            const count = await mongoose.models[modelName].countDocuments();
            console.log(`${modelName} count:`, count);
        }
    }
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

// Production static files
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('=== ERROR DETAILS ===');
    console.error('Time:', new Date().toISOString());
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        code: err.code
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate key error',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token or authentication failed'
        });
    }

    // Generic error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

// 404 Handler - Must be last
app.use((req, res) => {
    console.log(`=== 404 NOT FOUND ===`);
    console.log('Time:', new Date().toISOString());
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: app._router.stack
            .filter(r => r.route)
            .map(r => ({
                path: r.route.path,
                methods: Object.keys(r.route.methods)
            }))
    });
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥');
    console.error(err);
    server.close(() => process.exit(1));
});

module.exports = app;