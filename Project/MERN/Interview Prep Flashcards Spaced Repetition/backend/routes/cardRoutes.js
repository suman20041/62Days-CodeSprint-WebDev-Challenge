const express = require('express');
const {
  listCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  dueQueue,
  reviewCard,
  dashboard,
  listTopics,
} = require('../controllers/cardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/meta/topics', listTopics);
router.get('/dashboard/stats', dashboard);
router.get('/review/due', dueQueue);
router.post('/:id/review', reviewCard);
router.get('/', listCards);
router.get('/:id', getCard);
router.post('/', createCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
