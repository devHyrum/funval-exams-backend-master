import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import studentRoutes from './routes/students.js';
import levelRoutes from './routes/levels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes)
app.use('/api/levels', levelRoutes);
app.use('/api/exams', (req, res, next) => {
    console.log('Recibida solicitud a /api/exams');
    next();
  }, examRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
  });

export default app;