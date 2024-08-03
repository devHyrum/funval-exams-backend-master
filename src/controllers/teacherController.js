import User from '../models/User.js';

export const assignStudentsToLevel = async (req, res) => {
  try {
    const { studentIds, level } = req.body;
    await User.updateMany(
      { _id: { $in: studentIds }, role: 'student' },
      { $set: { level: level } }
    );
    res.status(200).json({ message: 'Students assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const gradeExam = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const { score, videoScore } = req.body;
    
    const grade = new Grade({
      student: studentId,
      exam: examId,
      score,
      videoScore
    });
    
    await grade.save();
    res.status(200).json({ message: 'Exam graded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};