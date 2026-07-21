import mongoose from 'mongoose';
export default mongoose.model('Audit', new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  flagKey: String, action: String, by: String, detail: Object, at: { type: Date, default: Date.now }
}));
