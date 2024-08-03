import Exam from '../models/Exam.js';
import Video from '../models/Video.js';
import Grade from '../models/Grade.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 export const submitExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }

    let score = 0;
    exam.questions.forEach((question, index) => {
      if (question.type !== 'video') {
        const studentAnswer = answers[question._id.toString()];
        if (studentAnswer && question.correctAnswer.toLowerCase() === studentAnswer.toLowerCase()) {
          score++;
        }
      }
    });

    let finalScore = (score / exam.questions.filter(q => q.type !== 'video').length) * 100;

    // Manejo de video si existe
    if (req.file) {
      const videoPath = path.join(__dirname, '../../uploads/videos', req.file.filename);
      const video = new Video({
        url: `/uploads/videos/${req.file.filename}`,
        exam: id,
        student: studentId
      });
      await video.save();
    }

    const grade = new Grade({
      student: studentId,
      exam: id,
      score: finalScore,
      answers
    });
    await grade.save();

    res.status(200).json({ message: 'Examen enviado con éxito', grade });
  } catch (error) {
    console.error('Error al enviar el examen:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}; 

export const createExam = async (req, res) => {
  try {
    const { title, level, timer, questions } = req.body;

    const exam = new Exam({
      title,
      level,
      timer,
      questions,
      creator: req.user._id
    });
    await exam.save();

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error al crear examen:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('level');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los exámenes' });
  }
};

export const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json(updatedExam);
  } catch (error) {
    console.error('Error al actualizar el examen:', error);
    res.status(500).json({ message: 'Error al actualizar el examen', error: error.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('level');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los exámenes' });
  }
};