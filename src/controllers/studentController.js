import Exam from '../models/Exam.js';
import Grade from '../models/Grade.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

export const getExamsByLevel = async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.user);

    const student = await Student.findOne({ userId: req.user._id }).populate('currentLevel');
    console.log('Estudiante encontrado:', student);

    if (!student || !student.currentLevel) {
      console.log('Estudiante o nivel no encontrado');
      return res.status(404).json({ error: 'Estudiante o nivel no encontrado' });
    }

    console.log('Buscando exámenes para el nivel:', student.currentLevel._id);
    const exams = await Exam.find({ level: student.currentLevel._id });
    console.log('Exámenes encontrados:', exams);

    res.json(exams);
  } catch (error) {
    console.error('Error detallado en getExamsByLevel:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};



export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;
    

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }

     // Verificar si ya existe una calificación para este estudiante y examen
     let existingGrade = await Grade.findOne({ student: studentId, exam: examId });
    
     if (existingGrade) {
       return res.status(400).json({ error: 'Ya has realizado este examen' });
     }

    let score = 0;
    exam.questions.forEach((question) => {
      const studentAnswer = answers[question._id.toString()];
      if (studentAnswer && question.correctAnswer.toLowerCase() === studentAnswer.toLowerCase()) {
        score++;
      }
    });
    const finalScore = (score / exam.questions.length) * 100;

    const grade = new Grade({
      student: studentId,
      exam: examId,
      score: finalScore,
      answers
    });
    await grade.save();

    // Actualizar el nivel del estudiante si es necesario
    await updateStudentLevel(studentId, finalScore, exam.level);
    
    res.status(200).json({ message: 'Examen enviado con éxito', grade });
  } catch (error) {
    console.error('Error al enviar el examen:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id }).populate('exam');
    const average = grades.length > 0 
      ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length 
      : 0;
    
    res.status(200).json({ grades, average });
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
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
    try {
      const student = await Student.findOne({ userId: studentId }).populate('currentLevel');
      if (!student) return;
  
      if (score >= 80 && examLevel) {
        if (student.currentLevel._id.toString() !== examLevel._id.toString()) {
          student.currentLevel = examLevel;
          student.history.push({
            level: examLevel,
            assignedAt: new Date()
          });
          await student.save();
        }
      }
    } catch (error) {
      console.error('Error al actualizar el nivel del estudiante:', error);
    }
  }

  export const getAllStudentGrades = async (req, res) => {
    try {
      const students = await User.find({ role: 'student' }).select('name lastName');
      const gradesPromises = students.map(async (student) => {
        const grades = await Grade.find({ student: student._id }).populate('exam', 'title');
        const average = grades.length > 0 
          ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length 
          : 0;
        return {
          _id: student._id,
          name: student.name,
          lastName: student.lastName,
          level: student.level, // Asumiendo que el nivel está en el modelo de Usuario
          grades: grades.map(g => ({ 
            examTitle: g.exam ? g.exam.title : 'N/A', 
            score: g.score 
          })),
          average: parseFloat(average.toFixed(2))
        };
      });
      const studentsWithGrades = await Promise.all(gradesPromises);
      res.json(studentsWithGrades);
    } catch (error) {
      console.error('Error in getAllStudentGrades:', error);
      res.status(500).json({ error: error.message });
    }
  };