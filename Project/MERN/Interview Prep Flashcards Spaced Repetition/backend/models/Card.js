const mongoose = require('mongoose');

const TOPICS = [
  'javascript',
  'react',
  'nodejs',
  'mongodb',
  'system-design',
  'dsa',
  'css',
  'typescript',
  'behavioral',
  'general',
];

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: [true, 'Front (question) is required'],
      trim: true,
      maxlength: 2000,
    },
    back: {
      type: String,
      required: [true, 'Back (answer) is required'],
      trim: true,
      maxlength: 5000,
    },
    topic: {
      type: String,
      enum: TOPICS,
      default: 'general',
      index: true,
    },
    hint: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // SM-2 fields
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    interval: {
      type: Number,
      default: 0,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
    lastRating: {
      type: String,
      enum: ['again', 'hard', 'good', 'easy'],
      default: undefined,
    },
  },
  { timestamps: true }
);

cardSchema.index({ front: 'text', back: 'text', topic: 'text' });

module.exports = mongoose.model('Card', cardSchema);
module.exports.TOPICS = TOPICS;
