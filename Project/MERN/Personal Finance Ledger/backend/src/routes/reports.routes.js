import { Router } from 'express';
import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/summary', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const accounts = await Account.find({ user: userId });

    const balances = await Promise.all(
      accounts.map(async (account) => {
        const rows = await Transaction.aggregate([
          { $match: { user: userId } },
          { $unwind: '$entries' },
          { $match: { 'entries.account': account._id } },
          { $group: { _id: '$entries.direction', total: { $sum: '$entries.amount' } } },
        ]);
        const debit = rows.find((r) => r._id === 'debit')?.total || 0;
        const credit = rows.find((r) => r._id === 'credit')?.total || 0;
        const isDebitNormal = account.type === 'asset' || account.type === 'expense';
        const net = isDebitNormal ? debit - credit : credit - debit;
        return {
          accountId: account._id,
          name: account.name,
          type: account.type,
          balance: account.openingBalance + net,
        };
      })
    );

    const byCategory = await Transaction.aggregate([
      { $match: { user: userId } },
      { $unwind: '$entries' },
      { $match: { 'entries.category': { $ne: null } } },
      {
        $group: {
          _id: '$entries.category',
          total: { $sum: '$entries.amount' },
        },
      },
    ]);
    const categories = await Category.find({ user: userId });
    const categoryMap = new Map(categories.map((c) => [String(c._id), c]));
    const expenseByCategory = byCategory
      .map((row) => ({
        category: categoryMap.get(String(row._id))?.name || 'Unknown',
        kind: categoryMap.get(String(row._id))?.kind || 'expense',
        total: row.total,
      }))
      .filter((row) => row.kind === 'expense');
    const incomeByCategory = byCategory
      .map((row) => ({
        category: categoryMap.get(String(row._id))?.name || 'Unknown',
        kind: categoryMap.get(String(row._id))?.kind || 'income',
        total: row.total,
      }))
      .filter((row) => row.kind === 'income');

    const monthly = await Transaction.aggregate([
      { $match: { user: userId } },
      { $unwind: '$entries' },
      {
        $lookup: { from: 'accounts', localField: 'entries.account', foreignField: '_id', as: 'acct' },
      },
      { $unwind: '$acct' },
      { $match: { 'acct.type': { $in: ['income', 'expense'] } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$acct.type' },
          total: { $sum: '$entries.amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const monthlyMap = new Map();
    monthly.forEach((row) => {
      const key = row._id.month;
      if (!monthlyMap.has(key)) monthlyMap.set(key, { month: key, income: 0, expense: 0 });
      monthlyMap.get(key)[row._id.type] = row.total;
    });

    res.json({
      balances,
      expenseByCategory,
      incomeByCategory,
      monthly: Array.from(monthlyMap.values()),
      netWorth: balances
        .filter((b) => ['asset', 'liability'].includes(b.type))
        .reduce((sum, b) => sum + (b.type === 'asset' ? b.balance : -b.balance), 0),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
