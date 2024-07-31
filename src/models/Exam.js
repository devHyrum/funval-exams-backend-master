import mongoose from 'mongoose';

/* const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
}); */
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['simple', 'multiple', 'video'], required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
});

/* const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, required: true },
  questions: [questionSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); */

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['Elementary', 'A1', 'A2', 'B1'], required: true },
  timer: { type: Number }, // tiempo en minutos
  questions: [questionSchema],
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);