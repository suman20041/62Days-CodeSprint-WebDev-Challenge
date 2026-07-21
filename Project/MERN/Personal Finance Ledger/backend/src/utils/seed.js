// Optional helper: creates a demo user with a couple of accounts and
// categories so there is something to look at immediately.
// Run with: npm run seed (after configuring .env)
import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Account from '../models/Account.js';
import Category from '../models/Category.js';

async function run() {
  await connectDB();

  const email = 'demo@ledger.local';
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email,
      passwordHash: await User.hashPassword('demo1234'),
    });
    console.log('Created demo user: demo@ledger.local / demo1234');
  } else {
    console.log('Demo user already exists');
  }

  const accountDefs = [
    { name: 'Checking Account', type: 'asset', openingBalance: 1500 },
    { name: 'Savings Account', type: 'asset', openingBalance: 5000 },
    { name: 'Credit Card', type: 'liability', openingBalance: 0 },
    { name: 'Salary', type: 'income', openingBalance: 0 },
    { name: 'Groceries Expense', type: 'expense', openingBalance: 0 },
    { name: 'Rent Expense', type: 'expense', openingBalance: 0 },
  ];
  for (const def of accountDefs) {
    await Account.findOneAndUpdate(
      { user: user._id, name: def.name },
      { user: user._id, ...def },
      { upsert: true }
    );
  }

  const categoryDefs = [
    { name: 'Groceries', kind: 'expense', color: '#e8590c' },
    { name: 'Housing', kind: 'expense', color: '#5c940d' },
    { name: 'Paycheck', kind: 'income', color: '#2f9e44' },
  ];
  for (const def of categoryDefs) {
    await Category.findOneAndUpdate(
      { user: user._id, name: def.name },
      { user: user._id, ...def },
      { upsert: true }
    );
  }

  console.log('Seed complete.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
