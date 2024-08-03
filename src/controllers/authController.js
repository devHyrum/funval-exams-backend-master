import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password, phone, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = new User({ 
      name, 
      lastName, 
      email, 
      password, 
      phone, 
      role,
      profilePicture: req.file ? req.file.path : undefined
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone, 
        role: user.role,
        profilePicture: user.profilePicture
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};