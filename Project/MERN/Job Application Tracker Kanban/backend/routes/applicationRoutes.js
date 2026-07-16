const express = require('express');
const {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  moveApplication,
  deleteApplication,
  dashboard,
  listStatuses,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/meta/statuses', listStatuses);
router.get('/dashboard/stats', dashboard);
router.get('/', listApplications);
router.get('/:id', getApplication);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.patch('/:id/move', moveApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
