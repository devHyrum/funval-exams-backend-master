import express from 'express';
import { getVideos, gradeVideo, uploadVideo } from '../controllers/videoController.js';
import { auth, teacherAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', auth, getVideos);
router.post('/:videoId/grade', auth, teacherAuth, gradeVideo);
router.post('/upload', auth, upload.single('video'), uploadVideo);

export default router;