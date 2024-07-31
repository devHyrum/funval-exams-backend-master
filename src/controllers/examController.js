import Exam from '../models/Exam.js';

export const createExam = async (req, res) => {
  try {
    const { title, level, questions } = req.body;

    // Validación de datos
    if (!title || !level || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Datos de examen inválidos. Se requiere título, nivel y al menos una pregunta.' });
    }

    const exam = new Exam({
      title,
      level,
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
    const exams = await Exam.find({ creator: req.user._id });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { title, level, questions } = req.body;
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { title, level, questions },
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
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