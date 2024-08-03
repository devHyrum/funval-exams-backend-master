import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  timer: { type: Number },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['simple', 'multiple', 'video'], required: true },
    options: [{ type: String }],
    correctAnswer: { type: String }
  }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);