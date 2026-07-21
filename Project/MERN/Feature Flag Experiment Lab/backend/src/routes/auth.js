import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const r = Router();
r.post('/register', async (req, res) => {
  const user = await User.create({ name: req.body.name, email: req.body.email, password: await bcrypt.hash(req.body.password, 10) });
  res.json({
    token: jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' }),
    user: { email: user.email, name: user.name }
  });
});
r.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(400).json({ message: 'Invalid' });
  res.json({
    token: jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' }),
    user: { email: user.email, name: user.name }
  });
});
export default r;
