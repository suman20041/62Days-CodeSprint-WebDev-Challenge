import { Router } from 'express';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ kind: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, kind, color } = req.body;
    if (!name || !['income', 'expense'].includes(kind)) {
      return res.status(400).json({ message: 'name and kind (income|expense) are required' });
    }
    const category = await Category.create({ user: req.user._id, name, kind, color });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Category name already exists' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
