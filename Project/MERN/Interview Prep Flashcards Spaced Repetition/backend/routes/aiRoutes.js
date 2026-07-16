const express = require('express');
const {
  status,
  generateCards,
  generateHint,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/status', protect, status);
router.post('/generate-cards', protect, generateCards);
router.post('/hint', protect, generateHint);

module.exports = router;
