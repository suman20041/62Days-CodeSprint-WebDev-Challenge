import mongoose from 'mongoose';

const templateEntrySchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    direction: { type: String, enum: ['debit', 'credit'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
  },
  { _id: false }
);

const recurringBillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    memo: { type: String, required: true, trim: true },
    entries: { type: [templateEntrySchema], required: true },
    frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
    nextRunDate: { type: Date, required: true },
    lastRunDate: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export function advanceDate(date, frequency) {
  const next = new Date(date);
  if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  else if (frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
  return next;
}

export default mongoose.model('RecurringBill', recurringBillSchema);
