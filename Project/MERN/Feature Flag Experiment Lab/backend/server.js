import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js';
import flagRoutes from './src/routes/flags.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/flags', flagRoutes);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feature_flag_lab')
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('Feature Flag API')));
