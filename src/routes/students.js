import express from 'express';
import { getExamsByLevel, submitExam, getStudentGrades } from '../controllers/studentController.js';
import { auth, studentAuth } from '../middleware/auth.js';
import { assignLevel, getStudents, createStudent } from '../controllers/studentsController.js';
const router = express.Router();

router.get('/exams', auth, studentAuth, getExamsByLevel);
router.post('/submit-exam/:examId', auth, studentAuth, submitExam);
router.post('/assign-level', auth, assignLevel);
router.get('/', auth, getStudents);
router.post('/', createStudent);
router.get('/grades', auth, studentAuth, getStudentGrades);

export default router;