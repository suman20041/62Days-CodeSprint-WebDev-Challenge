const mongoose = require('mongoose');

const STATUSES = ['applied', 'interview', 'offer', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'applied',
      index: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    salary: {
      type: String,
      trim: true,
      maxlength: 60,
      default: '',
    },
    jobUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    notes: {
      type: String,
      maxlength: 5000,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({
  company: 'text',
  role: 'text',
  notes: 'text',
  location: 'text',
});

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUSES = STATUSES;
