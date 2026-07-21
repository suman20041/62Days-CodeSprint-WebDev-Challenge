import { Router } from 'express';
import crypto from 'crypto';
import Project from '../models/Project.js';
import Flag from '../models/Flag.js';
import Audit from '../models/Audit.js';
import { auth } from '../middleware/auth.js';
const r = Router();
function bucket(userKey, flagKey) {
  const h = crypto.createHash('sha256').update(userKey + '|' + flagKey).digest('hex');
  return parseInt(h.slice(0, 8), 16) % 100;
}
function evalFlag(flag, user = {}) {
  if (!flag.enabled) return false;
  for (const seg of flag.segments || []) {
    if ((seg.emails || []).includes(user.email)) return true;
  }
  return bucket(user.key || user.email || 'anon', flag.key) < (flag.percentage || 0);
}
r.get('/eval/:projectKey', async (req, res) => {
  const project = await Project.findOne({ key: req.params.projectKey });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const flags = await Flag.find({ project: project._id });
  const user = { email: req.query.email, key: req.query.key || req.query.email };
  const result = {};
  for (const f of flags) result[f.key] = evalFlag(f, user);
  res.json({ project: project.key, flags: result });
});
r.use(auth);
r.get('/projects', async (req, res) => res.json(await Project.find({ owner: req.user.id })));
r.post('/projects', async (req, res) => res.status(201).json(await Project.create({
  owner: req.user.id, name: req.body.name, key: req.body.key || ('proj_' + Date.now())
})));
r.get('/projects/:id/flags', async (req, res) => res.json(await Flag.find({ project: req.params.id })));
r.post('/projects/:id/flags', async (req, res) => {
  const flag = await Flag.create({
    project: req.params.id, key: req.body.key, description: req.body.description,
    enabled: !!req.body.enabled, percentage: req.body.percentage || 0,
    segments: req.body.segments || [], versions: []
  });
  await Audit.create({ project: req.params.id, flagKey: flag.key, action: 'create', by: req.user.email, detail: flag });
  res.status(201).json(flag);
});
r.put('/flags/:id', async (req, res) => {
  const flag = await Flag.findById(req.params.id);
  if (!flag) return res.status(404).json({ message: 'Not found' });
  flag.versions.push({ at: new Date(), by: req.user.email, snapshot: flag.toObject() });
  Object.assign(flag, {
    enabled: req.body.enabled ?? flag.enabled,
    percentage: req.body.percentage ?? flag.percentage,
    description: req.body.description ?? flag.description,
    segments: req.body.segments ?? flag.segments
  });
  await flag.save();
  await Audit.create({ project: flag.project, flagKey: flag.key, action: 'update', by: req.user.email, detail: req.body });
  res.json(flag);
});
r.get('/projects/:id/audit', async (req, res) => res.json(await Audit.find({ project: req.params.id }).sort({ at: -1 }).limit(50)));
export default r;
