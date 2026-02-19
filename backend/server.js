require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/ai'); // ✅ FIXED

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/customize', require('./routes/customizeRoutes'));
app.use('/uploads', express.static('uploads'));

// ✅ AI Route
app.use("/api", aiRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
