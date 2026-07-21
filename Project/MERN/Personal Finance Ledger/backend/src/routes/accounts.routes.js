import { Router } from 'express';
import mongoose from 'mongoose';
import Account, { ACCOUNT_TYPE_VALUES } from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

async function computeBalance(accountId, openingBalance) {
  const rows = await Transaction.aggregate([
    { $match: { entries: { $elemMatch: { account: new mongoose.Types.ObjectId(accountId) } } } },
    { $unwind: '$entries' },
    { $match: { 'entries.account': new mongoose.Types.ObjectId(accountId) } },
    {
      $group: {
        _id: '$entries.direction',
        total: { $sum: '$entries.amount' },
      },
    },
  ]);

  const debit = rows.find((r) => r._id === 'debit')?.total || 0;
  const credit = rows.find((r) => r._id === 'credit')?.total || 0;
  // Convention: asset/expense accounts increase with debits, everything
  // else (liability/income/equity) increases with credits.
  return { debit, credit, net: debit - credit, openingBalance };
}

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).sort({ type: 1, name: 1 });
    const withBalances = await Promise.all(
      accounts.map(async (account) => {
        const { debit, credit, net } = await computeBalance(account._id, account.openingBalance);
        const isDebitNormal = account.type === 'asset' || account.type === 'expense';
        const balance = account.openingBalance + (isDebitNormal ? net : -net);
        return { ...account.toObject(), debitTotal: debit, creditTotal: credit, balance };
      })
    );
    res.json(withBalances);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, type, openingBalance = 0, currency = 'USD' } = req.body;
    if (!name || !ACCOUNT_TYPE_VALUES.includes(type)) {
      return res.status(400).json({ message: `type must be one of ${ACCOUNT_TYPE_VALUES.join(', ')}` });
    }
    const account = await Account.create({ user: req.user._id, name, type, openingBalance, currency });
    res.status(201).json(account);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Account name already exists' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const inUse = await Transaction.exists({ 'entries.account': req.params.id });
    if (inUse) {
      return res.status(400).json({ message: 'Cannot delete an account that has transactions. Archive it instead.' });
    }
    const account = await Account.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
