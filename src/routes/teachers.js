import express from 'express';
import { assignStudentsToLevel, gradeExam } from '../controllers/teacherController.js';
import { auth, teacherAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/assign-students', auth, teacherAuth, assignStudentsToLevel);
router.post('/grade-exam/:examId/:studentId', auth, teacherAuth, gradeExam);

export default router;