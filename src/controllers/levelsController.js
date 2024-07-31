import Level from '../models/Level.js';

export const createLevel = async (req, res) => {
  try {
    const { name } = req.body;
    const level = new Level({ name });
    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
