import mongoose from 'mongoose';
export default mongoose.model('Project', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String, key: String
}, { timestamps: true }));
