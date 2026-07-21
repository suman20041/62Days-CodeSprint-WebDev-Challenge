import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js'; import habitRoutes from './src/routes/habits.js';
const app=express(); app.use(cors()); app.use(express.json());
app.use('/api/auth',authRoutes); app.use('/api/habits',habitRoutes);
const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/habit_tracker').then(()=>app.listen(port,()=>console.log('Habit API',port)));