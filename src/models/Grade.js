import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  videoScore: { type: Number },
  submitted: { type: Date, default: Date.now },
});

export default mongoose.model('Grade', gradeSchema);