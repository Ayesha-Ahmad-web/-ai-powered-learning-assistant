'use strict';

const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
} = require('../controllers/quizController');

console.log('quiz functions:', {
  getQuizzes:    typeof getQuizzes,
  getQuizById:   typeof getQuizById,
  submitQuiz:    typeof submitQuiz,
  getQuizResults:typeof getQuizResults,
  deleteQuiz:    typeof deleteQuiz,
});

router.get('/',            protect, getQuizzes);
router.get('/:id',         protect, getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/results', protect, getQuizResults);
router.delete('/:id',      protect, deleteQuiz);

module.exports = router;