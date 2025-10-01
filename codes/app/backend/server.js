const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple in-memory user database
const users = [
    { username: 'admin', password: 'nimc123', role: 'Administrator' },
    { username: 'officer', password: 'officer123', role: 'Registration Officer' },
    { username: 'staff', password: 'staff123', role: 'Support Staff' }
];

// Add root endpoint for testing
app.get('/', (req, res) => {
    res.json({
        message: 'NIMC Backend API is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            login: '/api/login',
            secrets: '/api/secrets-info',
            apis: '/api/test-apis'
        }
    });
});

// Test endpoint to show loaded secrets
app.get('/api/secrets-info', (req, res) => {
    console.log('Secrets info requested');
    res.json({
        message: 'NIMC API Secrets Information',
        environment: process.env.ENVIRONMENT || 'development',
        appName: process.env.APP_NAME || 'NIMC App',
        loadedSecrets: {
            weatherApiKey: process.env.WEATHER_API_KEY ? '✅ Loaded' : '❌ Missing',
            paymentApiKey: process.env.PAYMENT_API_KEY ? '✅ Loaded' : '❌ Missing',
            encryptionKey: process.env.ENCRYPTION_KEY ? '✅ Loaded' : '❌ Missing',
            smtpPassword: process.env.SMTP_PASSWORD ? '✅ Loaded' : '❌ Missing'
        },
        secretValues: {
            // Don't show actual values, just confirmation
            weatherApiKeyLength: process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY.length : 0,
            paymentApiKeyLength: process.env.PAYMENT_API_KEY ? process.env.PAYMENT_API_KEY.length : 0,
            encryptionKeyLength: process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY.length : 0
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for user: ${username}`);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log(`Login successful for: ${username}`);
        res.json({
            success: true,
            message: `Welcome to NIMC Official Portal, ${user.role}!`,
            user: {
                username: user.username,
                role: user.role,
                loginTime: new Date().toLocaleString()
            },
            security: 'All API keys are securely stored in Kubernetes Secrets'
        });
    } else {
        console.log(`Login failed for: ${username}`);
        res.status(401).json({
            success: false,
            error: 'Invalid NIMC credentials'
        });
    }
});

// Test API keys endpoint
app.get('/api/test-apis', (req, res) => {
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
        environment: process.env.ENVIRONMENT,
        secretsLoaded: !!process.env.WEATHER_API_KEY
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔐 NIMC Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.ENVIRONMENT}`);
    console.log(`🏢 App Name: ${process.env.APP_NAME}`);
    console.log(`🔑 Weather API Key loaded: ${!!process.env.WEATHER_API_KEY}`);
    console.log(`💳 Payment API Key loaded: ${!!process.env.PAYMENT_API_KEY}`);
});
