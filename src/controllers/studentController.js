/* import Exam from '../models/Exam.js';
import Grade from '../models/Grade.js';

export const getExamsByLevel = async (req, res) => {
  try {
    const exams = await Exam.find({ level: req.user.level });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers, videoUrl } = req.body;
    
    // Lógica para calcular la puntuación basada en las respuestas
    // Esto es un ejemplo simplificado
    const score = calculateScore(answers);
    
    const grade = new Grade({
      student: req.user._id,
      exam: examId,
      score,
      videoUrl
    });
    
    await grade.save();
    res.status(200).json({ message: 'Exam submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateScore(answers) {
  // Implementar lógica de puntuación
  return 0; // Placeholder
} */

// src/controllers/studentController.js
import Exam from '../models/Exam.js';
import Grade from '../models/Grade.js';
import User from '../models/User.js';

export const getExamsByLevel = async (req, res) => {
  try {
    const exams = await Exam.find({ level: req.user.level });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers, videoUrl } = req.body;
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }

    const score = calculateScore(answers, exam.questions);
    
    const grade = new Grade({
      student: req.user._id,
      exam: examId,
      score,
      videoUrl,
      answers
    });
    
    await grade.save();

    // Actualizar el nivel del estudiante si es necesario
    await updateStudentLevel(req.user._id, score, exam.level);

    res.status(200).json({ message: 'Examen enviado con éxito', grade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id }).populate('exam');
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateScore(studentAnswers, examQuestions) {
  let score = 0;
  examQuestions.forEach((question, index) => {
    if (question.correctAnswer === studentAnswers[index]) {
      score++;
    }
  });
  return (score / examQuestions.length) * 100;
}

async function updateStudentLevel(studentId, score, examLevel) {
  const levelOrder = ['Elementary', 'A1', 'A2', 'B1'];
  if (score >= 80) {
    const currentLevelIndex = levelOrder.indexOf(examLevel);
    if (currentLevelIndex < levelOrder.length - 1) {
      const newLevel = levelOrder[currentLevelIndex + 1];
      await User.findByIdAndUpdate(studentId, { level: newLevel });
    }
  }
}