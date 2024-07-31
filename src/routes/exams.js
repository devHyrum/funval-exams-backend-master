import express from 'express';
import { createExam, getExams, getExam, updateExam, deleteExam } from '../controllers/examController.js';
import { auth, teacherAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, teacherAuth, createExam);
router.get('/', auth, getExams);
router.get('/:id', auth, getExam);
router.put('/:id', auth, teacherAuth, updateExam);
router.delete('/:id', auth, teacherAuth, deleteExam);

export default router;