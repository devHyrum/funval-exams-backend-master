import express from 'express';
import { getCurrentUser, getStudents, updateProfile, uploadProfilePicture } from '../controllers/userController.js';
import { auth, teacherAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateProfile);
router.post('/me/profile-picture', auth, upload.single('profilePicture'), uploadProfilePicture);
router.get('/students', auth, teacherAuth, getStudents);

export default router;