import Level from '../models/Level.js';

export const createLevel = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newLevel = new Level({ name, description });
    await newLevel.save();
    res.status(201).json(newLevel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating level' });
  }
};

export const getLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels' });
  }
}