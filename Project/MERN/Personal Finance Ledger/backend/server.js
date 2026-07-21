import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js'; import ledgerRoutes from './src/routes/ledger.js';
const app=express(); app.use(cors()); app.use(express.json({limit:'2mb'}));
app.use('/api/auth',authRoutes); app.use('/api/ledger',ledgerRoutes);
mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/finance_ledger').then(()=>app.listen(process.env.PORT||5000,()=>console.log('Ledger API')));