import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const teacherAuth = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Access denied. Teachers only.' });
  }
  next();
};

export const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Access denied. Students only.' });
  }
  next();
};