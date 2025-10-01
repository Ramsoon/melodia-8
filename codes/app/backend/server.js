const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory user database
const users = [
    { username: 'admin', password: 'nimc123', role: 'Administrator' },
    { username: 'officer', password: 'officer123', role: 'Registration Officer' },
    { username: 'staff', password: 'staff123', role: 'Support Staff' }
];

// Test endpoint to show loaded secrets
app.get('/api/secrets-info', (req, res) => {
    res.json({
        message: 'NIMC API Secrets Information',
        environment: process.env.ENVIRONMENT || 'development',
        loadedSecrets: {
            weatherApiKey: process.env.WEATHER_API_KEY ? '✅ Loaded' : '❌ Missing',
            paymentApiKey: process.env.PAYMENT_API_KEY ? '✅ Loaded' : '❌ Missing',
            encryptionKey: process.env.ENCRYPTION_KEY ? '✅ Loaded' : '❌ Missing',
            smtpPassword: process.env.SMTP_PASSWORD ? '✅ Loaded' : '❌ Missing'
        },
        mountedSecrets: {
            apiKeysFile: process.env.API_KEYS_FILE ? '✅ Mounted' : '❌ Missing'
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({
            success: true,
            message: `Welcome to NIMC Official Portal, ${user.role}!`,
            user: {
                username: user.username,
                role: user.role,
                loginTime: new Date().toLocaleString()
            },
            // Show that we're using secure API keys (just for demo)
            security: 'All API keys are securely stored in Kubernetes Secrets'
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid NIMC credentials'
        });
    }
});

// Test API keys endpoint (simulates using external APIs)
app.get('/api/test-apis', (req, res) => {
    // These would normally be used to call external APIs
    const apiKeys = {
        weatherService: process.env.WEATHER_API_KEY ? 'Configured ✓' : 'Not configured',
        paymentGateway: process.env.PAYMENT_API_KEY ? 'Configured ✓' : 'Not configured',
        encryptionService: process.env.ENCRYPTION_KEY ? 'Configured ✓' : 'Not configured',
        emailService: process.env.SMTP_PASSWORD ? 'Configured ✓' : 'Not configured'
    };

    res.json({
        message: 'NIMC External API Status',
        apis: apiKeys,
        note: 'All API keys are securely stored in Kubernetes Secrets, not in code!'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Healthy',
        service: 'NIMC Backend API',
        timestamp: new Date().toISOString(),
        environment: process.env.ENVIRONMENT
    });
});

app.listen(PORT, () => {
    console.log(`🔐 NIMC Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.ENVIRONMENT}`);
    console.log(`🔑 Weather API Key: ${process.env.WEATHER_API_KEY ? 'Loaded' : 'Missing'}`);
});