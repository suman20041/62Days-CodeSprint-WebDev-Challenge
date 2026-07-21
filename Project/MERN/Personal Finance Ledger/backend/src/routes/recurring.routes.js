import { Router } from 'express';
import RecurringBill, { advanceDate } from '../models/RecurringBill.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const bills = await RecurringBill.find({ user: req.user._id })
      .sort({ nextRunDate: 1 })
      .populate('entries.account', 'name')
      .populate('entries.category', 'name');
    res.json(bills);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { memo, entries, frequency, nextRunDate } = req.body;
    if (!memo || !Array.isArray(entries) || entries.length < 2 || !frequency || !nextRunDate) {
      return res.status(400).json({ message: 'memo, entries (>=2), frequency and nextRunDate are required' });
    }
    const bill = await RecurringBill.create({
      user: req.user._id,
      memo,
      entries,
      frequency,
      nextRunDate: new Date(nextRunDate),
    });
    res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const bill = await RecurringBill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!bill) return res.status(404).json({ message: 'Recurring bill not found' });
    res.json(bill);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const bill = await RecurringBill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!bill) return res.status(404).json({ message: 'Recurring bill not found' });
    res.json({ message: 'Recurring bill deleted' });
  } catch (err) {
    next(err);
  }
});

// In a production app this would be triggered by a cron job / scheduler.
// Here it's an explicit endpoint the frontend can call ("Run due bills")
// so the behaviour is easy to observe for learning purposes.
router.post('/run-due', async (req, res, next) => {
  try {
    const now = new Date();
    const due = await RecurringBill.find({ user: req.user._id, active: true, nextRunDate: { $lte: now } });

    const createdTransactions = [];
    for (const bill of due) {
      const tx = await Transaction.create({
        user: req.user._id,
        date: bill.nextRunDate,
        memo: `[Recurring] ${bill.memo}`,
        tags: ['recurring'],
        entries: bill.entries,
        recurringBill: bill._id,
      });
      createdTransactions.push(tx);

      bill.lastRunDate = bill.nextRunDate;
      bill.nextRunDate = advanceDate(bill.nextRunDate, bill.frequency);
      await bill.save();
    }

    res.json({ ranCount: createdTransactions.length, transactions: createdTransactions });
  } catch (err) {
    next(err);
  }
});

export default router;
