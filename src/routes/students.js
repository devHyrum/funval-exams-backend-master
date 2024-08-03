import express from 'express';
import { getExamsByLevel, submitExam, getStudentGrades, getAllStudentGrades } from '../controllers/studentController.js';
import { auth, studentAuth,teacherAuth } from '../middleware/auth.js';
import { assignLevel, getStudents, createStudent } from '../controllers/studentsController.js';
const router = express.Router();

router.get('/exams', auth, studentAuth, getExamsByLevel);
router.post('/submit-exam/:examId', auth, studentAuth, submitExam);
router.post('/assign-level', auth, teacherAuth, assignLevel);
router.get('/', auth, teacherAuth, getStudents);
router.post('/', createStudent);
router.get('/grades', auth, studentAuth, getStudentGrades);
router.get('/student-grades', auth, teacherAuth, getStudentGrades);
router.get('/all-grades', auth, teacherAuth, getAllStudentGrades);

export default router;