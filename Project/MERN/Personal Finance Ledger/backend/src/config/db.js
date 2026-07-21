import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_ledger';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected:', uri);

  // Double-entry balance validation is easiest to reason about inside a
  // multi-document transaction. Replica sets support this; a standalone
  // Mongo instance does not. We detect that once at startup so the
  // transaction routes know whether to fall back to manual validation.
  try {
    const admin = mongoose.connection.db.admin();
    const info = await admin.command({ isMaster: 1 });
    mongoose.connection.supportsTransactions = Boolean(info.setName);
  } catch {
    mongoose.connection.supportsTransactions = false;
  }
}
