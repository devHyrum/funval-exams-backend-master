import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js'; 

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    console.log('Usuario autenticado:', req.user);
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
}; 



export const teacherAuth = (req, res, next) => {
  console.log('Rol del usuario:', req.user.role);
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Access denied. Teachers only.' });
  }
  next();
};

/* export const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Access denied. Students only.' });
  }
  next();
}; */

/* export const studentAuth = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(403).json({ error: 'Acceso denegado. Solo para estudiantes.' });
    }
    req.student = student;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error en la autenticación de estudiante' });
  }
}; */

/* export const studentAuth = async (req, res, next) => {

  try {
    console.log('Verificando estudiante para usuario:', req.user._id);
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      console.log('No se encontró estudiante para el usuario:', req.user._id);
      return res.status(403).json({ error: 'Acceso denegado. Solo para estudiantes.' });
    }
    console.log('Estudiante encontrado:', student);
    req.student = student;
    next();
  } catch (error) {
    console.error('Error en middleware studentAuth:', error);
    res.status(500).json({ error: 'Error en la autenticación de estudiante' });
  }
};
 */


export const studentAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Acceso denegado. Solo para estudiantes.' });
    }
    next();
  } catch (error) {
    console.error('Error en middleware studentAuth:', error);
    res.status(500).json({ error: 'Error en la autenticación de estudiante' });
  }
};