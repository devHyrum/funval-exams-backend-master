import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['simple', 'multiple', 'video'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String
  },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }
});

export default mongoose.model('Question', questionSchema);