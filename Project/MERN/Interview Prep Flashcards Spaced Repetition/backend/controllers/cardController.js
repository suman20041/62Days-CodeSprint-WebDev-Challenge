const Card = require('../models/Card');
const User = require('../models/User');
const { TOPICS } = require('../models/Card');
const {
  applySm2,
  startOfToday,
  endOfToday,
  dateKey,
} = require('../utils/sm2');

const listCards = async (req, res) => {
  try {
    const { q, topic } = req.query;
    const filter = { owner: req.user._id };

    if (topic) filter.topic = String(topic).toLowerCase().trim();
    if (q && String(q).trim()) {
      filter.$text = { $search: String(q).trim() };
    }

    const cards = await Card.find(filter).sort({ updatedAt: -1 });
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch cards.' });
  }
};

const getCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }
    res.json({ card });
  } catch (_error) {
    res.status(404).json({ message: 'Card not found.' });
  }
};

const createCard = async (req, res) => {
  try {
    const { front, back, topic, hint } = req.body;

    if (!front || !back) {
      return res
        .status(400)
        .json({ message: 'Front and back are required.' });
    }

    const t = String(topic || 'general').toLowerCase();
    if (!TOPICS.includes(t)) {
      return res.status(400).json({ message: 'Unsupported topic.' });
    }

    const card = await Card.create({
      front: front.trim(),
      back: back.trim(),
      topic: t,
      hint: (hint || '').trim(),
      owner: req.user._id,
      dueDate: new Date(),
    });

    res.status(201).json({ card });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create card.' });
  }
};

const updateCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    const { front, back, topic, hint } = req.body;

    if (front !== undefined) card.front = front.trim();
    if (back !== undefined) card.back = back.trim();
    if (hint !== undefined) card.hint = hint.trim();
    if (topic !== undefined) {
      const t = String(topic).toLowerCase();
      if (!TOPICS.includes(t)) {
        return res.status(400).json({ message: 'Unsupported topic.' });
      }
      card.topic = t;
    }

    await card.save();
    res.json({ card });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update card.' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    await card.deleteOne();
    res.json({ message: 'Card deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete card.' });
  }
};

const dueQueue = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = {
      owner: req.user._id,
      dueDate: { $lte: endOfToday() },
    };
    if (topic) filter.topic = String(topic).toLowerCase().trim();

    const cards = await Card.find(filter).sort({ dueDate: 1, createdAt: 1 });
    res.json({ cards, count: cards.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch due cards.' });
  }
};

const reviewCard = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!['again', 'hard', 'good', 'easy'].includes(rating)) {
      return res.status(400).json({
        message: 'Rating must be again, hard, good, or easy.',
      });
    }

    const card = await Card.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    const next = applySm2(
      {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
      },
      rating
    );

    Object.assign(card, next);
    await card.save();

    // Update streak
    const user = await User.findById(req.user._id);
    const today = dateKey();
    if (user.lastReviewDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = dateKey(yesterday);

      if (user.lastReviewDate === yKey) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.lastReviewDate = today;
      await user.save();
    }

    res.json({
      card,
      streak: user.streak,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Review failed.' });
  }
};

const dashboard = async (req, res) => {
  try {
    const owner = req.user._id;
    const todayEnd = endOfToday();
    const todayStart = startOfToday();

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [
      total,
      dueToday,
      mastered,
      reviewedToday,
      upcoming,
      byTopic,
      user,
    ] = await Promise.all([
      Card.countDocuments({ owner }),
      Card.countDocuments({ owner, dueDate: { $lte: todayEnd } }),
      Card.countDocuments({ owner, repetitions: { $gte: 3 }, interval: { $gte: 21 } }),
      Card.countDocuments({
        owner,
        lastReviewedAt: { $gte: todayStart, $lte: todayEnd },
      }),
      Card.find({
        owner,
        dueDate: { $gt: todayEnd, $lte: weekEnd },
      })
        .sort({ dueDate: 1 })
        .limit(10)
        .select('front topic dueDate interval'),
      Card.aggregate([
        { $match: { owner: req.user._id } },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.findById(owner).select('streak lastReviewDate name'),
    ]);

    const masteryRate = total ? Math.round((mastered / total) * 100) : 0;

    res.json({
      stats: {
        total,
        dueToday,
        mastered,
        masteryRate,
        reviewedToday,
        streak: user?.streak || 0,
        lastReviewDate: user?.lastReviewDate || null,
      },
      upcoming,
      byTopic: byTopic.map((t) => ({ topic: t._id, count: t.count })),
      topics: TOPICS,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to load dashboard.' });
  }
};

const listTopics = (_req, res) => {
  res.json({ topics: TOPICS });
};

module.exports = {
  listCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  dueQueue,
  reviewCard,
  dashboard,
  listTopics,
};
