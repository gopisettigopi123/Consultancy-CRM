const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const os = require('os');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:5173', 'https://consultancy-crm-omega.vercel.app'], // Removed trailing slash
    credentials: true
}));


// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const mockRoutes = require('./routes/mockRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user-management', userManagementRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

/**
 * Get local IPv4 address
 * @returns {string|null}
 */
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
};

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    console.log('\n' + '🚀'.repeat(20));
    console.log(`  RECRUITMENT CRM STARTED`);
    console.log('  ' + '-'.repeat(20));
    console.log(`  Local:   http://localhost:${PORT}`);
    if (localIP) {
        console.log(`  Network: http://${localIP}:${PORT}`);
        console.log(`\n  📱 To access from another device:`);
        console.log(`  Open http://${localIP}:${PORT} on your phone/tablet`);
    } else {
        console.log(`  Network: Could not detect local IPv4 address`);
    }
    console.log('🚀'.repeat(20) + '\n');
});

// Handle server errors (like port already in use)
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[!] Error: Port ${PORT} is already in use.`);
        console.error(`Please close any existing process running on port ${PORT} or change the PORT in your .env file.\n`);
        process.exit(1);
    } else {
        console.error(`\n[!] Server error:`, err.message);
        process.exit(1);
    }
});

