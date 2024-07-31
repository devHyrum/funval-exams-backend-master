/* import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router; */

import express from 'express';
import { register, login } from '../controllers/authController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);

export default router;