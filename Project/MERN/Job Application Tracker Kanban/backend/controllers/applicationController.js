const Application = require('../models/Application');
const { STATUSES } = require('../models/Application');

const buildFilter = (ownerId, query) => {
  const filter = { owner: ownerId };
  const { q, status, company, role, deadlineFrom, deadlineTo } = query;

  if (status && STATUSES.includes(String(status).toLowerCase())) {
    filter.status = String(status).toLowerCase();
  }

  if (company && String(company).trim()) {
    filter.company = new RegExp(String(company).trim(), 'i');
  }

  if (role && String(role).trim()) {
    filter.role = new RegExp(String(role).trim(), 'i');
  }

  if (q && String(q).trim()) {
    filter.$text = { $search: String(q).trim() };
  }

  if (deadlineFrom || deadlineTo) {
    filter.deadline = {};
    if (deadlineFrom) filter.deadline.$gte = new Date(deadlineFrom);
    if (deadlineTo) {
      const end = new Date(deadlineTo);
      end.setHours(23, 59, 59, 999);
      filter.deadline.$lte = end;
    }
  }

  return filter;
};

const listApplications = async (req, res) => {
  try {
    const filter = buildFilter(req.user._id, req.query);
    const applications = await Application.find(filter).sort({
      status: 1,
      order: 1,
      updatedAt: -1,
    });
    res.json({ applications });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch applications.' });
  }
};

const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    res.json({ application });
  } catch (_error) {
    res.status(404).json({ message: 'Application not found.' });
  }
};

const createApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      location,
      salary,
      jobUrl,
      notes,
      deadline,
      appliedDate,
    } = req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ message: 'Company and role are required.' });
    }

    const nextStatus = STATUSES.includes(status) ? status : 'applied';
    const count = await Application.countDocuments({
      owner: req.user._id,
      status: nextStatus,
    });

    const application = await Application.create({
      company: company.trim(),
      role: role.trim(),
      status: nextStatus,
      location: (location || '').trim(),
      salary: (salary || '').trim(),
      jobUrl: (jobUrl || '').trim(),
      notes: notes || '',
      deadline: deadline || null,
      appliedDate: appliedDate || new Date(),
      order: count,
      owner: req.user._id,
    });

    res.status(201).json({ application });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to create application.' });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const fields = [
      'company',
      'role',
      'location',
      'salary',
      'jobUrl',
      'notes',
      'deadline',
      'appliedDate',
      'order',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status.' });
      }
      application.status = req.body.status;
    }

    await application.save();
    res.json({ application });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to update application.' });
  }
};

const moveApplication = async (req, res) => {
  try {
    const { status, order } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    application.status = status;
    if (typeof order === 'number') application.order = order;
    await application.save();

    res.json({ application });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to move application.' });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    await application.deleteOne();
    res.json({ message: 'Application deleted.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to delete application.' });
  }
};

const dashboard = async (req, res) => {
  try {
    const owner = req.user._id;
    const now = new Date();
    const week = new Date();
    week.setDate(week.getDate() + 7);

    const [byStatus, total, upcomingDeadlines] = await Promise.all([
      Application.aggregate([
        { $match: { owner } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Application.countDocuments({ owner }),
      Application.find({
        owner,
        deadline: { $gte: now, $lte: week },
      })
        .sort({ deadline: 1 })
        .limit(8)
        .select('company role status deadline'),
    ]);

    const counts = STATUSES.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {});

    byStatus.forEach((row) => {
      counts[row._id] = row.count;
    });

    res.json({
      stats: {
        total,
        applied: counts.applied,
        interview: counts.interview,
        offer: counts.offer,
        rejected: counts.rejected,
      },
      upcomingDeadlines,
      statuses: STATUSES,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to load dashboard.' });
  }
};

const listStatuses = (_req, res) => {
  res.json({ statuses: STATUSES });
};

module.exports = {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  moveApplication,
  deleteApplication,
  dashboard,
  listStatuses,
};
