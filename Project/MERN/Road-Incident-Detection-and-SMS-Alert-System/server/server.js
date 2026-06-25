require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // for parsing application/json

// --- Config from Environment Variables ---
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// --- Connect to MongoDB ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});