/* import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  videoUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema); */

// src/models/Video.js

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grade: { type: Number },
  submitted: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);