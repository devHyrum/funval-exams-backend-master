import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentLevel: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  history: [{
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
    assignedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);