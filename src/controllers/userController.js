import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    req.user.profilePicture = req.file.path;
    await req.user.save();
    res.send({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener el usuario actual' });
  }
};