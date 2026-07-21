import { Router } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import { protect } from '../middleware/auth.js';
import { rowsToCsv, csvToRows } from '../utils/csv.js';

const router = Router();
router.use(protect);

async function assertOwnedAccounts(userId, entries) {
  const ids = [...new Set(entries.map((e) => String(e.account)))];
  const count = await Account.countDocuments({ _id: { $in: ids }, user: userId });
  if (count !== ids.length) {
    const err = new Error('One or more accounts do not belong to this user');
    err.status = 400;
    throw err;
  }
}

// Creates the transaction. If the connected MongoDB is a replica set we use
// a real multi-document transaction/session (the "Mongo transactions"
// option from the spec); otherwise we fall back to the Mongoose schema
// validation in Transaction.js, which already rejects unbalanced entries.
async function createBalancedTransaction(payload) {
  const supportsTx = mongoose.connection.supportsTransactions;
  if (!supportsTx) {
    return Transaction.create(payload);
  }

  const session = await mongoose.startSession();
  try {
    let created;
    await session.withTransaction(async () => {
      const [doc] = await Transaction.create([payload], { session });
      created = doc;
    });
    return created;
  } finally {
    session.endSession();
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { account, category, tag, from, to, page = 1, limit = 25 } = req.query;
    const filter = { user: req.user._id };
    if (account) filter['entries.account'] = account;
    if (category) filter['entries.category'] = category;
    if (tag) filter.tags = tag;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 25));

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('entries.account', 'name type')
        .populate('entries.category', 'name kind'),
      Transaction.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { date, memo, tags, entries } = req.body;
    if (!Array.isArray(entries) || entries.length < 2) {
      return res.status(400).json({ message: 'At least two entries are required for double-entry bookkeeping' });
    }

    const debit = entries.filter((e) => e.direction === 'debit').reduce((s, e) => s + Number(e.amount || 0), 0);
    const credit = entries.filter((e) => e.direction === 'credit').reduce((s, e) => s + Number(e.amount || 0), 0);
    if (Math.round(debit * 100) !== Math.round(credit * 100)) {
      return res.status(400).json({
        message: `Entries are not balanced: debits=${debit.toFixed(2)} credits=${credit.toFixed(2)}`,
      });
    }

    await assertOwnedAccounts(req.user._id, entries);

    const transaction = await createBalancedTransaction({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      memo,
      tags,
      entries,
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

// Optimistic concurrency: the client must send the `version` it last saw.
// If it no longer matches the stored document, someone else already edited
// this transaction and we return 409 with the current server copy so the
// frontend can show a conflict-resolution dialog.
router.put('/:id', async (req, res, next) => {
  try {
    const { version, date, memo, tags, entries } = req.body;

    if (entries) {
      if (!Array.isArray(entries) || entries.length < 2) {
        return res.status(400).json({ message: 'At least two entries are required' });
      }
      const debit = entries.filter((e) => e.direction === 'debit').reduce((s, e) => s + Number(e.amount || 0), 0);
      const credit = entries.filter((e) => e.direction === 'credit').reduce((s, e) => s + Number(e.amount || 0), 0);
      if (Math.round(debit * 100) !== Math.round(credit * 100)) {
        return res.status(400).json({ message: 'Entries are not balanced' });
      }
      await assertOwnedAccounts(req.user._id, entries);
    }

    const current = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!current) return res.status(404).json({ message: 'Transaction not found' });

    if (typeof version === 'number' && version !== current.version) {
      return res.status(409).json({
        message: 'This transaction was changed elsewhere. Review and retry.',
        current,
      });
    }

    if (date !== undefined) current.date = new Date(date);
    if (memo !== undefined) current.memo = memo;
    if (tags !== undefined) current.tags = tags;
    if (entries !== undefined) current.entries = entries;
    current.version += 1;

    await current.save();
    res.json(current);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
});

router.get('/export/csv', async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: 1 })
      .populate('entries.account', 'name')
      .populate('entries.category', 'name');

    const rows = [];
    transactions.forEach((tx) => {
      tx.entries.forEach((entry) => {
        rows.push({
          date: tx.date.toISOString().slice(0, 10),
          memo: tx.memo,
          tags: tx.tags.join('|'),
          account: entry.account?.name || '',
          category: entry.category?.name || '',
          direction: entry.direction,
          amount: entry.amount,
          transactionId: tx._id.toString(),
        });
      });
    });

    const csv = rowsToCsv(rows, [
      { label: 'date', value: (r) => r.date },
      { label: 'memo', value: (r) => r.memo },
      { label: 'tags', value: (r) => r.tags },
      { label: 'account', value: (r) => r.account },
      { label: 'category', value: (r) => r.category },
      { label: 'direction', value: (r) => r.direction },
      { label: 'amount', value: (r) => r.amount },
      { label: 'transactionId', value: (r) => r.transactionId },
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// Import expects rows grouped by transactionId (blank id => 2-line transfer
// pairs are grouped by date+memo instead). Accounts/categories are matched
// by name, created implicitly is NOT done here - unknown accounts are
// reported back as errors so the user can create them first.
router.post('/import/csv', async (req, res, next) => {
  try {
    const { csv } = req.body;
    if (!csv) return res.status(400).json({ message: 'csv text body is required' });

    const rows = csvToRows(csv);
    const accounts = await Account.find({ user: req.user._id });
    const accountByName = new Map(accounts.map((a) => [a.name.toLowerCase(), a]));

    const groups = new Map();
    rows.forEach((row, idx) => {
      const key = row.transactionId?.trim() || `${row.date}|${row.memo}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ ...row, __line: idx + 2 });
    });

    const created = [];
    const errors = [];

    for (const [key, groupRows] of groups) {
      const entries = [];
      let bad = false;
      for (const row of groupRows) {
        const account = accountByName.get((row.account || '').toLowerCase());
        if (!account) {
          errors.push(`Line ${row.__line}: unknown account "${row.account}"`);
          bad = true;
          continue;
        }
        entries.push({
          account: account._id,
          direction: row.direction,
          amount: Number(row.amount),
        });
      }
      if (bad || entries.length < 2) continue;

      const debit = entries.filter((e) => e.direction === 'debit').reduce((s, e) => s + e.amount, 0);
      const credit = entries.filter((e) => e.direction === 'credit').reduce((s, e) => s + e.amount, 0);
      if (Math.round(debit * 100) !== Math.round(credit * 100)) {
        errors.push(`Group "${key}": debits ${debit} != credits ${credit}, skipped`);
        continue;
      }

      const first = groupRows[0];
      const tx = await createBalancedTransaction({
        user: req.user._id,
        date: first.date ? new Date(first.date) : new Date(),
        memo: first.memo || '',
        tags: (first.tags || '').split('|').filter(Boolean),
        entries,
      });
      created.push(tx._id);
    }

    res.json({ createdCount: created.length, errors });
  } catch (err) {
    next(err);
  }
});

export default router;
