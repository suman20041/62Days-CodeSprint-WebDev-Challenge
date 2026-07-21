import mongoose from 'mongoose';
export default mongoose.model('Flag', new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  key: String, description: String, enabled: { type: Boolean, default: false },
  percentage: { type: Number, default: 0 },
  segments: [{ name: String, emails: [String] }],
  versions: [{ at: Date, by: String, snapshot: Object }]
}, { timestamps: true }));
