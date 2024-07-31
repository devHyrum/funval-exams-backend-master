import express from 'express';
import { uploadVideo, getVideos } from '../controllers/videoController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', auth, upload.single('video'), uploadVideo);
router.get('/', auth, getVideos);

export default router;