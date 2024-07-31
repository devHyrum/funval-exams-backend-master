import Student from '../models/Student.js';
import Level from '../models/Level.js';
import User from '../models/User.js';

export const assignLevel = async (req, res) => {
  try {
    const { studentId, levelId } = req.body;
    const student = await Student.findOne({ userId: studentId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    student.currentLevel = level._id;
    student.history.push({ level: level._id });
    await student.save();

    res.status(200).json({ message: 'Level assigned successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId').populate('currentLevel');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({ error: 'User not found or not a student' });
    }

    const student = new Student({ userId });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
