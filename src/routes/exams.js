import express from 'express';
import { createExam, getExams, getExam, updateExam, deleteExam, submitExam } from '../controllers/examController.js';
import { auth, teacherAuth, studentAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', auth, teacherAuth, createExam);
router.get('/', auth, getExams);
router.get('/:id', auth, getExam);
router.put('/:id', auth, teacherAuth, updateExam);
router.delete('/:id', auth, teacherAuth, deleteExam);
router.post('/:id/submit', auth, studentAuth, upload.single('video'), submitExam);

export default router;